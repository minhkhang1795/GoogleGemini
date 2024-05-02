import logging
import time
import json
from itertools import batched

import google.generativeai as genai
import PIL.Image
from google.generativeai import GenerationConfig
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from snapeat.apis.UserProfile import UserProfile


class GeminiModel:
    def __init__(self, api_key=None):
        if api_key is None:
            logging.error('GOOGLE_API_KEY is None')
            return

        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-pro-latest',
                                           generation_config=self.create_generation_config(),
                                           safety_settings=self.create_safety_config())

    @staticmethod
    def create_generation_config():
        return GenerationConfig(
            temperature=0.4,
            top_p=1,
            top_k=32,
            candidate_count=1,
            max_output_tokens=4096,
            response_mime_type="application/json",
        )

    @staticmethod
    def create_safety_config():
        return {
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        }

    def recommend_restaurant(self, location, user_profile, search_prompt):
        """
        Ask Gemini to recommend restaurants based on user profile and the search prompt.
        @param location: the location to search for.
        @param user_profile: the user profile.
        @param search_prompt: the search prompt.
        @return: a list of restaurant recommendations.
        """
        recommendations = []
        error = None
        start_time = time.perf_counter()
        try:
            logging.info(
                f'Recommending restaurant with location {location}, search prompt {search_prompt} for user profile: {user_profile.get_user_profile()}')
            prompt = (
                "From the location, search_prompt and user_profile provided below, create a JSON file of restaurant recommendations."
                "The search prompt is the input the user provided to find restaurants. If the provided search prompt is inappropriate, just recommend based on user profile and their location. "
                "The user profile is their dietary and food preferences. "
                "The output will be a JSON array of restaurant recommendations. Each recommendation must have these 2 attributes:\n"
                "- name: the name of the restaurant based on your knowledge that could suit the user profile, their location and the search prompt.\n"
                "- description: the description of restaurant with some explanation to explain why you think the user will love this restaurant. "
                "Please refer to the user as you/your and make it sound user friendly.\n"
            )
            response_input = ["location: " + location,
                              "user_profile: " + user_profile.get_user_profile(),
                              "search_prompt: " + search_prompt,
                              "output: "]
            response = self.model.generate_content([prompt] + response_input)
            response.resolve()
            if response.text:
                recommendations = json.loads(response.text)
                if recommendations is None or len(recommendations) == 0:
                    error = "Failed to recommend restaurant to user."
            else:
                error = "Failed to recommend restaurant to user."
        except Exception as e:
            logging.error(f'{type(e).__name__}: {e}')
            error = f'Failed to recommend restaurant to user: {e}'

        elapsed_time = time.perf_counter() - start_time
        logging.info(f'{elapsed_time} seconds. Restaurant result: {recommendations}')
        return recommendations, error

    def menu_image_to_text(self, image):
        """
        Ask Gemini to look at a menu image and return the menu text in json format.
        @param image: the menu image
        @return: the menu text in json format.
        """
        text = None
        error = None
        start_time = time.perf_counter()
        try:
            logging.info(f'analyzing menu image {image}')
            img = PIL.Image.open(image)
            response = self.model.generate_content(
                [
                    "look at the following picture and tell me what's on the menu in json format. If the picture is not a menu, return an empty json array. "
                    "Otherwise, each item in the list should have these attributes:\n"
                    "- name: the name of the dish copied from the image.\n"
                    "- description: from the description of the dish copied from the image, please provide a descriptive text to help user understand the dish better. If description is not available, generate a description based on the name of the dish\n"
                    "- price: the price of the dish as a string with a dollar symbol in front. The price must be a string because it might be a price range. If there is no price, please leave the field as an empty string.\n"
                    "- category: please classify the dish as one of these categories: Appetizers, Main Courses, Desserts, or Drinks. If nothing fits, please leave it as Other. Beware of the dish category name, don't include the section name into the json list.\n"
                    "If the menu is not in English, translate it to English and do not include special characters from other languages.",
                    img])
            response.resolve()
            if response.text:
                text = response.text
                if text is None or text == "" or text == "[]\n" or text == "[]":
                    error = f'Failed to read menu image. Please make sure the image is clear and try again!'
            else:
                error = f'Gemini failed to analyze the menu image.'
        except Exception as e:
            logging.error(f'{type(e).__name__}: {e}')
            error = f'Gemini failed to analyze the menu image: {e}'

        elapsed_time = time.perf_counter() - start_time
        logging.info(f'{elapsed_time} seconds. Menu result: {text}')
        return text, error

    def recommend_menu_items(self, user_profile: UserProfile, menu_json, GGreview=None, ChefRec=None):
        """
        Ask Gemini to recommend dishes from the menu and user profile in batch requests
        @param user_profile: the user profile
        @param menu_json: the menu in json format
        @param GGreview: Google reviews (optional)
        @param ChefRec: Chef recommendations (optional)
        @return: a list of recommended dishes.
        """
        error = None
        try:
            menu_batch = list(batched(menu_json, 15))
            for i, menu in enumerate(menu_batch):
                menu_with_recommendations, error = self._recommend_menu_items(i, user_profile, menu, GGreview, ChefRec)
                if error is not None:
                    logging.error(error)

                self._merge_recommended_menu(menu_json, menu_with_recommendations)
        except Exception as e:
            logging.error(f'{type(e).__name__}: {e}')
            error = f'Failed to recommend dishes from the menu: {e}'

        return menu_json, error

    def _recommend_menu_items(self, request_number, user_profile: UserProfile, menu_json, GGreview=None, ChefRec=None):
        """
        Ask Gemini to recommend dishes from the menu and user profile.
        @param request_number: the request number in this batch.
        @param user_profile: the user profile
        @param menu_json: the menu in json format
        @param GGreview: Google reviews (optional)
        @param ChefRec: Chef recommendations (optional)
        @return: a list of recommended dishes.
        """
        menu_with_recommendations = []
        error = None
        start_time = time.perf_counter()
        try:
            logging.info(
                f'Menu batch {request_number} has {len(menu_json)} items. Recommending menu items for user profile: {user_profile.get_user_profile()}')
            prompt_input = "From the user_profile, menu "
            response_input = []

            if ChefRec is not None and ChefRec != "":
                prompt_input += ", Chef Recommendation "
                response_input.append("Chef_Recommendation: " + ChefRec)
            if GGreview is not None and GGreview != "":
                prompt_input += ", Google Review "
                response_input.append("Google_Review: " + GGreview)

            prompt = (
                    prompt_input + "provided below, create a JSON file of dish recommendations."
                                   "The output will have the same format as the menu JSON file with these attributes:\n"
                                   "- name: the name of the dish copied from the menu json.\n"
                                   "- description: description of the dish copied from the menu json.\n"
                                   "- match_score: this is an integer value from 0 to 100 for each item on the menu (0 means the user cannot eat this or feels unpleasant to eat it, and 100 means perfect match with the user preferences). "
                                   "Dietary and Allergies from the user profile should be prioritized first. Dietary and Allergies information might not be provided in the input so please treat them as optional factors in match_score evaluation. "
                                   "The user's cuisine preference should weighted more than the user's preferred flavors. Remember that they prefer some cuisines and flavors does not equate to they can only eat those cuisines or flavors. "
                                   "When calculating the match_score, the flavor and cuisine can only be weighted equally when the flavor is indicated as extreme. "
                                   "All the dishes in the menu are from the same restaurant and are very likely from the same cuisine.\n"
                                   "- match_explanation: explains the match_score you gave for each dish to help user understand why you recommend or not recommend the dish. Please make sure that the explanations from one dish to another have different sentence structure to make it less boring. "
                                   "You should not refer to previous dish as the dishes might be shuffled."
            )
            response_input.append("user_profile: " + user_profile.get_user_profile())
            response_input.append("menu: " + json.dumps(self._get_name_and_description(menu_json)))
            response_input.append("name: ")
            response_input.append("description: ")
            response_input.append("match_score: ")
            response_input.append("match_explanation: ")
            response = self.model.generate_content([prompt] + response_input)
            response.resolve()
            if response.text:
                menu_with_recommendations = json.loads(response.text)
                if menu_with_recommendations is None or len(menu_with_recommendations) == 0:
                    error = "Failed to recommend dishes from the menu."
            else:
                error = "Failed to recommend dishes from the menu."
        except Exception as e:
            logging.error(f'{type(e).__name__}: {e}')
            error = f'Failed to recommend dishes from the menu: {e}'

        elapsed_time = time.perf_counter() - start_time
        logging.info(f'{elapsed_time} seconds. Menu result: {menu_with_recommendations}')
        return menu_with_recommendations, error

    def _merge_recommended_menu(self, menu, menu_with_recommendations):
        """
        Merge the menu with recommendation menu from Gemini
        @param menu: the original menu.
        @param menu_with_recommendations: the menu from Gemini.
        @return:
        """
        for item in menu:
            for item_with_recommendations in menu_with_recommendations:
                if item["name"] == item_with_recommendations["name"]:
                    if "match_score" in item_with_recommendations:
                        item["match_score"] = item_with_recommendations["match_score"]
                    if "match_explanation" in item_with_recommendations:
                        item["match_explanation"] = item_with_recommendations["match_explanation"]
                    break

    def _get_name_and_description(self, menu):
        """
        Return a smaller name and description to speed up Gemini's processing time.
        @param menu: the original menu.
        @return: the simplified menu with name and description.
        """
        small_menu = []
        for item in menu:
            small_menu.append({"name": item["name"], "description": item["description"]})

        return small_menu

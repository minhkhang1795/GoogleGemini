import logging
import time

import google.generativeai as genai
import PIL.Image
from google.generativeai import GenerationConfig
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from snapeat.apis.UserProfile import UserProfile


class GeminiModel:
    def __init__(self, apikey=None):
        if apikey is None:
            logging.error('GOOGLE_API_KEY is None')
            return

        genai.configure(api_key=apikey)
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

    def menu_image_to_text(self, image):
        """
        Tell Gemini to look at a menu image and return the menu text in json format.
        @param image: the menu image
        @return: the menu text in json format.
        """
        text = None
        start_time = time.perf_counter()
        try:
            logging.info(f'analyzing menu image {image}')
            img = PIL.Image.open(image)
            response = self.model.generate_content(
                ["look at the following picture and tell me what's on the menu in json format. If the picture is not a menu, return an empty json array. "
                 "Otherwise, each item in the list should have these attributes:\n"
                 "- name: the name of the dish copied from the image.\n"
                 "- description: from the description of the dish copied from the image, please provide a descriptive text to help user understand the dish better. If description is not available, generate a description based on the name of the dish\n"
                 "- price: the price of the dish as a string with a dollar symbol in front. The price must be a string because it might be a price range.\n"
                 "- category: please classify the dish as one of these categories: Appetizers, Main Courses, Desserts, or Drinks. If nothing fits, please leave it as Other\n"
                 "If the menu is not in English, translate it to English. Beware of the dish category name, don't include the section name into the json list", img])
            response.resolve()
            if response.text:
                text = response.text
        except Exception as e:
            logging.error(f'{type(e).__name__}: {e}')

        elapsed_time = time.perf_counter() - start_time
        logging.info(f'{elapsed_time} seconds. Menu result: {text}')
        return text

    def recommend_menu_items(self, user_profile: UserProfile, menu: str, GGreview=None, ChefRec=None):
        text = None
        start_time = time.perf_counter()
        try:
            prompt_input = "From the User_Profile, Menu "
            response_input = []

            if ChefRec is not None and ChefRec != "":
                prompt_input += ", Chef Recommendation "
                response_input.append("Chef_Reccomendation: " + ChefRec)
            if GGreview is not None and GGreview != "":
                prompt_input += ", Google Review "
                response_input.append("Google_Review: " + GGreview)

            prompt = (
                    prompt_input + "provided below, create a JSON file of dish recommendations."
                                   "The output will have the same format as the menu JSON file with these attributes:\n"
                                   "- name: the name of the dish copied from the menu json.\n"
                                   "- description: description of the dish copied from the menu json.\n"
                                   "- price: the price of the dish copied from the menu json.\n"
                                   "- category: the category of the dish copied from the menu json.\n"
                                   "- match_score: this is an integer value from 0 to 100 for each item on the menu (0 means the user cannot eat this or feels unpleasant to eat it, and 100 means perfect match with the user preferences and the menu food)."
                                   "Dietary and Allergies from the user profile should be prioritized first. Dietary and Allergies information might not be provided in the input so please treat them as optional factors in match_score evaluation"
                                   "All the dishes in the menu are from the same restaurant and are very likely from the same cuisine. The user's cuisine preference should weighted more than the user's preferred flavors. "
                                   "Remember that they prefer some cuisines and flavors does not equate to they can only eat those cuisines or flavors."
                                   "When calculating the match_score, the flavor and cuisine can only be weighted equally when the flavor is indicated as extreme. You should not refer to previous dish as the dishes might be shuffled.\n"
                                   "- match_explanation: explains the match_score you gave for each dish to help user understand why you recommend or not recommend the dish. Please make sure that the explanations from one dish to another have different sentence structure to make it less boring.\n"
            )
            response_input.append("User_Profile: " + user_profile.get_user_profile())
            response_input.append("Menu: " + menu)
            response_input.append("name: ")
            response_input.append("description: ")
            response_input.append("price: ")
            response_input.append("match_score: ")
            response_input.append("match_explanation: ")
            response = self.model.generate_content([prompt] + response_input)
            response.resolve()
            if response.text:
                text = response.text
        except Exception as e:
            logging.error(f'{type(e).__name__}: {e}')

        elapsed_time = time.perf_counter() - start_time
        logging.info(f'{elapsed_time} seconds. Menu result: {text}')
        return text

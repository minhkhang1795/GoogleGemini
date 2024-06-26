import json
import logging
from django.http import JsonResponse

from snapeat.apis import UserProfile
from snapeat.apis.gemini_model import GeminiModel
from snapeat.apis.google_image_api import GoogleImageApi
from snapeat.apis.google_place_api import GooglePlaceApi


class SnapEatApi:
    def __init__(self, api_key, project_cx):
        self.api_key = api_key
        self.project_cx = project_cx
        self.gemini_model = GeminiModel(api_key)
        self.google_place_api = GooglePlaceApi(api_key)
        self.google_image_api = GoogleImageApi(api_key, project_cx)

    def recommend_from_menu_image(self, menu_image, user_profile: UserProfile):
        """
        Returns a json response with dish recommendations given a menu image and user profile.
        The json response will have 2 fields: result and error.
        @param menu_image: the menu image file.
        @param user_profile: the user profile.
        @return: json response with dish recommendations.
        """
        menu_result, error = self.gemini_model.menu_image_to_text(menu_image)
        if menu_result is None:
            logging.error(f"Failed to read menu image.")
            return JsonResponse({"result": [], "error": error}, status=500)

        try:
            menu_json = json.loads(menu_result)
            return self.recommend_from_menu_json(menu_json, user_profile)
        except Exception as e:
            logging.error(f"Error parsing menu: {type(e).__name__}: {e}")
            return JsonResponse({"result": [],
                                 "error": f"Failed to read menu image: {e}"}, status=500)

    def recommend_from_menu_json(self, menu_json: json, user_profile: UserProfile):
        """
        Returns a json response with dish recommendations given a menu image and user profile.
        The json response will have 2 fields: result and error.
        @param menu_json: the menu json.
        @param user_profile: the user profile.
        @return: json response with dish recommendations.
        """
        recommended_result, error = self.gemini_model.recommend_menu_items(user_profile, menu_json)
        if recommended_result is None or len(recommended_result) == 0:
            logging.error(f"Failed recommend items from the menu.")
            return JsonResponse({"result": [], "error": error}, status=500)

        recommended_json = recommended_result
        try:
            recommended_json = self._filter_recommended_results(recommended_result)
            self.google_image_api.populate_img_urls(recommended_json, "food")
            return JsonResponse({"result": recommended_json, "error": None})
        except Exception as e:
            logging.error(f"Error parsing recommendations: {type(e).__name__}: {e}")
            return JsonResponse({"result": recommended_json,
                                 "error": "Sorry, our chef recommended you some dishes, "
                                          "but his handwriting is so bad our server cannot comprehend! "
                                          "Here is the full menu."}, status=500)

    def recommend_restaurants(self, location, search_prompt, user_profile: UserProfile):
        """
        Returns a json response with restaurant recommendations given a search prompt and user profile.
        The json response will have 2 fields: result and error.
        @param location: the location.
        @param search_prompt: the search prompt.
        @param user_profile: the user profile.
        @return: json response with restaurant recommendations.
        """
        recommended_result, error = self.gemini_model.recommend_restaurant(location, user_profile, search_prompt)
        if recommended_result is None or len(recommended_result) == 0:
            logging.error(f"Failed recommend items from the menu: {error}")
            return JsonResponse({"result": [], "error": error}, status=500)

        self.google_image_api.populate_img_urls(recommended_result, "restaurant")
        return JsonResponse({"result": recommended_result, "error": None})

    def _filter_recommended_results(self, recommended_result, min_match_score=60):
        """
        Filter recommended results by minimum match score.
        @param recommended_result: the recommended menu items with match score.
        @param min_match_score: the minimum match score.
        @return: recommended results with match score >= min_match_score.
        """
        result_array = []
        for item in recommended_result:
            if "match_score" in item and item["match_score"] is not None and item["match_score"] >= min_match_score:
                result_array.append(item)

        return result_array

import json
import logging
from django.http import JsonResponse

from snapeat.apis import UserProfile
from snapeat.apis.gemini_model import GeminiModel
from snapeat.apis.google_image_api import GoogleImageAPI
from snapeat.apis.google_place_api import GooglePlaceApi


class SnapEatApi:
    def __init__(self, api_key, project_cx):
        self.api_key = api_key
        self.project_cx = project_cx
        self.gemini_model = GeminiModel(api_key)
        self.google_place_api = GooglePlaceApi(api_key)
        self.google_image_api = GoogleImageAPI(api_key, project_cx)

    def recommend(self, menu_image, user_profile: UserProfile):
        """
        Returns a json response with dish recommendations given a menu image and user profile.
        The json response will have 2 fields: result and error.
        @param menu_image: the menu image file.
        @param user_profile: the user profile.
        @return: json response with dish recommendations.
        """
        menu_result = self.gemini_model.menu_image_to_text(menu_image)
        if menu_result is None:
            logging.error(f"Failed to read menu image.")
            return JsonResponse({"result": [], "error": "Failed to read menu image. Please make sure the image "
                                                        "is clear and try again!"})

        recommended_result = self.gemini_model.recommend_menu_items(user_profile, menu_result)
        if recommended_result is None:
            logging.error(f"Failed recommend items from the menu.")
            return JsonResponse({"result": [], "error": "Failed recommend items from the menu. Please try again!."})

        try:
            recommended_json = self._filter_recommended_results(json.loads(recommended_result))
            self.google_image_api.populate_img_urls(recommended_json)
            return JsonResponse({"result": recommended_json, "error": None})
        except Exception as e:
            logging.error(f"Error recommending menu item: {type(e).__name__}: {e}")
            return JsonResponse({"result": [], "error": "Internal server error. Please try again!"})

    def _filter_recommended_results(self, recommended_result, min_match_score=60):
        """
        Filter recommended results by minimum match score.
        @param recommended_result: the recommended menu items with match score.
        @param min_match_score: the minimum match score.
        @return: recommended results with match score >= min_match_score.
        """
        result_array = []
        for item in recommended_result:
            if item["match_score"] is not None and item["match_score"] >= min_match_score:
                result_array.append(item)

        return result_array
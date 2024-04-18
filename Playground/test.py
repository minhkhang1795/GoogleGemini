"""
Python version: 3.9+
Required packages: google-generativeai, pillow
"""
import os

import google.generativeai as genai
import PIL.Image
from google.generativeai import GenerationConfig
from google.generativeai.types import HarmCategory, HarmBlockThreshold

# Set your Google API key in an environment variable.
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
if GOOGLE_API_KEY is None:
    raise Exception('GOOGLE_API_KEY is not found')
genai.configure(api_key=GOOGLE_API_KEY)

# Generation config
generation_config = GenerationConfig(
    temperature=0.4,
    top_p=1,
    top_k=32,
    candidate_count=1,
    max_output_tokens=4096,
    response_mime_type="application/json",
)

# Safety config
safety_config = {
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
}

# Model
image_model = genai.GenerativeModel('gemini-1.5-pro-vision-latest',
                                    generation_config=generation_config,
                                    safety_settings=safety_config)
text_model = genai.GenerativeModel('gemini-1.5-pro-latest',
                                   generation_config=generation_config,
                                   safety_settings=safety_config)


class UserProfile:
    def __init__(self, name, preferences, dietary_restriction):
        self.name = name
        self.preferences = preferences
        self.dietary_restriction = dietary_restriction


def menu_image_to_text(prompt: str, image_path: str):
    """
    Tell Gemini to look at a menu image and answer the prompt question.
    :param prompt: the prompt to tell Gemini what to look for in the menu image.
    :param image_path: the menu image path.
    :return: the response to the prompt.
    """
    text = ""
    try:
        img = PIL.Image.open(image_path)
        response = image_model.generate_content(["look at the following picture and tell me  " + prompt, img])
        response.resolve()
        text = response.text
    except Exception as e:
        print(f'menu_image_to_text: {type(e).__name__}: {e}')

    return text


#!pip install google_images_search 
from google_images_search import GoogleImagesSearch
import os 
def retrieve_img_from_menu(item_name: str, output_path: str = "menu_item.jpg"):
  """
  Searches Google Images for the given menu item and saves the first result to the specified path.

  :param item_name: The name of the menu item to search for.
  :param output_path: The path where the downloaded image should be saved. Defaults to "menu_item.jpg".
  """
  YOUR_API_KEY = ""
  YOUR_PROJECT_CX = ""
  try:
    # Configure Google Images Search
    gis = GoogleImagesSearch(YOUR_API_KEY, YOUR_PROJECT_CX)  # Replace with your credentials

    # Search for the menu item
    _search_params = {
        'q': f"{item_name}",  # Search query
        "cx": "542ef1a094b8046a7",
        'searchType': 'image',
        'fileType': 'jpg',
        'imgType': 'photo'
    }
    gis.search(search_params=_search_params)

    # Get the URL of the first image result
    if gis.results():
      first_image = gis.results()[0]
      image_url = first_image.url
      return image_url
    else:
      return None  # Return None if no results

  except Exception as e:
    print(f"retrieve_img_from_menu: {type(e).__name__}: {e}")
    return None

# Example usage:
image_url = retrieve_img_from_menu("dry pot sauteed chiba tofu")
if image_url:
    print(f"Image URL: {image_url}")
else:
    print("No image found.")

def recommend_menu_items(user_profile: UserProfile, menu: str):
    """

    :param user_profile: the user_profile
    :param menu: the menu text
    :return: json format with match score
    """
    text = ""
    try:
        prompt = ("Please take into consideration the user food preferences and dietary restrictions, given all the "
                  "items on the menu, please give out a match score from 0 to 10 for each item on the menu in json "
                  "format (0 means user cannot eat this, and 10 means perfect match). The json format should be a list "
                  "of 'item name', 'description', 'indredients list', 'category' (either appetizers, main dish or dessert), 'match score', 'match score explanation' and 'price' in number "
                  "rounded to two decimal places")

        response = text_model.generate_content([prompt,
                                                "User profile:  " + user_profile.preferences + " " + user_profile.dietary_restriction,
                                                "Menu: " + menu,
                                                "Match score: "])
        response.resolve()
        text = response.text
    except Exception as e:
        print(f'recommend_menu_items: {type(e).__name__}: {e}')

    return text


# Test menu_image_to_text
menu_from_image = menu_image_to_text("what's on the menu in json format", ".\\menu1.jpg")
print(menu_from_image)
# print(menu_image_to_text(
#     "what the restaurant address is. Just give me the address and nothing else. Leave blank you cannot find it",
#     ".\\menu1.jpg"))
# print(menu_image_to_text(
#     "what the restaurant name is. Just give me the name and nothing else. Leave blank you cannot find it",
#     ".\\menu1.jpg"))

# Test recommend_menu_items
user = UserProfile("Pepsi", "love Japanese and Mexican food", "Gluten free, cannot eat fish, allergy to nuts")
print(recommend_menu_items(user, menu_from_image))

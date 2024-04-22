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

import json
from multiprocessing import Pool
from google_images_search import GoogleImagesSearch
import os

YOUR_PROJECT_CX = "40fb6dfab8dad4cfc"

def retrieve_img_from_menu(item_name):
    """
    Retrieve image URLs for a menu item.

    :param item_name: The name of the menu item.
    :return: A tuple containing the item name and a list of image URLs, or None if an error occurs.
    """

    try:
        # Configure Google Images Search
        gis = GoogleImagesSearch(GOOGLE_API_KEY, YOUR_PROJECT_CX)

        # Search for the menu item
        _search_params = {
            'q': f"{item_name}",
            "cx": YOUR_PROJECT_CX,
            'searchType': 'image',
            'fileType': 'jpg',
            'imgType': 'photo',
            'imgSize': 'large',
            'num': 2
        }
        gis.search(search_params=_search_params)

        # Get the URLs of the first two unique image results
        image_urls = []
        for result in gis.results():
            image_urls.append(result.url)

        return item_name, image_urls

    except Exception as e:
        print(f"Error retrieving image URLs for '{item_name}': {type(e).__name__}: {e}")
        return None  # Return None if an error occurs



def populate_img_urls(json_file_path):
    """
    Populate the 'imageUrls' field in a JSON file with new image URLs obtained from retrieve_img_urls function.

    :param json_file_path: The path to the JSON file.
    :return: The updated JSON data with new image URLs.
    """
    try:
        # Read JSON file
        with open(json_file_path, 'r') as file:
            data = json.load(file)

        # Retrieve image URLs in parallel
        with Pool() as pool:
            results = pool.map(retrieve_img_from_menu, [item["name"] for item in data])

        # Update data with retrieved image URLs
        for item_name, image_urls in results:
            for item in data:
                if item["name"] == item_name:
                    item["imageUrls"] = image_urls

        return data

    except Exception as e:
        print(f"Error populating image URLs: {type(e).__name__}: {e}")
        return None

# Example usage:
json_file_path = "recommend-sample.json"
updated_data = populate_img_urls(json_file_path)
if updated_data:
    # Print updated JSON data
    print(json.dumps(updated_data, indent=2))
    # Write updated JSON data back to the file (optional)
    with open(json_file_path, 'w') as file:
        json.dump(updated_data, file, indent=2)
else:
    print("Failed to update JSON data.")


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

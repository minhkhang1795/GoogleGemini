#!pip install google_images_search
from google_images_search import GoogleImagesSearch
import os

def retrieve_img_from_menu(item_name: str, output_path: str = "menu_item.jpg"):
  """
  Searches Google Images for the given menu item and saves the first result to the specified path.

  :param item_name: The name of the menu item to search for.
  :param output_path: The path where the downloaded image should be saved. Defaults to "menu_item.jpg".
  """
  YOUR_API_KEY = os.getenv('GOOGLE_IMAGE_KEY')
  YOUR_PROJECT_CX = os.getenv('GOOGLE_IMAGE_PROJECT_CX')
  try:
    # Configure Google Images Search
    gis = GoogleImagesSearch(YOUR_API_KEY, YOUR_PROJECT_CX)  # Replace with your credentials

    # Search for the menu item
    _search_params = {
        'q': f"{item_name}",  # Search query
        'searchType': 'image',
        'fileType': 'jpg',
        'imgType': 'photo'
    }
    gis.search(search_params=_search_params)

    # Get the URL of the first image result
    if gis.results():
      #first_image = gis.results()[0]
      first_image = gis.results()[0]
      image_url = first_image.url
      return image_url
    else:
      return None  # Return None if no results

  except Exception as e:
    print(f"Exception retrieve_img_from_menu: {type(e).__name__}: {e}")
    return None

# Example usage:
#image_url = retrieve_img_from_menu("yellowtail sushi")
image_url = retrieve_img_from_menu("mapu tofu pineapple ground meat")

if image_url:
    print(f"Image URL: {image_url}")
else:
    print("No image found.")
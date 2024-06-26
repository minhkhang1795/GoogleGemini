import logging
import time
from multiprocessing import Pool
from google_images_search import GoogleImagesSearch


class GoogleImageApi:
    def __init__(self, api_key, project_cx):
        if api_key is None:
            logging.error('GOOGLE_IMAGE_SEARCH_API_KEY is None')
            return

        if project_cx is None:
            logging.error('PROJECT_CX is None')
            return

        # Configure Google Images Search
        self.gis = GoogleImagesSearch(api_key, project_cx)

    def retrieve_img_from_menu(self, item_name, search_prefix, retry=5):
        """
        Retrieve image URLs for a menu item.

        @param item_name: The name of the menu item.
        @param search_prefix: The prefix of the search query.
        @param retry: the number of retries.
        @return: A tuple containing the item name and a list of image URLs, or None if an error occurs.
        """
        if retry == 0:
            return item_name, []

        try:
            # Search for the menu item
            search_params = {
                'q': f"{search_prefix}: {item_name}",
                'searchType': 'image',
                'fileType': 'jpg',
                'imgType': 'photo',
                'imgSize': 'large',
                'safe': 'medium',
                'num': 2
            }
            self.gis.search(search_params=search_params)

            # Get the URLs of the first two unique image results
            image_urls = []
            for result in self.gis.results():
                image_urls.append(result.url)

            return item_name, image_urls

        except Exception as e:
            logging.error(f"Error retrieving image URLs for '{item_name}': {type(e).__name__}: {e}")
            return self.retrieve_img_from_menu(item_name, search_prefix, retry - 1)

    def populate_img_urls(self, json_array, search_prefix):
        """
        Populate the 'imageUrls' field in a JSON file with new image URLs obtained from retrieve_img_urls function.

        @param json_array: The JSON array.
        @param search_prefix: the prefix of the search term.
        @return: The updated JSON data with new image URLs.
        """
        start_time = time.perf_counter()
        logging.info(f'Populating {search_prefix} for json of length {len(json_array)}')
        try:
            # Retrieve image URLs in parallel
            with Pool() as pool:
                results = pool.map(self._retrieve_img_from_menu_wrapper, [(item["name"], search_prefix) for item in list(
                    filter(lambda item: 'image_urls' not in item or len(item['image_urls']) == 0, json_array))])

            # Update data with retrieved image URLs
            for item_name, image_urls in results:
                for item in json_array:
                    if item["name"] == item_name:
                        item["image_urls"] = image_urls
                        break
        except Exception as e:
            logging.error(f"Error populating image URLs: {type(e).__name__}: {e}")

        elapsed_time = time.perf_counter() - start_time
        logging.info(f'{elapsed_time} seconds. Image result: {json_array}')
        return json_array

    def _retrieve_img_from_menu_wrapper(self, args):
        return self.retrieve_img_from_menu(*args)
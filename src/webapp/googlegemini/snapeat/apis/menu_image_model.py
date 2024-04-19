import logging
import time

import google.generativeai as genai
import PIL.Image
from google.generativeai import GenerationConfig
from google.generativeai.types import HarmCategory, HarmBlockThreshold


class MenuImageModel:
    def __init__(self, apikey=None):
        if apikey is None:
            logging.error('GOOGLE_API_KEY is None')
            return

        genai.configure(api_key=apikey)
        self.image_model = genai.GenerativeModel('apis-1.5-pro-latest',
                                                 generation_config=self.create_generation_config(),
                                                 safety_settings=self.create_safety_config())
        self.text_model = genai.GenerativeModel('apis-1.5-pro-latest',
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
        Tell Gemini to look at a menu image and answer the prompt question.
        :param image: the menu image
        :return: the response to the prompt.
        """
        text = None
        start_time = time.perf_counter()
        try:
            logging.info(f'analyzing menu image {image}')
            img = PIL.Image.open(image)
            response = self.image_model.generate_content(
                ["look at the following picture and tell me what's on the menu. The result should be a list in json "
                 "format. If the picture is not a menu, return an empty json array. Otherwise, each item in the list "
                 "should have these attributes:\n- name: the name of the dish copied from the image\n"
                 "- description: description of the dish copied from the image\n"
                 "- price: the price of the dish as a string with dollar value in front. Price must be a string "
                 "because it might be a price range.", img])
            response.resolve()
            if response.text:
                text = response.text
        except Exception as e:
            logging.error(f'{type(e).__name__}: {e}')

        end_time = time.perf_counter()
        elapsed_time = end_time - start_time
        logging.info(f'{elapsed_time} seconds. Menu result: {text}')
        return text

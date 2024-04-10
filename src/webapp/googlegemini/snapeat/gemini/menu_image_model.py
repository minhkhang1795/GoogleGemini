import os
import time

import google.generativeai as genai
import PIL.Image
from google.generativeai import GenerationConfig
from google.generativeai.types import HarmCategory, HarmBlockThreshold


class MenuImageModel:
    def __init__(self, apikey=None):
        if apikey is None:
            raise Exception('GOOGLE_API_KEY is None')

        genai.configure(api_key=apikey)
        self.image_model = genai.GenerativeModel('gemini-pro-vision',
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
        )

    @staticmethod
    def create_safety_config():
        return {
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        }

    def menu_image_to_text(self, image):
        """
        Tell Gemini to look at a menu image and answer the prompt question.
        :param image: the menu image
        :return: the response to the prompt.
        """
        text = ""
        start_time = time.perf_counter()
        try:
            print(f'menu_image_to_text: analyzing menu image {image}')
            img = PIL.Image.open(image)
            response = self.image_model.generate_content(["look at the following picture and tell me what's on the menu in json format", img])
            response.resolve()
            if response.text:
                text = response.text
        except Exception as e:
            print(f'menu_image_to_text: {type(e).__name__}: {e}')

        end_time = time.perf_counter()
        elapsed_time = end_time - start_time
        print(f'menu_image_to_text: {elapsed_time} seconds')
        return text
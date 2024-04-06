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
config = GenerationConfig(
            temperature=0.4,
            top_p=1,
            top_k=32,
            candidate_count=1,
            max_output_tokens=4096,
        )

# Safety config
safety_config = {
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        }

# Model
model = genai.GenerativeModel('gemini-pro-vision')


def menu_image_to_text(prompt, image_path):
    text = ""
    try:
        img = PIL.Image.open(image_path)
        response = model.generate_content(["look at the following picture and tell me  " + prompt, img],
                                          safety_settings=safety_config,
                                          generation_config=config)
        response.resolve()
        text = response.text
    except Exception as e:
        print(f'menu_image_to_text: {type(e).__name__}: {e}')

    return text


print(menu_image_to_text("what's on the menu in json format", ".\\menu1.jpg"))
print(menu_image_to_text(
    "what the restaurant address is. Just give me the address and nothing else. Leave blank you cannot find it",
    ".\\menu1.jpg"))
print(menu_image_to_text(
    "what the restaurant name is. Just give me the name and nothing else. Leave blank you cannot find it",
    ".\\menu1.jpg"))

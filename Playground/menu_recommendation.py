"""
At the command line, only need to run once to install the package via pip:

$ !pip install google-generativeai==0.5.1
"""
#!pip install google-generativeai==0.5.1
import json
import os

import google.generativeai as genai
from google.generativeai import GenerationConfig

from google.colab import userdata
GOOGLE_API_KEY = userdata.get('GOOGLE_API_KEY')
if GOOGLE_API_KEY is None:
    raise Exception('GOOGLE_API_KEY is not found')
genai.configure(api_key=GOOGLE_API_KEY)

# Set up the model
generation_config = GenerationConfig(
    temperature=0.4,
    top_p=1,
    top_k=32,
    candidate_count=1,
    max_output_tokens=4096,
    response_mime_type="application/json"
)


safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
]

model = genai.GenerativeModel(model_name='gemini-1.5-pro-latest', #'gemini-1.5-pro-latest', 'gemini-1.0-pro'
                              generation_config=generation_config,
                              safety_settings=safety_settings)



# Function to load data from JSON files

class UserProfile:
    def __init__(self, Cuisine, Flavor, Dietary=None, Allergies=None):
        self.diet = Dietary
        self.allergies = Allergies
        self.cuisine = Cuisine
        self.flavor = Flavor


...
# Function to prompt Gemini and recommend menu items
def recommend_menu_items(user_profile: UserProfile, menu: str , GGreview=None, ChefRec=None):
  text = ""
  try:
    prompt_input = "From the User profile, menu "
    response_input = []

    if ChefRec is not None and ChefRec != "":
      prompt_input += ", Chef Recommendation "
      response_input.append("Chef_Reccomendation: " + ChefRec)
    if GGreview is not None and GGreview != "":
      prompt_input += ", Google Review "
      response_input.append("Google_Review: " + GGreview)

    prompt = (
    prompt_input + "provided below, create a JSON file of dish recommendations."
    "The output will have these attributes: Name_of_the_dish, Match_Score, Explanation_of_Match_Score, Explanation_of_Dish."
    "The Explanation_of_Dish must have a disclaimer on any strong allergy reaction it can cause in addition to a brief description of the dish."
    "The Match_Score is a percentage ranging from 100 to 0 for each item on the menu in JSON: format (0 means the user cannot eat this or feels unpleasant to eat it, and 100 means perfect match with the user preferences and the menu food)."
    "Dietary and Allergies from the user profile should be prioritized first. Dietary and Allergies information might not be provided in the input so please treat them as optional factors in Match_score calculation"
    "The user's cuisine preference should weighted 20% more than the user's preferred flavor."
    "When calculating the Match_Score, the flavor and cuisine can only be weighted equally when the flavor is indicated as extreme."
    "The Match_Score will be ranked from highest to lowest."
    "The Explanation_of_Match_Score explains what factors scale the score the most significantly in a natural tone."
    "The output lists all the dish the menu."
  )
    #dynamic user profile
    diet_allergy = ""
    if user_profile.diet is not None and user_profile.diet != "":
      diet_allergy += "User has these diet(s): " + user_profile.diet + "."
    else:
      diet_allergy += "User doesn't indicate any diet"

    if user_profile.allergies is not None and user_profile.allergies != "":
      diet_allergy += "User has these allergies: " + user_profile.allergies + "."
    else:
      diet_allergy += "User doesn't indicate any allergy."

    response_input.append("User profile:  "
                          + diet_allergy
                          + "User love "
                          + user_profile.cuisine  + " and "
                          + user_profile.flavor  + ".")
    response_input.append("Menu: " + menu)
    response_input.append("Match_score: ")
    response_input.append("Explanation_of_Match_Score: ")
    response_input.append("Explanation_of_Dish: ")
    response = model.generate_content([prompt] + response_input)
    response.resolve()
    text = response.text
  except Exception as e:
    print(f'recommend_menu_items: {type(e).__name__}: {e}')

  return text

# Sample with sufficient input
user = UserProfile("", "", "Love Vietnamese and Korean Food","prefer Spicy")
Menu=   [
  {
    "name": "Crispy Calamari",
    "description": "Tender calamari rings lightly dusted in seasoned flour and fried to golden perfection, served with a zesty marinara sauce for dipping.",
    "category": "Appetizer",
    "price": "$12"
  },
  {
    "name": "Spinach and Artichoke Dip",
    "description": "A creamy and flavorful blend of spinach, artichoke hearts, and melted cheeses, served warm with tortilla chips for dipping.",
    "category": "Appetizer",
    "price": "$10"
  },
  {
    "name": "Grilled Salmon with Roasted Vegetables",
    "description": "Fresh salmon fillet grilled to flaky perfection, served with a medley of seasonal roasted vegetables for a healthy and satisfying meal.",
    "category": "Main Course",
    "price": "$30"
  },
  {
    "name": "Spaghetti Carbonara",
    "description": "Classic Italian pasta dish featuring spaghetti tossed in a rich and creamy sauce made with eggs, Parmesan cheese, pancetta, and black pepper.",
    "category": "Main Course",
    "price": "$22"
  },
  {
    "name": "Beef Bourguignon",
    "description": "Tender beef braised in a rich red wine sauce with carrots, onions, and mushrooms, served with creamy mashed potatoes.",
    "category": "Main Course",
    "price": "$28 - $32"
  },
  {
    "name": "Tiramisu",
    "description": "Layers of espresso-soaked ladyfingers, creamy mascarpone cheese, and cocoa powder, creating a classic Italian dessert that is both light and decadent.",
    "category": "Dessert",
    "price": "$8 / $10",
  },
  {
    "name": "Chocolate Lava Cake",
    "description": "Warm chocolate cake with a molten chocolate center, served with a scoop of vanilla ice cream for the perfect balance of hot and cold.",
    "category": "Dessert",
    "price": "$9"
  },
  {
    "name": "Cheesecake",
    "description": "Creamy and smooth New York-style cheesecake with a graham cracker crust, served with your choice of fresh fruit or chocolate sauce.",
    "category": "Dessert",
    "price": "$7"
  }
]
Menu_str = json.dumps(Menu)
GGreview = "Most reviewers love the Grilled Salmon with Roasted Vegetables for the Main Dish"
ChefRec = "Beef Bourguignon is a chef specialty today"


print(recommend_menu_items(user, Menu_str, GGreview, ChefRec))

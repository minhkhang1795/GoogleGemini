import json
import logging


class UserProfile:
    def __init__(self, diets, allergies, cuisines, flavors):
        self.diets = diets
        self.allergies = allergies
        self.cuisines = cuisines
        self.flavors = flavors

    @staticmethod
    def create_from_string(user_profile_str):
        """
        Create a UserProfile object from a string.
        @param user_profile_str: the string representation of a UserProfile.
        @return: user_profile.
        """
        try:
            user_profile_data = json.loads(user_profile_str)
            diets = user_profile_data.get('diets')
            allergies = user_profile_data.get('allergies')
            cuisines = user_profile_data.get('cuisines')
            flavors = user_profile_data.get('flavors')
            return UserProfile(diets, allergies, cuisines, flavors)
        except Exception as e:
            logging.error(f"Error creating user profile from string '{user_profile_str}': {type(e).__name__}: {e}")

        return UserProfile([], [], [], [])

    def is_valid(self):
        """
        Checks if the user profile is valid. Cuisine and Flavors are required.
        @return: True if the user profile is valid, False otherwise.
        """
        if not self.cuisines:
            return False

        if not self.flavors:
            return False

        return True

    def get_user_profile(self):
        result = ""
        if not self.diets:
            result += "I don't have any diet. "
        else:
            result += "I have these diets: " + ", ".join(self.diets) + ". "

        if not self.allergies:
            result += "I don't have any allergy. "
        else:
            result += "I have these allergies: " + ", ".join(self.allergies) + ". "

        return (result + "My favorite cuisine are " + ", ".join(self.cuisines) + ", and I love "
                + ", ".join(self.flavors) + " flavors.")

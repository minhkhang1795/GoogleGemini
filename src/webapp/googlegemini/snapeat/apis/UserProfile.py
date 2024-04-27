class UserProfile:
    def __init__(self, diets, allergies, cuisines, flavors):
        self.diets = diets
        self.allergies = allergies
        self.cuisines = cuisines
        self.flavors = flavors

    def get_user_profile(self):
        result = ""
        if not self.diets:
            result += "I have these diets: " + ", ".join(self.diets) + ". "
        else:
            result += "I don't have any diet. "

        if not self.allergies:
            result += "I have these allergies: " + ", ".join(self.allergies) + ". "
        else:
            result += "I don't have any allergy. "

        return (result + "My favorite cuisine are " + ", ".join(self.cuisines) + ", and I love "
                + ", ".join(self.flavors) + " flavors.")
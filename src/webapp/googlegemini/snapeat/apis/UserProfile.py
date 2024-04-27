class UserProfile:
    def __init__(self, diets, allergies, cuisines, flavors):
        self.diets = diets
        self.allergies = allergies
        self.cuisines = cuisines
        self.flavors = flavors

    def get_user_profile(self):
        diet_allergy = ""
        if self.diets is not None and self.diets != "":
            diet_allergy += "I have these diet(s): " + self.diets + ". "
        else:
            diet_allergy += "I don't have any diet. "

        if self.allergies is not None and self.allergies != "":
            diet_allergy += "I have these allergies: " + self.allergies + ". "
        else:
            diet_allergy += "I don't have any allergy. "

        return diet_allergy + "My favorite cuisine are " + self.cuisines + ", and I love " + self.flavors + " flavors."
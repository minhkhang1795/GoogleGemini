# SnapEat

"Your Perfect Plate, One Snap Away"

SnapEat is your foodie bestie where you can get answers for the two most difficult questions: “Where to eat” and “What to eat”

This is a project for [Google AI Hackathon 2014](https://devpost.com/software/hello-mqav0p)

Demo: https://proud-mud-016f9a510.5.azurestaticapps.net/
- Please be patient for the Snap Menu feature. It might take up to 2 minutes to finish the request.

## Overview

We built SnapEat using React for quick front-end development and Django for the back-end to isolate API logics from the front-end app. Both apps are hosted on Azure using a Static Web App for front-end and Azure App Service for back-end.

The React web app provides a responsive design, enabling users to seamlessly interact with our dynamic and intuitive application directly from their web browsers. We deliberately chose a web app over a mobile app for several reasons:

- **Cross-Platform Compatibility:** A web app is platform-agnostic, meaning it works consistently across various devices and operating systems. Whether users access it from a desktop, laptop, tablet, or smartphone, they’ll experience the same functionality. This compatibility ensures that SnapEat reaches a broader audience without requiring separate development efforts for different platforms.

- **Rapid Development:** Web apps allow us to swiftly develop and iterate on features. Unlike native mobile apps, which often involve complex setup and approval processes (such as app store submissions), web apps can be deployed instantly.

- **Accessibility:** Our app is accessible via standard web browsers, making it available to a wide range of users, including those who might not have access to specific app stores or mobile devices. Our goal was to create a product that reaches as many people as possible, and a web app aligns perfectly with this objective for the current stage of development.

The Django back-end server serves as the central engine driving our app. Leveraging Google Gemini 1.5 Pro and other Google API products, it powers essential features like the **Snap Menu** and **Find Restaurants** functionalities. Django’s robust ecosystem of pre-built components and its adherence to the DRY (Don’t Repeat Yourself) principle allowed us to focus on validation and core functionality. Furthermore, Django grants us flexibility in security implementation as we can fine-tune access controls, authentication mechanisms, and data validation. Specifically, we limit the number of requests originating from the web app to prevent abuse, enhance performance, and safeguard against potential security threats.

## React App

[![forthebadge](http://forthebadge.com/images/badges/made-with-react.svg)](http://forthebadge.com)

Please visit our react folder for more technical details: [googlegemini-fe](https://github.com/minhkhang1795/GoogleGemini/tree/main/src/webapp/googlegemini-fe)

## Django App

[![forthebadge](https://forthebadge.com/images/badges/python-3.12.svg)](https://forthebadge.com)

Please visit our django folder for more technical details: [googlegemini](https://github.com/minhkhang1795/GoogleGemini/tree/main/src/webapp/googlegemini)

## Key Features

### 1. Dietary preference integration

- During the onboarding process, users are presented with different prompts to input their dietary preferences and restrictions for the app
- Users can also make changes to this information within the app through the profile tab as their preference grows.
- The app accommodates a wide range of dietary needs, including but not limited to 
    - Dietary (Optional): Soft Diet, Liquid Diet, Low Calories, Low Fat, Low Sodium, Low Carb, Vegan, Vegetarian, Pescatarian, etc.
    - Allergies (Optional): Nut Allergy, Shellfish Allergy, Soy Allergy, Gluten-Free, Lactose Intolerance, etc.
    - Cuisine: Accommodate all cultural cuisines within these regions: Asia, Americas, Europe, Africa, Oceania, as well as Religious and Fusion.
    - Flavor: Spicy, Salty, Sweet, Sour, Umami, Fatty, Herbal, Smoky, etc.

![Provide dietary preference](https://raw.githubusercontent.com/minhkhang1795/GoogleGemini/main/.github/images/onboarding.gif)

*During onboarding, user can choose their dietary preferences and restrictions.*


### 2. Snap Menu (menu photo capture)

- The app enables users to take pictures of extended menus of any restaurant using their smartphones’ camera.
- Utilizing Gemini AI advanced image recognition technology, it swiftly processes the menu items captured in the photo and collect these information: 
    - Name
    - Price
    - Description (Optional)
    - Category (Optional: Appetizer/Main/Dessert/Drink)
    - Ingredients (Optional)
    - Chef Recommendation (Optional)
    - Additionally, the app also asks for a search of Google pictures, user ratings and reviews of the dish if available.

### 3. Personalized recommendations

- Based on the menu items detected and the users’ dietary preferences, the app incorporates Gemini AI to generate tailored suggestions that align with their needs.
- SnapEat provides users with holistic descriptions of recommended dishes together with Google pictures, user ratings and reviews found throughout the web. 
- The recommendations are presented in the default view of a well balanced meal including 1 appetizer, 1 main, 1 dessert and 1 drink.

![Snap Menu feature](https://raw.githubusercontent.com/minhkhang1795/GoogleGemini/main/.github/images/snapmenu.gif)

*After snapping the menu, user will receive a list of recommendations based on their food preferences.*


### 4. Find Restaurants (restaurant discovery and food recommendation experience)

- In addition to meal recommendations through Snap Menu, the app offers restaurant discovery features, helping users find eateries that cater to their dietary needs within their chosen location with the Find Restaurants feature.
- Users can simply put information into the search bar and browse the suggestions. This will help with streamlining the dining experience and ensuring a seamless transition from menu exploration to making the final decision.
- Personalized recommendations for users are available with this feature if the restaurant menu data is available.

![Find Restaurants feature](https://raw.githubusercontent.com/minhkhang1795/GoogleGemini/main/.github/images/browse.gif)

*User can also find restaurants that match their dietary needs.*

import cv2
import pytesseract
import requests  # For making API calls to Gemini
import json

# User profile and preferences (replace with actual user input mechanisms)
user_profile = {
    "dietary_restrictions": ["vegetarian"],
    "preferred_cuisines": ["Italian", "Indian"],
    "calorie_goals": 2000
}

# Function to preprocess the scanned image
def preprocess_image(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    return thresh

# Function to extract text from the image
def extract_text(image):
    preprocessed_image = preprocess_image(image)
    text = pytesseract.image_to_string(preprocessed_image, config='--psm 6')
    return text

# Function to make an API call to Gemini for food processing and recommendations
def process_food_and_recommend(text):
    # Extract relevant information from the scanned text (dish names, keywords)
    dish_names = []  # List to store extracted dish names
    keywords = []   # List to store keywords related to dietary restrictions, etc.

    # Implement logic to extract dish names and keywords from the text
    # (e.g., regular expressions, keyword matching based on user profile)

    # Prepare API request data
    data = {
        "text": text,
        "dish_names": dish_names,
        "keywords": keywords,
        "user_profile": user_profile
    }

    # Make the API call (replace with actual Gemini API endpoint and authentication)
    response = requests.post("https://your-gemini-api-endpoint.com/process-food", json=data)

    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "API request failed"}

# Main function to capture image, process, and present results
def main():
    # Initialize camera (replace with proper camera initialization)
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()

        # Display camera feed for user to scan menu
        cv2.imshow('Menu Scanner', frame)

        # Capture image on key press (e.g., 'c')
        if cv2.waitKey(1) & 0xFF == ord('c'):
            cv2.imwrite('scanned_menu.jpg', frame)
            cap.release()
            cv2.destroyAllWindows()
            break

    # Read the captured image
    image = cv2.imread('scanned_menu.jpg')

    # Extract text from the image
    scanned_text = extract_text(image)

    # Process food and get recommendations
    results = process_food_and_recommend(scanned_text)

    # Present results to the user
    if "error" in results:
        print("Error:", results["error"])
    else:
        # Display extracted dish descriptions and recommendations
        print("Extracted Dish Descriptions:")
        for dish in results["dish_descriptions"]:
            print(dish)

        print("\nRecommended Dishes based on User Preferences:")
        for recommendation in results["recommendations"]:
            print(recommendation)

if __name__ == "__main__":
    main()

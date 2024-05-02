# Getting Started with SnapEat back-end


## Requirements
You’ll need to have Python 3.12 on your machiner. To install neccessary requirements (defined in `requirements.txt`), please run:

### `pip install -r requirements.txt`

After that, you will need to set up environment variables for Gemini APIs and other stuff:
- GOOGLE_API_KEY: your API key here
- GOOGLE_PROJECT_CX: your programmable search engine CX value. Can be created at [programmablesearchengine.google.com](https://programmablesearchengine.google.com/controlpanel/all) (e.g d28c7fb544d3e4ffc)
- DJANGO_DEBUG: 1
- DJANGO_SECRET_KEY: a random secret key

## Start the project

When starting the project for the first time, please make sure to run the migrate command:

### `python manage.py migrate`

After that, you just need this below command to spin up SnapEat django server:

### `python manage.py runserver`

Then, you can visit the back-end server at:

http://localhost:8000/

## API definitions

Please visit [views.py](/src/webapp/googlegemini/snapeat/views.py) for all available SnapEat APIs

#### 1. Recommend dishes by menu image

`${domain}/recommend/`

Method: `POST`

Body: contains user profile and menu image file
```json
{
  "userProfile": 
  {
    "diets": [],
    "allergies": [],
    "cuisines": [],
    "flavors": [],
  }
  "menuImage": "<Menu_image_file>"
}
```

#### 2. Recommend dishes by restaurant

`${domain}/recommendByRestaurant/?restaurantId=${restaurantId}&userProfile=${userProfile}`

Method: `GET`

Parameters:
- restaurantId: google place id
- userProfile: user profile in json

```json
"userProfile": 
  {
    "diets": [],
    "allergies": [],
    "cuisines": [],
    "flavors": [],
  }
```

#### 3. Search restaurants

`${domain}/restaurants/search/?searchPrompt=${searchPrompt}&location=${location}&userProfile=${userProfile}`

Method: `GET`

Parameters:
- searchPrompt: the search prompt (e.g. best vegan sushi in nyc)
- location: the location string (e.g. Manhattan, New York, NY)
- userProfile: user profile in json

```json
"userProfile": 
  {
    "diets": [],
    "allergies": [],
    "cuisines": [],
    "flavors": [],
  }
```

#### 4. Get nearby restaurants

`${domain}/restaurants/nearby/?location=${location}`

Parameters:
- location: the location string (e.g. Manhattan, New York, NY)

#### 5. Get trending restaurants

`${domain}/restaurants/trending/?location=${location}`

Parameters:
- location: the location string (e.g. Manhattan, New York, NY)

#### 6. Get saved restaurants

`${domain}/restaurants/saved/?userId=${userId}`

Parameters:
- userId: the user ID

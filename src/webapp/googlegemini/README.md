# Getting Started with SnapEat back-end


## Requirements
You’ll need to have Python 3.12 on your machiner. To install neccessary requirements (defined in `requirements.txt`), please run:

### `pip install -r requirements.txt`

After that, you will need to set up environment variables for Gemini APIs and other stuff:
- 


## Start the project

When starting the project for the first time, please make sure to run the migrate command:

### `python manage.py migrate`

After that, you just need this below command to spin up SnapEat django server:

### `python manage.py runserver`

You can visit the back-end server at:

http://localhost:8000/

## API definitions

Please visit [views.py](/src/webapp/googlegemini/snapeat/views.py) for all available SnapEat APIs


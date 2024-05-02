import json
import logging
import os

from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .apis.UserProfile import UserProfile
from .apis.google_image_api import GoogleImageApi
from .apis.google_place_api import GooglePlaceApi
from .apis.snapeat_api import SnapEatApi
from .forms import UploadForm
from .models import Image
from .tables import ImageTable

DEFAULT_LOCATION = "Manhattan, New York, NY"
google_place_api = GooglePlaceApi(os.getenv('GOOGLE_API_KEY'))
google_images_search = GoogleImageApi(os.getenv('GOOGLE_API_KEY'), os.getenv('GOOGLE_PROJECT_CX'))
snapeat_api = SnapEatApi(os.getenv('GOOGLE_API_KEY'), os.getenv('GOOGLE_PROJECT_CX', 'd28c7fb544d3e4ffc'))


@require_http_methods(["POST"])
@csrf_exempt
def recommend_from_menu(request):
    """
    Recommends dishes from a menu image and user profile.
    @param request: A POST request must contain menuImage and userProfile.
    @return: dish recommendation from chef Gemini.
    """
    if 'menuImage' not in request.FILES:
        return JsonResponse({'error': 'Invalid request: Menu image is missing or empty'}, status=400)

    if 'userProfile' not in request.POST:
        return JsonResponse({'error': 'Invalid request: User profile is missing or empty'}, status=400)

    user_profile = UserProfile.create_from_string(request.POST.get('userProfile'))
    if not user_profile.is_valid():
        return JsonResponse({'error': 'Invalid request: User profile is invalid. Cuisines and Flavors are '
                                      'the required fields.'}, status=400)

    return snapeat_api.recommend_from_menu_image(request.FILES['menuImage'], user_profile)


def recommend_by_restaurant(request):
    """
    Recommend dishes from a saved restaurant menu and user profile
    @param request: A GET request must contain restaurantId and userProfile.
    @return: dish recommendation from chef Gemini.
    """
    if 'userProfile' not in request.GET:
        return JsonResponse({'error': 'Invalid request: User profile is missing or empty'}, status=400)

    user_profile = UserProfile.create_from_string(request.GET.get('userProfile'))
    if not user_profile.is_valid():
        return JsonResponse({'error': 'Invalid request: User profile is invalid. Cuisines and Flavors are '
                                      'the required fields.'}, status=400)

    if 'restaurantId' not in request.GET:
        return JsonResponse({'error': 'Invalid request: Restaurant ID is invalid'}, status=400)

    restaurant_id = request.GET.get('restaurantId')
    menu_json_file = os.path.join(settings.BASE_DIR, 'static', 'menu_json', f'{restaurant_id}.json')

    try:
        with open(menu_json_file, 'r') as file:
            menu_json = json.load(file)

        return snapeat_api.recommend_from_menu_json(menu_json, user_profile)
    except FileNotFoundError:
        return JsonResponse({'error': 'We currently do not have menu for this restaurant. '
                                      'Feel free to contribute by uploading menu photo(s).',
                             'errorCode': 'NoMenu'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'Internal Server Error: {e}'}, status=500)


def search_restaurants(request):
    """
    Returns a list of restaurants that match user profile.
    @param request:
    @return:
    """
    if 'userProfile' not in request.GET:
        return JsonResponse({'error': 'Invalid request: User profile is missing or empty'}, status=400)

    user_profile = UserProfile.create_from_string(request.GET.get('userProfile'))
    if not user_profile.is_valid():
        return JsonResponse({'error': 'Invalid request: User profile is invalid. Cuisines and Flavors are '
                                      'the required fields.'}, status=400)

    if 'searchPrompt' not in request.GET:
        return JsonResponse({'error': 'Invalid request: Search prompt is invalid.'}, status=400)

    location = None
    if 'location' in request.GET:
        location = request.GET.get('location')

    if location is None or location == "":
        location = DEFAULT_LOCATION

    search_prompt = request.GET.get('searchPrompt')
    return snapeat_api.recommend_restaurants(location, search_prompt, user_profile)


def populate_menu_images(restaurantId):
    menu_json_file = os.path.join(settings.BASE_DIR, 'static', 'menu_json', f'{restaurantId}.json')

    with open(menu_json_file) as fd:
        json_data = json.load(fd)
        t = str(google_images_search.populate_img_urls(json_data, "food"))
        return google_images_search.populate_img_urls(json_data, "food")


def get_nearby_restaurants(request):
    """
    Returns a list of restaurants nearby.
    @param request:
    @return:
    """
    location = request.GET.get('location')

    if not location:
        location = DEFAULT_LOCATION

    places = google_place_api.get_nearby_restaurant(location)
    return JsonResponse({"result": [place.to_dict() for place in places]})


def get_saved_restaurants(request):
    """
    Returns a list of all saved restaurants.
    @param request:
    @return:
    """
    location = request.GET.get('location')

    if not location:
        location = DEFAULT_LOCATION

    places = []
    return JsonResponse({"result": [place.to_dict() for place in places]})


def get_trending_restaurants(request):
    """
    Returns a list of all saved restaurants.
    @param request:
    @return:
    """
    location = request.GET.get('location')

    if not location:
        location = DEFAULT_LOCATION

    places = []
    return JsonResponse({"result": [place.to_dict() for place in places]})


def ping(request):
    """
    Ping the server to see if it's up and running.
    @param request: the request
    @return: OK if it's up and running.'
    """
    return JsonResponse({"success": "OK"})


def index(request):
    """
    Test django index view
    @param request:
    @return:
    """
    images = Image.objects.all()
    image_table = ImageTable(images)
    upload_form = UploadForm()

    return render(request, 'index.html', {
        'images': images,
        'image_table': image_table,
        'upload_form': upload_form,
        'result': request.session.get('result'),
    })


@require_http_methods(["POST"])
def upload_view(request):
    """
    Test django upload view
    @param request:
    @return:
    """
    upload_form = UploadForm(data=request.POST, files=request.FILES)
    user_profile = UserProfile("Low Calories", "Peanut Allergy", "Thai, Korean, Japanese", "Sweet, Less Spicy, Herbal")
    if upload_form.is_valid():
        recommended_result = snapeat_api.recommend_from_menu_image(upload_form.instance.file, user_profile)
        logging.info(recommended_result)
    else:
        logging.warning("Something went wrong with uploading the file.")
        logging.warning(request.POST)
        logging.warning(request.FILES)

    return redirect('index')

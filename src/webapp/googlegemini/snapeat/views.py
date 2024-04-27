import logging
import os
import json

from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .apis.UserProfile import UserProfile
from .apis.google_place_api import GooglePlaceApi
from .apis.snapeat_api import SnapEatApi
from .forms import UploadForm
from .models import Image
from .tables import ImageTable

DEFAULT_LOCATION = "Manhattan, New York, NY"
google_place_api = GooglePlaceApi(os.getenv('GOOGLE_API_KEY'))
snapeat_api = SnapEatApi(os.getenv('GOOGLE_API_KEY'), os.getenv('GOOGLE_PROJECT_CX'))

@require_http_methods(["POST"])
@csrf_exempt
def recommend_from_menu(request):
    if 'menuImage' not in request.FILES:
        return JsonResponse({'error': 'Invalid request: Menu image is missing or empty'}, status=400)

    test = request.POST.get('userProfile')
    user_profile_data = json.loads(test)
    diets = user_profile_data.get('diets')
    allergies = user_profile_data.get('allergies')
    cuisines = user_profile_data.get('cuisines')
    flavors = user_profile_data.get('flavors')

    user_profile = UserProfile(diets, allergies, cuisines, flavors)
    return snapeat_api.recommend(request.FILES['menuImage'], user_profile)


def get_nearby_restaurants(request):
    location = request.GET.get('location')

    if not location:
        location = DEFAULT_LOCATION

    places = google_place_api.get_nearby_restaurant(location)
    return JsonResponse({"result": [place.to_dict() for place in places]})


def get_saved_restaurants(request):
    """
    Returns a list of all saved restaurants.
    This is just a static function for demo.
    """
    location = request.GET.get('location')

    if not location:
        location = DEFAULT_LOCATION

    places = []
    return JsonResponse({"result": [place.to_dict() for place in places]})


def get_trending_restaurants(request):
    """
    Returns a list of all saved restaurants.
    This is just a static function for demo.
    """
    location = request.GET.get('location')

    if not location:
        location = DEFAULT_LOCATION

    places = []
    return JsonResponse({"result": [place.to_dict() for place in places]})


def ping(request):
    return JsonResponse({"success": "OK"})


def index(request):
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
    upload_form = UploadForm(data=request.POST, files=request.FILES)
    user_profile = UserProfile("Low Calories", "Peanut Allergy", "Thai, Korean, Japanese", "Sweet, Less Spicy, Herbal")
    if upload_form.is_valid():
        recommended_result = snapeat_api.recommend(upload_form.instance.file, user_profile)
        logging.info(recommended_result)
    else:
        logging.warning("Something went wrong with uploading the file.")
        logging.warning(request.POST)
        logging.warning(request.FILES)

    return redirect('index')
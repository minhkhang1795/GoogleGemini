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
    """
    Recommends dishes from a menu image and user profile
    @param request:
    @return:
    """
    if 'menuImage' not in request.FILES:
        return JsonResponse({'error': 'Invalid request: Menu image is missing or empty'}, status=400)

    if 'userProfile' not in request.POST:
        return JsonResponse({'error': 'Invalid request: User profile is missing or empty'}, status=400)

    user_profile = UserProfile.create_from_string(request.POST.get('userProfile'))
    if not user_profile.is_valid():
        return JsonResponse({'error': 'Invalid request: User profile is invalid. Cuisines and Flavors are '
                                      'the required fields.'}, status=400)

    return snapeat_api.recommend(request.FILES['menuImage'], user_profile)


def recommend_by_restaurant(request):
    pass


def search_restaurants(request):
    pass


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
        recommended_result = snapeat_api.recommend(upload_form.instance.file, user_profile)
        logging.info(recommended_result)
    else:
        logging.warning("Something went wrong with uploading the file.")
        logging.warning(request.POST)
        logging.warning(request.FILES)

    return redirect('index')

import logging
import os

from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .forms import UploadForm
from .gemini.menu_image_model import MenuImageModel
from .models import Image
from .tables import ImageTable

menu_image_model = MenuImageModel(os.getenv('GOOGLE_API_KEY'))


@require_http_methods(["POST"])
@csrf_exempt
def recommend_view(request):
    if 'menuImage' not in request.FILES:
        return JsonResponse({'error': 'Invalid request.'})

    result = menu_image_model.menu_image_to_text(request.FILES['menuImage'])
    return JsonResponse({"result": result})


def get_view(request):
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

    if upload_form.is_valid():
        result = menu_image_model.menu_image_to_text(upload_form.instance.file)
        request.session['result'] = result
        logging.info(result)
    else:
        logging.warning("Something went wrong with uploading the file.")
        logging.warning(request.POST)
        logging.warning(request.FILES)

    return redirect('index')
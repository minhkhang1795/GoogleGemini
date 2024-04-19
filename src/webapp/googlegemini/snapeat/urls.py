from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('ping/', views.ping, name='ping'),
    path('upload/', views.upload_view, name='upload'),
    path('recommend/', views.recommend_from_menu, name='recommend'),
    path('get_nearby_restaurant/', views.get_nearby_restaurant, name='get_nearby_restaurant'),
]

from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('ping/', views.ping, name='ping'),
    path('upload/', views.upload_view, name='upload'),
    path('recommend/', views.recommend_from_menu, name='recommend'),
    path('recommendByRestaurant/', views.recommend_by_restaurant, name='recommend_by_restaurant'),
    path('restaurants/search/', views.search_restaurants, name='search_restaurants'),
    path('restaurants/nearby/', views.get_nearby_restaurants, name='get_nearby_restaurants'),
    path('restaurants/saved/', views.get_saved_restaurants, name='get_saved_restaurants'),
    path('restaurants/trending/', views.get_trending_restaurants, name='get_trending_restaurants'),
]

from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('upload/', views.upload_view, name='upload'),
    path('recommend/', views.recommend_view, name='recommend'),
    path('get/', views.get_view, name='get'),
]
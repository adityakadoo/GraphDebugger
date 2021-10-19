from django.contrib import admin
from django.urls import path, include
from .views import graphview,configview

"""API url are added here"""
urlpatterns = [
    path("graph/",graphview.as_view()),
    path("config/",configview.as_view()),
]
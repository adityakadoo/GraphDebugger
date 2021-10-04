from django.contrib import admin
from django.urls import path, include
from . import views

"""API url are added here"""
urlpatterns = [
    path("start/", views.start_process, name="start"),
]
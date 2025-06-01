from django.urls import path
from .views import *

urlpatterns = [
    path('add_new_ingredient/', add_new_ingredient, name='add_new_ingredient'),
]
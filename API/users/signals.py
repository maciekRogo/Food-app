import json

from django.contrib.auth.models import User

from recipes.models import Recipe


def create_initial_data(sender, **kwargs):
    User.objects.create_user(
        username="user@gmail.com",
        email="user@gmail.com",
        password="123"
    )


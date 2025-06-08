from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('login_via_request/', login_via_request, name='login_via_request'),
    path('register_via_request/', register_via_request, name='register_via_request'),
]

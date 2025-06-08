import json

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer, LoginSerializer
from django.http import JsonResponse


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Zarejestrowano pomyślnie!"}, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.body
        data = data.decode('utf-8')
        data = json.loads(data)

        serializer = self.get_serializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
            return JsonResponse({"message": "Zalogowano pomyślnie!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


def login_via_request(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        serializer = LoginSerializer(data=data)
        if serializer.is_valid():
            user = serializer.validated_data
            return JsonResponse({"message": "Zalogowano pomyślnie!"}, status=200)
        else:
            errors = serializer.errors
            if 'non_field_errors' in errors:
                return JsonResponse({"detail": errors['non_field_errors']}, status=400)
            return JsonResponse({"detail": serializer.errors}, status=400)
    return JsonResponse({"detail": "Method not allowed"}, status=405)


def register_via_request(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({"message": "Zarejestrowano pomyślnie!"}, status=201)
        else:

            return JsonResponse({"detail": serializer.errors}, status=400)
    return JsonResponse({"detail": "Method not allowed"}, status=405)

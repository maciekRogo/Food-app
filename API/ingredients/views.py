from django.http import JsonResponse
import json
from .models import Ingredient

def add_new_ingredient(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method Not Allowed'}, status=405)
    body = request.body.decode('utf-8')
    data = json.loads(body)
    if Ingredient.objects.filter(name=data["name"]).exists():
        return JsonResponse({'message': 'Ingredient already exists'}, status=400)
    Ingredient.objects.create(name=data['name'])
    return JsonResponse({'message': 'Ingredient added'}, status=201)
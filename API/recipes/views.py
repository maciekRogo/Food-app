import json

from django.http import JsonResponse
from rest_framework import viewsets
from .models import Recipe, Ingredient, RecipeIngredient
from .serializers import RecipeSerializer, IngredientSerializer

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer


class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer

def add_new_ingredient(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method Not Allowed'}, status=405)
    body = request.body.decode('utf-8')
    data = json.loads(body)
    if Ingredient.objects.filter(name=data["name"]).exists():
        return JsonResponse({'message': 'Ingredient already exists'}, status=400)
    Ingredient.objects.create(name=data['name'])
    return JsonResponse({'message': 'Ingredient added'}, status=201)



def add_new_recipe(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method Not Allowed'}, status=405)
    body = request.body.decode('utf-8')
    body = json.loads(body)
    recipe = Recipe(
        name_of_the_dish=body['title'],
        img_url=body['img'],
        diet_type=body['diet'],
    )
    recipe.save()

    for ingredient_name in body['ingredients']:
        if not Ingredient.objects.filter(name=ingredient_name).exists():
            ingredient = Ingredient.objects.create(name=ingredient_name)
        else:
            ingredient = Ingredient.objects.filter(name=ingredient_name).first()
        RecipeIngredient.objects.create(recipe=recipe, ingredient=ingredient)

    return JsonResponse({'message': 'Recipe added'}, status=201)




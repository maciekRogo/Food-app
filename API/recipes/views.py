import json

from django.http import JsonResponse
from rest_framework import viewsets
from .models import Recipe, RecipeIngredient
from ingredients.models import Ingredient
from .serializers import RecipeSerializer, IngredientSerializer

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer


class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer


def add_new_recipe(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method Not Allowed'}, status=405)
    body = request.body.decode('utf-8')
    body = json.loads(body)
    recipe = Recipe(
        name_of_the_dish=body['title'],
        link=body['link'],
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

def get_recipes(request):
    recipes = Recipe.objects.all()
    data = []
    for recipe in recipes:
        ingredients = [ingredient.name for ingredient in recipe.ingredients.all()]
        data.append({
            "id":recipe.id,
            "title":recipe.name_of_the_dish,
            "link":recipe.link,
            "img_url":recipe.img_url,
            "diet_type":recipe.diet_type,
            "ingredients":ingredients,
        })

    return JsonResponse(data, safe=False)


def get_recipes_by_ingredients(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method Not Allowed'}, status=405)
    body = request.body.decode('utf-8')
    body = json.loads(body)
    recipes = Recipe.objects.all()
    ingredients = body['ingredients']
    filtered_recipes = []



    for recipe in recipes:
        recipe_ingredients = [ingredient.name for ingredient in recipe.ingredients.all()]
        if not set(ingredients).issubset(set(recipe_ingredients)):
            continue
        filtered_recipes.append(recipe)

    return JsonResponse(filtered_recipes, safe=False, status=200)





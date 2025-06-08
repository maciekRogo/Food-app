import json

from recipes.models import Ingredient, RecipeIngredient, Recipe


def create_initial_data(sender, **kwargs):
    with open("recipes.json", "r", encoding="utf-8") as file:
        recipes = json.load(file)
    for recipe in recipes:
        recipe_obj = Recipe(
            name_of_the_dish=recipe['title'],
            link=recipe['recipe_link'],
            img_url=recipe['img'],
            diet_type=recipe['diet'][0] if recipe['diet'] else None,
        )
        recipe_obj.save()

        for ingredient_name in recipe['ingredients']:
            if not Ingredient.objects.filter(name=ingredient_name).exists():
                ingredient = Ingredient.objects.create(name=ingredient_name)
            else:
                ingredient = Ingredient.objects.filter(name=ingredient_name).first()
            RecipeIngredient.objects.create(recipe=recipe_obj, ingredient=ingredient)
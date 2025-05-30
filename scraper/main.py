import json

from methods import *

urls = [f"https://aniagotuje.pl/pomysl-na/obiad/strona/{i}" for i in range(1, 52)]
recipes = get_all_recipes(urls)

recipes_dicts = [recipe.to_dict() for recipe in recipes]

recipe = get_recipe("https://aniagotuje.pl/przepis/soczysta-piers-z-kaczki-z-dodatkiem-pak-choi")
recipe_dict = recipe.to_dict()

print(recipe_dict)

# with open("recipes.json", "w",encoding="utf-8") as file:
#     json.dump(recipes_dicts, file, indent=2, ensure_ascii=False)
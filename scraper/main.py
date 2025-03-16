from methods import *

urls = [f"https://aniagotuje.pl/pomysl-na/obiad/strona/{i}" for i in range(1, 52)]
recipes = get_all_recipes(urls)
print(len(recipes))


import warnings
from collections import OrderedDict

import requests
from bs4 import BeautifulSoup

from ingredients_list import ingredients_dict


class Recipe:
    def __init__(self, title, img, recipe_link, diet, ingredients):
        self.title = title
        self.img = img
        self.recipe_link = recipe_link
        self.diet = diet
        self.ingredients = ingredients

    def __str__(self):
        return f"{self.title}\n{self.img}\n{self.recipe_link}\n{self.diet}\n{self.ingredients}"

    def to_dict(self):
        return {
            "title": self.title,
            "img": self.img,
            "recipe_link": self.recipe_link,
            "diet": self.diet,
            "ingredients": self.ingredients
        }


def get_recipe(url, ingredients_dic=ingredients_dict):
    response = requests.get(url)
    if response.status_code != 200:
        return None
    soup = BeautifulSoup(response.text, 'html.parser')
    page = soup.find('div', class_='article-content')

    img = soup.find("div", class_="article-main-google-img-wrapper").find("img").get("src")
    title = page.find("h1").text

    diet = get_diet(soup)

    ingredients = get_ingredients(soup,ingredients_dic)

    return Recipe(title, img, url, diet, ingredients)


def get_all_recipes(pages_url):
    with open('ingredients_not_found.txt', 'w') as file:
        pass
    recipes = []
    for page_url in pages_url:
        response = requests.get(page_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        articles = soup.findAll('article')
        for article in articles:
            url = "https://aniagotuje.pl" + article.find("a").get("href")
            print(url)
            recipes.append(get_recipe(url))
    return recipes


def get_diet(soup):
    container = soup.find('p', class_='recipe-info')
    if container is None:
        return ["brak"]
    paragraph = container.text.split("\n")
    diet_into = container.find("link")
    if diet_into is None:
        return ["brak"]
    diet_info_row = paragraph[-1]
    diet = diet_info_row.split(": ")[1]
    multiples_diets = diet.split(", ")
    multiples_diets = [diet.replace(" ", "").lower() for diet in multiples_diets]
    if len(multiples_diets) > 1:
        return multiples_diets
    return [diet]


def get_ingredients(soup, ingredients_dic=ingredients_dict):
    ingredients_cont = soup.findAll('ul', class_='recipe-ing-list')
    if ingredients_cont is None:
        return []
    ingredients = OrderedDict()
    for ingredient_container in ingredients_cont:
        ingredients_list = ingredient_container.findAll("li")
        for i in ingredients_list:
            name = i.find("span", class_="ingredient").text.lower()
            replaced_name = replace_ingredients(name, ingredients_dic)
            if replaced_name:
                ingredients[replaced_name] = None
    return list(ingredients.keys())


def replace_ingredients(ingredient, ingredients_list=ingredients_dict):
    for key, values in ingredients_list.items():
        for value in values:
            if value in ingredient:
                return key
    warnings.warn(f"{ingredient} not found")
    return None

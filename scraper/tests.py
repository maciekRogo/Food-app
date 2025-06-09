import unittest
from unittest.mock import Mock, patch

from bs4 import BeautifulSoup

from methods import get_diet, get_ingredients, get_recipe, replace_ingredients


class TestGetRecipe(unittest.TestCase):
    def setUp(self):
        self.ingredients = {
            "sugar": ["white sugar", "brown sugar"],
            "flour": ["all-purpose flour", "whole wheat flour"],
            "butter": ["unsalted butter", "salted butter"],
            "cebula": ['cebule', 'cebul', 'cebula', 'cebulek', 'cebulą', 'cebulki', 'cebulka', 'cebuli'],

        }
    @patch('methods.requests.get')
    def test_get_recipe_invalid_url(self, mock_get):
        mock_get.return_value = Mock(status_code=404)

        url = "http://example.com/invalid"
        recipe = get_recipe(url)

        self.assertIsNone(recipe)
    @patch('methods.requests.get')
    def test_get_recipe(self, mock_get):
        html_content = '''
        <html>
            <div class="article-content">
                <h1>Test Recipe</h1>
            </div>
            <div class="article-main-google-img-wrapper">
                <img src="http://example.com/image.jpg" />
            </div>
            <ul class="recipe-ing-list"><li><span class="ingredient">white sugar</span></li><li><span class="ingredient">whole wheat flour</span></li></ul>
            <p class="recipe-info"><strong>Dieta:</strong> <link itemprop="suitableForDiet" href="https://schema.org/GlutenFreeDiet">vegan</p>
        </html>
        '''
        mock_get.return_value = Mock(status_code=200, text=html_content)

        url = "http://example.com/recipe"
        recipe = get_recipe(url,self.ingredients)

        # Assertions
        self.assertEqual(recipe.title, "Test Recipe")
        self.assertEqual(recipe.img, "http://example.com/image.jpg")
        self.assertEqual(recipe.recipe_link, url)
        self.assertEqual(recipe.diet, ["vegan"])
        self.assertEqual(recipe.ingredients, ["sugar", "flour"])

class TestGetIngredients(unittest.TestCase):
    def setUp(self):
        self.ingredients = {
            "sugar": ["white sugar", "brown sugar"],
            "flour": ["all-purpose flour", "whole wheat flour"],
            "butter": ["unsalted butter", "salted butter"],
            "cebula": ['cebule', 'cebul', 'cebula', 'cebulek', 'cebulą', 'cebulki', 'cebulka', 'cebuli'],

        }

    def test_get_ingredients_no_list(self):
        html = '<html></html>'
        soup = BeautifulSoup(html, 'html.parser')
        self.assertEqual(get_ingredients(soup), [])

    def test_get_ingredients_empty_list(self):
        html = '<html><ul class="recipe-ing-list"></ul></html>'
        soup = BeautifulSoup(html, 'html.parser')
        self.assertEqual(get_ingredients(soup), [])

    def test_get_ingredients_single_ingredient(self):
        html = '<html><ul class="recipe-ing-list"><li><span class="ingredient">white sugar</span></li></ul></html>'
        soup = BeautifulSoup(html, 'html.parser')
        self.assertEqual(get_ingredients(soup,ingredients_dic=self.ingredients), ["sugar"])

    def test_get_ingredients_multiple_ingredients(self):
        html = '<html><ul class="recipe-ing-list"><li><span class="ingredient">white sugar</span></li><li><span class="ingredient">whole wheat flour</span></li></ul></html>'
        soup = BeautifulSoup(html, 'html.parser')
        self.assertEqual(get_ingredients(soup,ingredients_dic=self.ingredients), ["sugar", "flour"])

    def test_get_ingredients_multiple_recipe_ing_list(self):
        html = '<html><ul class="recipe-ing-list"><li><span class="ingredient">white sugar</span></li><li><span class="ingredient">whole wheat flour</span></li></ul><ul class="recipe-ing-list"><li><span class="ingredient">unsalted butter</span></li><li><span class="ingredient">cebule</span></li></ul></html>'
        soup = BeautifulSoup(html, 'html.parser')
        self.assertEqual(get_ingredients(soup,ingredients_dic=self.ingredients), ['sugar', 'flour', 'butter', 'cebula'])

class TestGetDiet(unittest.TestCase):
    def test_get_diet_no_container(self):
        html = '<html></html>'
        soup = BeautifulSoup(html, 'html.parser')
        self.assertEqual(get_diet(soup), ["brak"])

    def test_get_diet_no_link(self):
        html = '<html><p class="recipe-info"></p></html>'
        soup = BeautifulSoup(html, 'html.parser')
        self.assertEqual(get_diet(soup), ["brak"])

    def test_get_diet_single_diet(self):
        html = '<html><p class="recipe-info"><strong>Dieta:</strong> <link itemprop="suitableForDiet" href="https://schema.org/GlutenFreeDiet">vegan</p></html>'
        soup = BeautifulSoup(html, 'html.parser')
        self.assertEqual(get_diet(soup), ["vegan"])

    def test_get_diet_multiple_diets(self):
        html = '<html><p class="recipe-info"><strong>Dieta:</strong> <link itemprop="suitableForDiet" href="https://schema.org/GlutenFreeDiet"> <link itemprop="suitableForDiet" href="https://schema.org/VegetarianDiet">vegan, gluten-free<br></p></html>'
        soup = BeautifulSoup(html, 'html.parser')
        self.assertEqual(get_diet(soup), ["vegan", "gluten-free"])

class TestReplaceIngredients(unittest.TestCase):
    def setUp(self):
        self.ingredients = {
            "sugar": ["white sugar", "brown sugar"],
            "flour": ["all-purpose flour", "whole wheat flour"],
            "butter": ["unsalted butter", "salted butter"],
            "cebula": ['cebule', 'cebul', 'cebula', 'cebulek', 'cebulą', 'cebulki', 'cebulka', 'cebuli'],

        }

    def test_replace_ingredients_found(self):
        self.assertEqual(replace_ingredients("white sugar",self.ingredients), "sugar")

    def test_replace_ingredients_not_found(self):
        self.assertIsNone(replace_ingredients("honey",self.ingredients))
    def test_replace_ingredients_sentence(self):
        self.assertEqual(replace_ingredients("200 g cebuli - np. 2 mnijesze cukrowe",self.ingredients), "cebula")


if __name__ == '__main__':
    unittest.main()

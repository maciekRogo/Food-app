import json


def get_words_with_key_word(key_word : str)-> set:
    word_list = set()
    for recipe in recipes:
        ingredients = recipe["ingredients"]
        for ingredient in ingredients:
            for word in ingredient.split():
                if key_word in word:
                    word = word.replace(",", "")
                    word = word.replace(".", "")
                    word = word.replace(":", "")
                    word = word.replace(";", "")
                    word = word.replace(")", "")
                    word = word.replace("(", "")
                    word = word.replace("*", "")
                    word = word.replace("-", "")
                    word_list.add(word)
    return word_list

def get_ingredients() -> set:
    ingredients = set()
    for recipe in recipes:
        for ingredient in recipe["ingredients"]:
            ingredients.add(ingredient)
            # for word in ingredient.split():
            #     word=word.replace(",","")
            #     word=word.replace(".","")
            #     word=word.replace(":","")
            #     word=word.replace(";","")
            #     word=word.replace(")","")
            #     word=word.replace("(","")
            #     ingredients.add(word)
    return ingredients


with open('../scraper/recipes.json', encoding="utf-8") as f:
    recipes = json.load(f)

# with open('ingredients.json',"w",encoding="utf-8") as file:
#     json.dump(list(get_ingredients(recipes)),file,ensure_ascii=False)

print(get_words_with_key_word("szynk"))

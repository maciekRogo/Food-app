from rest_framework import serializers
from .models import Recipe, Ingredient

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name']

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = serializers.ListField(
        child=serializers.CharField(), write_only=True
    )

    class Meta:
        model = Recipe
        fields = ['id', 'name_of_the_dish', 'img_url', 'diet_type', 'ingredients']

    def create(self, validated_data):
        ingredient_names = validated_data.pop('ingredients')
        recipe = Recipe.objects.create(**validated_data)

        for name in ingredient_names:
            ingredient, _ = Ingredient.objects.get_or_create(name=name)
            recipe.ingredients.add(ingredient)

        return recipe

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecipeViewSet, IngredientViewSet, add_new_recipe, add_new_ingredient

# Tworzymy router, który automatycznie tworzy URL do widoków
router = DefaultRouter()
router.register(r'recipes', RecipeViewSet)
router.register(r'ingredients', IngredientViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('add_new_recipe/', add_new_recipe, name='add_new_recipe'),
    path('add_new_ingredient/', add_new_ingredient, name='add_new_ingredient'),
]

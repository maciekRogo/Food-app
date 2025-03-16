# Scraper

Pobiera przepisy z serwisu [aniagotuje.pl](https://aniagotuje.pl/).

# Instalacja

```bash
pip install -r requirements.txt
```

# Uruchomienie

```bash
python main.py
```

# Testowanie

```bash
python -m unittest
```

# Dokumentacja metod

Ten moduł dostarcza funkcje do pobierania przepisów z witryny i wyodrębniania odpowiednich informacji, takich jak tytuł, obraz, dieta i składniki.

## Klasy

### Recipe

Klasa reprezentująca przepis.

#### Atrybuty

- `title` (str): Tytuł przepisu.
- `img` (str): URL obrazu przepisu.
- `recipe_link` (str): URL strony z przepisem.
- `diet` (list): Lista diet odpowiednich dla przepisu.
- `ingredients` (list): Lista składników przepisu.

#### Metody

- `__str__()`: Zwraca tekstową reprezentację przepisu.

## Funkcje

### get_recipe(url)

Pobiera i parsuje przepis z podanego URL.

#### Parametry

- `url` (str): URL strony z przepisem.

#### Zwraca

- `Recipe`: Instancja klasy `Recipe` zawierająca szczegóły przepisu, lub `None` jeśli żądanie się nie powiodło.

### get_all_recipes(pages_url)

Pobiera i parsuje przepisy z listy URL stron.

#### Parametry

- `pages_url` (list): Lista URL stron zawierających przepisy.

#### Zwraca

- `list`: Lista instancji klasy `Recipe`.

### get_diet(soup)

Ekstrahuje informacje o diecie z obiektu BeautifulSoup.

#### Parametry

- `soup` (BeautifulSoup): Obiekt BeautifulSoup reprezentujący HTML strony z przepisem.

#### Zwraca

- `list`: Lista diet odpowiednich dla przepisu, lub `["brak"]` jeśli nie znaleziono informacji o diecie.

### get_ingredients(soup)

Ekstrahuje składniki z obiektu BeautifulSoup.

#### Parametry

- `soup` (BeautifulSoup): Obiekt BeautifulSoup reprezentujący HTML strony z przepisem.

#### Zwraca

- `list`: Lista składników przepisu, lub pusta lista jeśli nie znaleziono składników.


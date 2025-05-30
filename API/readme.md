Oto dokumentacja w języku polskim dla trzech funkcji widoków Django: `add_new_ingredient`, `add_new_recipe` oraz `get_recipes`.

---

## 📌 Funkcja: `add_new_ingredient(request)`

### Opis

Dodaje nowy składnik do bazy danych.

### Metoda HTTP

`POST`

### Parametry wejściowe (w treści żądania, JSON)

```json
{
  "name": "nazwa_skladnika"
}
```

### Działanie

* Sprawdza, czy metoda HTTP to `POST`. Jeśli nie, zwraca błąd 405.
* Dekoduje treść żądania i konwertuje ją z JSON.
* Sprawdza, czy składnik o podanej nazwie już istnieje w bazie danych:

  * Jeśli tak – zwraca błąd 400.
  * Jeśli nie – tworzy nowy rekord składnika (`Ingredient`).

### Odpowiedzi

* `201 Created`: Składnik został dodany.

  ```json
  { "message": "Ingredient added" }
  ```
* `400 Bad Request`: Składnik już istnieje.

  ```json
  { "message": "Ingredient already exists" }
  ```
* `405 Method Not Allowed`: Niepoprawna metoda HTTP.

  ```json
  { "message": "Method Not Allowed" }
  ```

---

## 📌 Funkcja: `add_new_recipe(request)`

### Opis

Dodaje nowy przepis wraz z jego składnikami.

### Metoda HTTP

`POST`

### Parametry wejściowe (w treści żądania, JSON)

```json
{
  "title": "nazwa_dania",
  "link": "https://link.do.przepisu",
  "img": "https://link.do.obrazka",
  "diet": "typ_diety",
  "ingredients": ["Składnik 1", "Składnik 2"]
}
```

### Działanie

* Sprawdza, czy metoda to `POST`.
* Dekoduje i konwertuje treść żądania z JSON.
* Tworzy nowy rekord `Recipe` (przepis).
* Dla każdego składnika z listy:

  * Sprawdza, czy składnik istnieje w bazie danych:

    * Jeśli nie – tworzy nowy składnik.
  * Tworzy relację `RecipeIngredient` między przepisem a składnikiem.

### Odpowiedzi

* `201 Created`: Przepis został dodany.

  ```json
  { "message": "Recipe added" }
  ```
* `405 Method Not Allowed`: Niepoprawna metoda HTTP.

  ```json
  { "message": "Method Not Allowed" }
  ```

---

## 📌 Funkcja: `get_recipes(request)`

### Opis

Zwraca listę wszystkich przepisów wraz ze składnikami.

### Metoda HTTP

`GET`

### Parametry wejściowe

Brak.

### Działanie

* Pobiera wszystkie przepisy (`Recipe`) z bazy danych.
* Dla każdego przepisu tworzy słownik zawierający:

  * ID
  * nazwę dania
  * link
  * URL do zdjęcia
  * typ diety
  * listę składników

### Odpowiedź (`200 OK`)

```json
[
  {
    "id": 1,
    "title": "Nazwa dania",
    "link": "https://link.do.przepisu",
    "img_url": "https://link.do.obrazka",
    "diet_type": "typ_diety",
    "ingredients": ["Składnik 1", "Składnik 2"]
  },
  ...
]
```

---


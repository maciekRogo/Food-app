Scrapowane składniki znadują się w pełnych zdaniach, celem tego pomocniczego skryptu jest wydobycie z nich składników, które są wymienione w formie listy.

## Jak to działa?

1. Tworzę plik `recipes.json` w którym są przechowywane przepisy w formacie JSON(tworzy sie w scraperze).
2. Do funkcji `get_words_with_key_word` daje podstawe nazwy w przypadku składnika o nazwie cebula, podstawą nazwą będzie cebul.
3. Funkcja `get_words_with_key_word` zwraca listę składników, które zawierają podstawową nazwę.
4. Zwrócone składniki zapisuje w pliku `ingredients_list.py`.
5. Później dodaje je do scrapera
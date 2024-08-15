import sys
from bs4 import BeautifulSoup
from collections import defaultdict
import requests


# isNumber(element) checks if element is a number
def isNumber(element):
    try:
        _ = int(element)
        return True
    except ValueError:
        return False


# clean(text) cleans the text for the search
def clean(text):
    inc = 0
    while isNumber(text[inc]):
        inc += 1
    return text[inc + 2:]


def main():
    movieCategories = sys.argv[1].split(",").split(",")
    print(movieCategories)
    try:
        URL_1_IMDB = "https://www.imdb.com/search/title/?genres="
        URL_2_IMDB = "&explore=genres&title_type=feature"
        CATEGORIES = ("".join(str(type) + "," for type in movieCategories).strip()
                    .replace(" ", "")[:-1])
        url_IMDB = URL_1_IMDB + CATEGORIES + URL_2_IMDB
        HEADERS = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36"}

        page = requests.get(url_IMDB, headers=HEADERS)
        soup = BeautifulSoup(page.text, 'html.parser')
        movie_table = soup.find("ul", class_="ipc-metadata-list ipc-metadata-list--dividers-between sc-748571c8-0 jmWPOZ detailed-list-view ipc-metadata-list--base")
        movie_names = movie_table.find_all("h3", recursive=True)
        IMDB_LIST = [clean(name.text) for name in movie_names]
    except AttributeError:
        IMDB_LIST = []


    try:
        URL_1_TOMATOES = "https://www.rottentomatoes.com/browse/movies_at_home/genres:"
        URL_2_TOMATOES = "?page=2"
        CATEGORIES = ("".join(str(type) + "," for type in movieCategories).strip()
                    .replace(" ", "")[:-1])
        url_TOMATOES = URL_1_TOMATOES + CATEGORIES + URL_2_TOMATOES
        page = requests.get(url_TOMATOES, headers=HEADERS)
        page = requests.get(url_TOMATOES, headers=HEADERS)
        soup = BeautifulSoup(page.text, 'html.parser')
        movie_table = soup.find("div", class_="discovery-tiles__wrap")
        movie_names = movie_table.find_all("span", class_="p--small", recursive=True)
        TOMATOES_LIST = [name.text.strip() for name in movie_names]
    except AttributeError:
        TOMATOES_LIST = []

    try:
        URL_1_META = "https://www.metacritic.com/browse/movie/all/all/all-time/new/?releaseYearMin=1910&releaseYearMax=2024"
        categories_META = ("".join("&genre=" + category for category in movieCategories)
                        .strip())

        URL_2_META = "&page=1"
        url_META = URL_1_META + categories_META + URL_2_META
        page = requests.get(url_META, headers=HEADERS)
        soup = BeautifulSoup(page.text, 'html.parser')
        movie_table = soup.find("div", class_="c-productListings_grid g-grid-container u-grid-columns g-inner-spacing-bottom-large g-inner-spacing-top-large")
        movie_names = movie_table.find_all("div", class_="c-finderProductCard_title")
        META_LIST = [name.text.strip() for name in movie_names]
        movie_table = soup.find("div", class_="c-productListings_grid g-grid-container u-grid-columns g-inner-spacing-bottom-large")
        movie_names = movie_table.find_all("div", class_="c-finderProductCard_title")
        for name in movie_names:
            META_LIST.append(name.text.strip())
    except AttributeError:
        META_LIST = []

    freq = defaultdict(lambda: 0)
    for name in IMDB_LIST:
        freq[name] += 1
    for name in META_LIST:
        freq[name] += 1
    for name in TOMATOES_LIST:
        freq[name] += 1
    freq_list = ([x for _, x in sorted(zip(list(freq.values()),
                                        list(freq.keys())), reverse=True)])
    print(freq_list)
    sys.stdout.flush()


main()

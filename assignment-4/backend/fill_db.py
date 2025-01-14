import json
from config import db, app
from models import Actor, Director, Film, Genre
import os

current_directory = os.path.dirname(os.path.abspath(__file__))

# This file is used to load data from each class' corresponding JSON file

def load_json_data(filename):
    file_path = os.path.join(current_directory, 'database', filename)
    with open(file_path, 'r') as file:
        return json.load(file)
    

def fill_actors() -> None:
    actors = load_json_data('actors.json')
    for actor_info in actors:
        actor = Actor(first_name=actor_info['firstName'], last_name=actor_info['lastName'], age=actor_info['age'])
        db.session.add(actor)
    db.session.commit()


def fill_directors() -> None:
    directors = load_json_data('directors.json')
    for director_info in directors:
        director = Director(first_name=director_info['firstName'], last_name=director_info['lastName'], nationality=director_info['nationality'])
        db.session.add(director)
    db.session.commit()


def fill_films() -> None:
    films = load_json_data('films.json')
    for film_info in films:
        film = Film(name=film_info['name'], year=film_info['year'], director_id=film_info['directorId'], genre_id=film_info['genreId'])
        db.session.add(film)
    db.session.commit()

def fill_genres() -> None:
    genres = load_json_data('genres.json')
    for genre_info in genres:
        genre = Genre(id=genre_info['id'], name=genre_info['name'])
        db.session.add(genre)
    db.session.commit()

def fill_film_actor() -> None:
    film_actor_data = load_json_data('film_actor.json')
    for film_actor_info in film_actor_data:
        film = Film.query.get(film_actor_info['film_id'])
        actor = Actor.query.get(film_actor_info['actor_id'])
        film.actors.append(actor)
    db.session.commit()


if __name__ == "__main__":
    with app.app_context():
        fill_actors()
        fill_directors()
        fill_films()
        fill_genres()
        fill_film_actor()
        print("Successfully loaded database")

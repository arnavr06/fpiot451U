import json
from config import db, app
from models import Actor, Director, Film
import os

current_directory = os.path.dirname(os.path.abspath(__file__))

def load_json_data(filename):
    file_path = os.path.join(current_directory, 'database', filename)
    with open(file_path, 'r') as file:
        return json.load(file)
    

def fill_actors():
    actors = load_json_data('actors.json')
    for actor_info in actors:
        actor = Actor(first_name=actor_info['firstName'], last_name=actor_info['lastName'], age=actor_info['age'])
        db.session.add(actor)
    db.session.commit()


def fill_directors():
    directors = load_json_data('directors.json')
    for director_info in directors:
        director = Director(first_name=director_info['firstName'], last_name=director_info['lastName'], nationality=director_info['nationality'])
        db.session.add(director)
    db.session.commit()


def fill_films():
    films = load_json_data('films.json')
    for film_info in films:
        film = Film(name=film_info['name'], year=film_info['year'], director_id=film_info['directorId'])
        db.session.add(film)
    db.session.commit()


if __name__ == "__main__":
    with app.app_context():
        fill_actors()
        fill_directors()
        fill_films()
        print("Successfully loaded database")

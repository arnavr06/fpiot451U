from flask import current_app
from config import db
from sqlalchemy.orm import relationship
from typing import List, Dict, Any

# The line below establishes a many-to-many relationship between films and actors
# It creates a table which references film ID and actor ID as foreign keys
film_actor = db.Table('film_actor', db.Column('film_id', db.Integer, db.ForeignKey('film.id'), primary_key=True), db.Column('actor_id', db.Integer, db.ForeignKey('actor.id'), primary_key=True))


# Below is the class definition for Actor
class Actor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    films = relationship('Film', secondary=film_actor, back_populates='actors')
    def to_json(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "age": self.age,
        }


# Below is the class definiton for Director
class Director(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    nationality = db.Column(db.String(100), nullable=False)
    films = relationship('Film', back_populates='director')
    def to_json(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "nationality": self.nationality
        }


# Below is the class definition for Film
class Film(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    year = db.Column(db.String(100), nullable=False)
    director = relationship('Director', back_populates='films')
    director_id = db.Column(db.Integer, db.ForeignKey("director.id"), nullable=False)
    actors = relationship('Actor', secondary=film_actor, back_populates='films')
    genre = relationship('Genre', back_populates='films')
    genre_id = db.Column(db.Integer, db.ForeignKey('genre.id'))
    def to_json(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "year": self.year,
            "directorId": self.director_id,
            "genreId": self.genre_id,
            "actorId": [actor.id for actor in self.actors],
            "genre": self.genre.to_json() if self.genre else None
        }


# Below is the class definition for Genre
class Genre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    films = relationship('Film', back_populates='genre')
    def to_json(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
        }
    
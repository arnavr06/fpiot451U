from flask import current_app
from config import db
from sqlalchemy.orm import relationship

film_actor = db.Table('film_actor', db.Column('film_id', db.Integer, db.ForeignKey('film.id'), primary_key=True), db.Column('actor_id', db.Integer, db.ForeignKey('actor.id'), primary_key=True))
film_genre = db.Table('film_genre', db.Column('film_id', db.Integer, db.ForeignKey('film.id'), primary_key=True), db.Column('genre_id', db.Integer, db.ForeignKey('genre.id'), primary_key=True))  


class Actor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    films = relationship('Film', secondary=film_actor, back_populates='actors')
    def to_json(self):
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "age": self.age,
        }


class Director(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    nationality = db.Column(db.String(100), nullable=False)
    films = relationship('Film', back_populates='director')
    def to_json(self):
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "nationality": self.nationality
        }


class Film(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    year = db.Column(db.String(100), nullable=False)
    director = relationship('Director', back_populates='films')
    director_id = db.Column(db.Integer, db.ForeignKey("director.id"), nullable=False)
    actors = relationship('Actor', secondary=film_actor, back_populates='films')
    genres = relationship('Genre', secondary=film_genre, back_populates='films')
    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "year": self.year,
            "directorId": self.director_id,
            "actors": [actor.to_json() for actor in self.actors],
            "genres": [genre.tojson() for genre in self.genres]
        }


class Genre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    films = relationship('Film', secondary=film_genre, back_populates='genres')
    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
        }
    


    
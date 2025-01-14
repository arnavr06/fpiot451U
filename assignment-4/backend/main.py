from flask import request, jsonify
from config import app, db
from models import Actor, Director, Film, Genre, film_actor

# Route for genres, not that they are only fetched and cannot be created or modified
@app.route("/genres", methods=["GET"])
def get_genres():
    genres = Genre.query.all()
    json_genres = list(map(lambda x: x.to_json(), genres))
    return jsonify({"genres": json_genres})


# Below are the routes for creating, reading, updating and deleting actors
@app.route("/actors", methods=["GET"])
def get_actors():
    actors = Actor.query.all()
    json_actors = list(map(lambda x: x.to_json(), actors))
    return jsonify({"actors": json_actors})

@app.route("/create_actor", methods=["POST"])
def create_actor():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    age = request.json.get("age")
    if not first_name or not last_name or not age:
        return jsonify({"message": "Please fill out all fields"}), 400
    new_actor = Actor(first_name=first_name, last_name=last_name, age=age)
    try:
        db.session.add(new_actor)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    return jsonify({"message": "Successfully created actor"}), 201

@app.route("/update_actor/<int:actor_id>", methods=["PATCH"])
def update_actor(actor_id):
    actor = Actor.query.get(actor_id)
    if not actor:
        return jsonify({"message": "Actor not found"}), 404
    data = request.json
    actor.first_name = data.get("firstName", actor.first_name)
    actor.last_name = data.get("lastName", actor.last_name)
    actor.age = data.get("age", actor.age)
    db.session.commit()
    return jsonify({"message": "Successfully updated actor"}), 200

@app.route("/delete_actor/<int:actor_id>", methods=["DELETE"])
def delete_actor(actor_id):
    actor = Actor.query.get(actor_id)

    if not actor:
        return jsonify({"message": "Actor not found"}), 404
    db.session.delete(actor)
    db.session.commit()
    return jsonify({"message": "Successfully deleted actor"}), 200


# Routes for creating, reading, deleting and updating directors 
@app.route("/directors", methods=["GET"])
def get_directors():
    directors = Director.query.all()
    json_directors = list(map(lambda x: x.to_json(), directors))
    return jsonify({"directors": json_directors})

@app.route("/create_director", methods=["POST"])
def create_director():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    nationality = request.json.get("nationality")
    if not first_name or not last_name or not nationality:
        return jsonify({"message": "Please fill out all fields"}), 400
    new_director = Director(first_name=first_name, last_name=last_name, nationality=nationality)
    try:
        db.session.add(new_director)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    return jsonify({"message": "Successfully created director"}), 201

@app.route("/update_director/<int:director_id>", methods=["PATCH"])
def update_director(director_id):
    director = Director.query.get(director_id)
    if not director:
        return jsonify({"message": "Director not found"}), 404
    data = request.json
    director.first_name = data.get("firstName", director.first_name)
    director.last_name = data.get("lastName", director.last_name)
    director.nationality = data.get("nationality", director.nationality)
    db.session.commit()
    return jsonify({"message": "Successfully updated director"}), 200

@app.route("/delete_director/<int:director_id>", methods=["DELETE"])
def delete_director(director_id):
    director = Director.query.get(director_id)
    if not director:
        return jsonify({"message": "Director not found"}), 404
    db.session.delete(director)
    db.session.commit()
    return jsonify({"message": "Successfully deleted director"}), 200


# Routes for creating, reading, updating and deleting films
@app.route("/films", methods=["GET"])
def get_films():
    films = Film.query.all()
    actors = Actor.query.all()
    genres = Genre.query.all()
    json_films = []
    for film in films:
        film_info = film.to_json()
        json_films.append(film_info)
    return jsonify({"films": json_films})

@app.route("/create_film", methods=["POST"])
def create_film():
    name = request.json.get("name")
    year = request.json.get("year")
    director_id = request.json.get("directorId")
    genre_id = request.json.get("genreId")
    if not name or not year or not director_id or not genre_id:
        return jsonify({"message": "Please fill out all fields"}), 400
    director = Director.query.get(director_id)
    genre = Genre.query.get(genre_id)
    if not director:
        return jsonify({"message": "Director not found"}), 404
    if not genre:
        return jsonify({"message": "Genre not found"}), 404
    new_film = Film(name=name, year=year, director_id=director_id, genre_id=genre_id)
    try:
        db.session.add(new_film)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    return jsonify({"message": "Successfully created film"}), 201

@app.route("/update_film/<int:film_id>", methods=["PATCH"])
def update_fim(film_id):
    film = Film.query.get(film_id)
    if not film:
        return jsonify({"message": "Film not found"}), 404
    data = request.json
    film.name = data.get("name", film.name)
    film.year = data.get("year", film.year)
    film.director_id = data.get("directorId", film.director_id)
    film.genre_id = data.get("genreId", film.genre_id)
    db.session.commit()
    return jsonify({"message": "Successfully updated film"}), 200

@app.route("/delete_film/<int:film_id>", methods=["DELETE"])
def delete_film(film_id):
    film = Film.query.get(film_id)

    if not film:
        return jsonify({"message": "Film not found"}), 404
    db.session.delete(film)
    db.session.commit()
    return jsonify({"message": "Successfully deleted film"}), 200


# Routes for creating, reading, updating and deleting relationships between films and actors
@app.route("/film-actors", methods=["GET"])
def get_film_actors():
    film_actors = db.session.query(
        film_actor.c.film_id,
        Film.name.label('film_name'),
        film_actor.c.actor_id,
        Actor.first_name.label('actor_first_name'),
        Actor.last_name.label('actor_last_name')
    ).join(Film, Film.id == film_actor.c.film_id).join(Actor, Actor.id == film_actor.c.actor_id).all()

    json_film_actors = [
        {
            'film_id': film_actor.film_id,
            'film_name': film_actor.film_name,
            'actor_id': film_actor.actor_id,
            'actor_first_name': film_actor.actor_first_name,
            'actor_last_name': film_actor.actor_last_name
        }
        for film_actor in film_actors
    ]
    return jsonify({"film_actors": json_film_actors})

@app.route("/add_film_actor", methods=["POST"])
def add_film_actor():
    film_id = request.json.get("film_id")
    actor_id = request.json.get("actor_id")
    if not film_id or not actor_id:
        return jsonify({"message": "Please provide both film_id and actor_id"}), 400
    film = Film.query.get(film_id)
    actor = Actor.query.get(actor_id)
    if not film or not actor:
        return jsonify({"message": "Film or Actor not found"}), 404
    film.actors.append(actor)
    db.session.commit()
    return jsonify({"message": "Successfully added film-actor relationship"}), 201

@app.route("/update_film_actor/<int:film_id>/<int:actor_id>", methods=["PATCH"])
def update_film_actor(film_id, actor_id):
    new_film_id = request.json.get("film_id")
    new_actor_id = request.json.get("actor_id")
    if not new_film_id or not new_actor_id:
        return jsonify({"message": "Please provide both new film_id and new actor_id"}), 400
    film = Film.query.get(film_id)
    actor = Actor.query.get(actor_id)
    new_film = Film.query.get(new_film_id)
    new_actor = Actor.query.get(new_actor_id)
    if not film or not actor or not new_film or not new_actor:
        return jsonify({"message": "Film or Actor not found"}), 404
    film.actors.remove(actor)
    new_film.actors.append(new_actor)
    db.session.commit()
    return jsonify({"message": "Successfully updated film-actor relationship"}), 200

@app.route("/delete_film_actor/<int:film_id>/<int:actor_id>", methods=["DELETE"])
def delete_film_actor(film_id, actor_id):
    film = Film.query.get(film_id)
    actor = Actor.query.get(actor_id)
    if not film or not actor:
        return jsonify({"message": "Film or Actor not found"}), 404
    film.actors.remove(actor)
    db.session.commit()
    return jsonify({"message": "Successfully deleted film-actor relationship"}), 200


# Main method to create the database and run the backend component of the app
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
from flask import request, jsonify
from config import app, db
from models import Actor, Director, Film, Genre, film_actor

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


@app.route("/films", methods=["GET"])
def get_films():
    films = Film.query.all()
    actors = Actor.query.all()
    genres = Genre.query.all()
    json_films = []
    for film in films:
        film_info = film.to_json()
        json_films.append(film_info)
    # for film in films:
    #     film_info = film.to_json()
    #     print(f"Film: {film_info}")
    #     for actor in film.actors:
    #         film_info['actorId'] = actor.id
    #         film_info['actorFullName'] = f"{actor.first_name} {actor.last_name}"
    #         json_films.append(film_info.copy()) # Used copy here to ensure that each element in json_films is independent of each other
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

@app.route("/film-actors", methods=["GET"])
def get_film_actors():
    film_id = Film.id.label('film_id')
    film_name = Film.name.label('film_name')
    actor_id = Actor.id.label('actor_id')
    actor_first_name = Actor.first_name.label('actor_first_name')
    actor_last_name = Actor.last_name.label('actor_last_name')

    film_actors = db.session.query(film_id, film_name, actor_id, actor_first_name, actor_last_name).select_from(film_actor).join(Film, film_actor.c.film_id == Film.id).join(Actor, film_actor.c.actor_id == Actor.id).all()
    json_film_actors = [{'film_id': x.film_id, 'film_name': x.film_name, 'actor_id': x.actor_id, 'actor_first_name': x.actor_name, 'actor_last_name': x.actor_last_name} for x in film_actors]
    return jsonify({"film_actors": json_film_actors})


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
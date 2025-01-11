from flask import request, jsonify
from config import app, db
from models import Actor

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


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
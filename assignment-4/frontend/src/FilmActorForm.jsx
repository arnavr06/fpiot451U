import React, { useState, useEffect } from 'react';

const FilmActorForm = ({ existingFilmActor = {}, fetchFilms, fetchActors, films, actors, updateCallback }) => {
    // The following constants are used to gather values from the existing film-actor relationship that you are updating
    const [filmId, setFilmId] = useState(existingFilmActor.film_id || '');
    const [actorId, setActorId] = useState(existingFilmActor.actor_id || '');

    useEffect(() => {
        fetchFilms();
        fetchActors();
    }, [fetchFilms, fetchActors]);

    const onSubmit = async (e) => {
        e.preventDefault();

        const data = {
            film_id: parseInt(filmId),
            actor_id: parseInt(actorId)
        };

        // The following constants determine which URL to use and which HTTP method to use
        const url = "http://127.0.0.1:5000/" + (existingFilmActor.film_id ? `update_film_actor/${existingFilmActor.film_id}/${existingFilmActor.actor_id}` : "add_film_actor");
        const options = {
            method: existingFilmActor.film_id ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        };

        try {
            const response = await fetch(url, options);
            if (response.status !== 201 && response.status !== 200) {
                const errorData = await response.json();
                alert(errorData.message);
            } else {
                console.log("Successfully added/updated film-actor relationship");
                updateCallback();
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            alert("Failed to fetch. Please check the server and try again.");
        }
    };


    // The following code displays the different options on the film-actor relationship update form
    return (
        <form onSubmit={onSubmit} className="form">
            <div className="form-group">
                <label htmlFor="filmId">Film ID:</label>
                <select 
                    id="filmId" 
                    value={filmId} 
                    onChange={(e) => setFilmId(e.target.value)}
                    required
                >
                    <option value="">Select Film</option>
                    {films.map((film) => (
                        <option key={film.id} value={film.id}>
                            {film.id} - {film.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="actorId">Actor ID:</label>
                <select 
                    id="actorId" 
                    value={actorId} 
                    onChange={(e) => setActorId(e.target.value)}
                    required
                >
                    <option value="">Select Actor</option>
                    {actors.map((actor) => (
                        <option key={actor.id} value={actor.id}>
                            {actor.id} - {actor.firstName} {actor.lastName}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">{existingFilmActor.film_id ? "Update" : "Add"} Relationship</button>
        </form>
    );
};

export default FilmActorForm;
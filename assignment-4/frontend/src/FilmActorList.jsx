import React, { useState, useEffect } from 'react';

const FilmActorList = ({ updateFilmActor, openCreateModal}) => {
    
    const [filmActors, setFilmActors] = useState([]);


    useEffect(() => {
        fetchFilmActors();
    }, []);


    // The following method fetches data from the film-actors endpoint that is handled by the backend
    const fetchFilmActors = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/film-actors");
            const data = await response.json();
            setFilmActors(data.film_actors);
        } catch (error) {
            console.error("Error fetching film-actor relationships:", error);
            alert("Failed to fetch film-actor relationships. Please check the server and try again.");
        }
    };

    // The following method carries out the process of deleting an entry from the film-actor relationship list
    const onDelete = async (filmId, actorId) => {
        try {
            const options = {
                method: "DELETE"
            };
            const response = await fetch(`http://127.0.0.1:5000/delete_film_actor/${filmId}/${actorId}`, options);
            if (response.status === 200) {
                fetchFilmActors();
            } else {
                console.error("Failed to delete");
            }
        } catch (error) {
            alert(error);
        }
    };


    // The following code sets up the layout of the film-actor relationships table and includes buttons to modify data
    return (
        <div>
            <h1>Film-Actor Relationships</h1>
            <br></br>
            <h4>Below is a list of film and actor relationships containing their unique IDs and names. You can create, edit and delete relationships but
                make sure to create the films and actors beforehand since you can only select from a drowpdown menu.
            </h4>
            <button onClick={openCreateModal}>Create New Relationship</button>
            <table>
                <thead>
                    <tr>
                        <th>Film ID</th>
                        <th>Film Name</th>
                        <th>Actor ID</th>
                        <th>Actor First Name</th>
                        <th>Actor Last Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filmActors.map((film_actor) => (
                        <tr key={`${film_actor.film_id}-${film_actor.actor_id}`}>
                            <td>{film_actor.film_id}</td>
                            <td>{film_actor.film_name}</td>
                            <td>{film_actor.actor_id}</td>
                            <td>{film_actor.actor_first_name}</td>
                            <td>{film_actor.actor_last_name}</td>
                            <td>
                                <button onClick={() => updateFilmActor(film_actor)}>Update</button>
                                <button onClick={() => onDelete(film_actor.film_id, film_actor.actor_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FilmActorList;
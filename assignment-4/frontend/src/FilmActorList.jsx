import React, { useState, useEffect } from 'react';

const FilmActorList = () => {
    const [filmActors, setFilmActors] = useState([]);

    useEffect(() => {
        fetchFilmActors();
    }, []);

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

    return (
        <div>
            <h2>Film-Actor Relationships</h2>
            <table>
                <thead>
                    <tr>
                        <th>Film ID</th>
                        <th>Film Name</th>
                        <th>Actor ID</th>
                        <th>Actor First Name</th>
                        <th>Actor Last Name</th>
                    </tr>
                </thead>
                <tbody>
                    {filmActors.map((x) => (
                        <tr key={`${x.film_id}-${x.actor_id}`}>
                            <td>{x.film_id}</td>
                            <td>{x.film_name}</td>
                            <td>{x.actor_id}</td>
                            <td>{x.actor_first_name}</td>
                            <td>{x.actor_last_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FilmActorList;
import React, { useState } from 'react';

const FilmList = ({ films, updateFilm, updateCallback, openCreateModal }) => {

    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            };
            const response = await fetch(`http://127.0.0.1:5000/delete_film/${id}`, options);
            if (response.status === 200) {
                updateCallback();
            } else {
                console.error("Failed to delete");
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div>
            <h1>Films</h1>
            <br></br>
            <h4>Below is a list of films, each assigned a unique ID upon creation. You can use this ID to create a relationship with an actor from the Actors List (if you have the Actor ID) in the Film-Actor Relationships table.</h4>
            <button onClick={openCreateModal}>Create New Film</button>
            <table>
                <thead>
                    <tr>
                        <th>Film ID</th>
                        <th>Name</th>
                        <th>Year</th>
                        <th>Director ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {films.map((film) => (
                        <tr key={film.id}>
                            <td>{film.id}</td>
                            <td>{film.name}</td>
                            <td>{film.year}</td>
                            <td>{film.directorId}</td>
                            <td>
                                <button onClick={() => updateFilm(film)}>Update</button>
                                <button onClick={() => onDelete(film.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FilmList;
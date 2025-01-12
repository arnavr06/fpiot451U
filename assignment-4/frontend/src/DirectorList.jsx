import React from 'react';

const DirectorList = ({ directors, updateDirector, updateCallback, openCreateModal }) => {
    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            };
            const response = await fetch(`http://127.0.0.1:5000/delete_director/${id}`, options);
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
            <h1>Directors</h1>
            <br></br>
            <h4>Below is a list of directors, each assigned a unique ID upon creation. 
                When adding a new director, you can link their uniquely assigned Director ID to a corresponding film in the Films List, which will then be dispalyed alongside the other film fields.</h4>
            <button onClick={openCreateModal}>Create New Director</button>
            <table>
                <thead>
                    <tr>
                        <th>Director ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Nationality</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {directors.map((director) => (
                        <tr key={director.id}>
                            <td>{director.id}</td>
                            <td>{director.firstName}</td>
                            <td>{director.lastName}</td>
                            <td>{director.nationality}</td>
                            <td>
                                <button onClick={() => updateDirector(director)}>Update</button>
                                <button onClick={() => onDelete(director.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DirectorList;
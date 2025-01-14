import React from "react"

const ActorList = ({actors, updateActor, updateCallback, openCreateModal}) => {

    // The following method carries out the process of deleting an entry from the actors list
    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_actor/${id}`, options)
            if (response.status == 200) {
                updateCallback()
            } else {
                console.error("Failed to delete")
            }
        } catch (error) {
            alert(error)
        }
    }

    // The following code sets up the layout of the actor table and includes buttons to modify data
    return <div>
        <h1>Actors</h1>
        <br></br>
        <h4>Below is a list of actors, each assigned a unique ID upon creation. You can use this ID to create a relationship with a film from the Films List (if you have the Film ID) in the Film-Actor Relationships table.</h4>
        <button onClick={openCreateModal}>Create New Actor</button>
        <table>
            <thead>
                <tr>
                    <th>Actor ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Age</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {actors.map((actor) => (
                    <tr key={actor.id}>
                        <td>{actor.id}</td>
                        <td>{actor.firstName}</td>
                        <td>{actor.lastName}</td>
                        <td>{actor.age}</td>
                        <td>
                            <button onClick={() => updateActor(actor)}>Update</button>
                            <button onClick={() => onDelete(actor.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

export default ActorList
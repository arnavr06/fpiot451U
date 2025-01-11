import React from "react"

const ActorList = ({actors, updateActor, updateCallback, openCreateModal}) => {
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
    return <div>
        <h2>Actors</h2>
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
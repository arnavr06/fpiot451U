import { useState } from "react"

const ActorForm = ({ existingActor = {}, updateCallback }) => {
    const [firstName, setFirstName] = useState(existingActor.firstName || "")
    const [lastName, setLastName] = useState(existingActor.lastName || "")
    const [age, setAge] = useState(existingActor.age || "")

    const updating = Object.entries(existingActor).length !== 0

    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            firstName,
            lastName,
            age
        };
        const url = "http://127.0.0.1:5000/" + (updating ? `update_actor/${existingActor.id}` : "create_actor")
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        };
        try {
            const response = await fetch(url, options);
            if (response.status !== 201 && response.status !== 200) {
                const data = await response.json()
                alert(data.message)
            } else {
                console.log("Successfully created actor");
                updateCallback()
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            alert("Failed to fetch. Please check the server and try again.")
        }
    };

    return(
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="firstName">First Name:</label>
                <input 
                    type="text" 
                    id="firstName" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="lastName">Last Name:</label>
                <input 
                    type="text" 
                    id="lastName" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="age">Age:</label>
                <input 
                    type="text" 
                    id="age" 
                    value={age} 
                    onChange={(e) => setAge(e.target.value)}
                />
            </div>
            <button type="submit">{updating ? "Update" : "Create"}</button>
        </form>
    );
};

export default ActorForm
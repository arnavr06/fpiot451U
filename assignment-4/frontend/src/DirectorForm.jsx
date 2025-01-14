import { useState } from "react";

const DirectorForm = ({ existingDirector = {}, updateCallback }) => {
    
    // The following constants are used to gather values from the existing director that you are updating
    const [firstName, setFirstName] = useState(existingDirector.firstName || "");
    const [lastName, setLastName] = useState(existingDirector.lastName || "");
    const [nationality, setNationality] = useState(existingDirector.nationality || "");


    const updating = Object.entries(existingDirector).length !== 0;


    const onSubmit = async (e) => {
        e.preventDefault();

        const data = {
            firstName,
            lastName,
            nationality
        };

        // The following constants determine which URL to use and which HTTP method to use
        const url = "http://127.0.0.1:5000/" + (updating ? `update_director/${existingDirector.id}` : "create_director");
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
                const data = await response.json();
                alert(data.message);
            } else {
                updateCallback();
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            alert("Failed to fetch. Please check the server and try again.");
        }
    };


    // The following code displays the different options on the director update form
    return (
        <form onSubmit={onSubmit} className="form">
            <div className="form-group">
                <label htmlFor="firstName">First Name:</label>
                <input 
                    type="text" 
                    id="firstName" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="lastName">Last Name:</label>
                <input 
                    type="text" 
                    id="lastName" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="nationality">Nationality:</label>
                <input 
                    type="text" 
                    id="nationality" 
                    value={nationality} 
                    onChange={(e) => setNationality(e.target.value)}
                    required
                />
            </div>
            <button type="submit">{updating ? "Update" : "Create"} Director</button>
        </form>
    );
};


export default DirectorForm;
import { useState, useEffect } from "react";

const FilmForm = ({ existingFilm = {}, updateCallback }) => {
    const [name, setName] = useState(existingFilm.name || "");
    const [year, setYear] = useState(existingFilm.year || "");
    const [directorId, setDirectorId] = useState(existingFilm.directorId || "");
    const [genreId, setGenreId] = useState(existingFilm.genreId || "");
    const [genres, setGenres] = useState([]);

    const updating = Object.entries(existingFilm).length !== 0;

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        const response = await fetch("http://127.0.0.1:5000/genres");
        const data = await response.json();
        setGenres(data.genres)
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const data = {
            name,
            year,
            directorId: parseInt(directorId),
            genreId: parseInt(genreId)
        };
        const url = "http://127.0.0.1:5000/" + (updating ? `update_film/${existingFilm.id}` : "create_film");
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
                console.log("Successfully created/updated film");
                updateCallback();
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            alert("Failed to fetch. Please check the server and try again.");
        }
    };

    return (
        <form onSubmit={onSubmit} className="form">
            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input 
                    type="text" 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="year">Year:</label>
                <input 
                    type="text" 
                    id="year" 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="directorId">Director ID:</label>
                <input 
                    type="number" 
                    id="directorId" 
                    value={directorId} 
                    onChange={(e) => setDirectorId(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="genreId">Genre:</label>
                <select
                    id="genreId"
                    value={genreId}
                    onChange={(e) => setGenreId(e.target.value)}
                    required
                >
                    <option value="">Select Genre</option>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                            {genre.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">{updating ? "Update" : "Create"} Film</button>
        </form>
    );
};

export default FilmForm;
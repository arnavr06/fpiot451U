import React, { useState, useEffect } from 'react';

const ViewGroupedFilms = () => {
    const [groupedFilms, setGroupedFilms] = useState({});
    const [groupBy, setGroupBy] = useState("none");

    useEffect(() => {
        fetchGroupedFilms();
    }, [groupBy]);

    const fetchGroupedFilms = async () => {
        let url = "http://127.0.0.1:5000/films";
        if (groupBy !== "none") {
            url = url + `group_by=${groupBy}`
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            setGroupedFilms(data);
        } catch (error) {
            console.error("Error fetching films:", error);
            alert("Failed to fetch films")
        }
    };
}
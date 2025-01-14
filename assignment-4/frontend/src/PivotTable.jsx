import React, { useState, useEffect } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';

const PlotlyRenderers = createPlotlyRenderers(Plot);

// The following constant utilises the fetchActors and fetchFilms methods from App.jsx to fetch data about the two classes
const PivotTable = ({fetchFilms, films, fetchActors, actors}) => {
    const [pivotState, setPivotState] = useState([]);

    useEffect(() => {
        fetchFilms();
        fetchActors();
    }, [fetchFilms, fetchActors]);


    // The following code displays the pivot table and sets up its columns
    return (
        <div>
            <h1>Pivot Table</h1>
            <br></br>
            <h4>View and visualise data with charts and graphs, sorting by specified filters.</h4>
            <PivotTableUI
                data={films}
                onChange={s => setPivotState(s)}
                renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                {...pivotState}
            />
        </div>
    );
};

export default PivotTable;
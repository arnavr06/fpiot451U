import React, { useState, useEffect } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';

const PlotlyRenderers = createPlotlyRenderers(Plot);

const PivotTable = ({fetchFilms, films, fetchActors, actors}) => {
    const [pivotState, setPivotState] = useState([]);

    useEffect(() => {
        fetchFilms();
    }, [fetchFilms]);

    return (
        <div>
            <h1>Pivot Table</h1>
            <PivotTableUI
                data={films}
                onChange={s => setPivotState(s)}
                renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                {...pivotState}
            />
            <div>
                <label htmlFor="actorId">Select Actor ID:</label>
                <select id="actorId">
                    <option value="">Select Actor</option>
                    {actors.map((actor) => (
                        <option key={actor.id} value={actor.id}>
                            {actor.id} - {actor.firstName} {actor.lastName}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default PivotTable;
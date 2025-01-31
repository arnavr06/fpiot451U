
import { useState, useEffect } from 'react'
import ActorList from './ActorList'
import DirectorList from './DirectorList'
import FilmList from './FilmList'
import FilmActorList from './FilmActorList'
import FilmActorForm from './FilmActorForm'
import './App.css'
import ActorForm from "./ActorForm"
import DirectorForm from "./DirectorForm"
import FilmForm from './FilmForm'
import PivotTable from './PivotTable'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  const [actors, setActors] = useState([])
  const [films, setFilms] = useState([])
  const [directors, setDirectors] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentEntity, setCurrentEntity] = useState({})
  const [entityType, setEntityType] = useState("")


  useEffect(() => {
    fetchActors();
    fetchDirectors();
    fetchFilms();
  }, []);


  // The following constants define the method to fetch information for each class
  const fetchActors = async () => {
    const response = await fetch("http://127.0.0.1:5000/actors");
    const data = await response.json();
    setActors(data.actors);
  };


  const fetchFilms = async () => {
    const response = await fetch("http://127.0.0.1:5000/films");
    const data = await response.json();
    console.log("Films:", data.films);
    setFilms(data.films);
  };


  const fetchDirectors = async () => {
    const response = await fetch("http://127.0.0.1:5000/directors");
    const data = await response.json();
    setDirectors(data.directors);
  };


  // Constant to close the form for creating/updating
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEntity({});
    setEntityType("");
  };


  // Constants to open the window for creating/updating an entity
  const openCreateModal = (type) => {
    if (!isModalOpen) {
      setEntityType(type);
      setIsModalOpen(true);
    }
  };


  const openEditModal = (entity, type) => {
    if (isModalOpen) return
    setCurrentEntity(entity);
    setEntityType(type);
    setIsModalOpen(true);
  };


// Constant which determmines what to do when an entity has been updated
  const onUpdate = () => {
    closeModal();
    fetchActors();
    fetchDirectors();
    fetchFilms();
  }


  // The following code sets up the static navigation bar at the top of the screen
  return (
    <Router>
      <div>
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/actors">Actors List</Link>
            </li>
            <li>
              <Link to="/directors">Directors List</Link>
            </li>
            <li>
              <Link to="/films">Films List</Link>
            </li>
            <li>
              <Link to="/film-actors">Film-Actor Relationships</Link>
            </li>
            <li>
              <Link to="/pivot">Pivot Table</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/actors" element={<ActorList actors={actors} updateActor={(actor) => openEditModal(actor, "actor")} updateCallback={onUpdate} openCreateModal={() => openCreateModal("actor")}/>} />
          <Route path="/directors" element={<DirectorList directors={directors} updateDirector={(director) => openEditModal(director, "director")} updateCallback={onUpdate} openCreateModal={() => openCreateModal("director")}/>} />
          <Route path="/films" element={<FilmList films={films} updateFilm={(film) => openEditModal(film, "film")} updateCallback={onUpdate} openCreateModal={() => openCreateModal("film")}/>} />
          <Route path="/film-actors" element={<FilmActorList updateFilmActor={(filmActor) => openEditModal(filmActor, "filmActor")} openCreateModal={() => openCreateModal("filmActor")} />} />          <Route path="/pivot" element={<PivotTable fetchFilms={fetchFilms} films={films} fetchActors={fetchActors}/>} />
        </Routes>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              {entityType === "actor" && <ActorForm existingActor={currentEntity} updateCallback={onUpdate} />}
              {entityType === "director" && <DirectorForm existingDirector={currentEntity} updateCallback={onUpdate} />}
              {entityType === "film" && <FilmForm existingFilm={currentEntity} updateCallback={onUpdate} />}
              {entityType === "filmActor" && <FilmActorForm existingFilmActor={currentEntity} fetchFilms={fetchFilms} fetchActors={fetchActors} films={films} actors={actors} updateCallback={onUpdate} />}
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}


// The following code sets up the Home page
const Home = () => (
  <div>
    <h1>Home</h1>
    <br></br>
    <h2>About</h2>
    <h4>This website was deisgned to be used as a collection manager to store information about films, actors, genres and directors.</h4>
    <h4>It is important to remember to assign relationships when creating new entries to tables in order to visualise data.</h4>
    <br></br>
    <h2>Useful Links</h2>
    <h4>
      <Link to="/actors">Go to Actors List</Link> - a table displaying information about actors
    </h4>
    <p>View, create, edit and delete from a list of actors assigned by a unique Actor ID.</p>
    <br></br>
    <h4>
      <Link to="/directors">Go to Directors List</Link> - a table displaying information about directors
    </h4>
    <p>View, create, edit and delete from a list of directors assigned by a unique Director ID.</p>
    <br></br>
    <h4>
      <Link to="/films">Go to Films List</Link> - a table displaying information about films
    </h4>
    <p>View, create, edit and delete from a list of films assigned by a unique Film ID.</p>
    <br></br>
    <h4>
      <Link to="/film-actors">Go to Film-Actor Relationships</Link> - a table to view and create film-actor relationships
    </h4>
    <p>View, create, edit and delete relationships between films and actors based on their corresponding IDs.</p>
    <br></br>
    <h4>
      <Link to="/pivot">Go to Pivot Table</Link> - a pivot table to view and visualise data
    </h4>
    <p>View and visualise data with charts and graphs, sorting by specified filters.</p>
  </div>
);

export default App;

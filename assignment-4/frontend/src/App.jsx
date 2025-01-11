
import { useState, useEffect } from 'react'
import ActorList from './ActorList'
import './App.css'
import ActorForm from "./ActorForm"
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  const [actors, setActors] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentActor, setCurrentActor] = useState({})

  useEffect(() => {
    fetchActors();
  }, []);

  const fetchActors = async () => {
    const response = await fetch("http://127.0.0.1:5000/actors");
    const data = await response.json();
    setActors(data.actors);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentActor({});
  };

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true);
  };

  const openEditModal = (actor) => {
    if (isModalOpen) return
    setCurrentActor(actor);
    setIsModalOpen(true);
  };

  const onUpdate = () => {
    closeModal();
    fetchActors();
  }

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/actors">Actors List</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home openCreateModal={openCreateModal}/>} />
          <Route path="/actors" element={<ActorList actors={actors} updateActor={openEditModal} updateCallback={onUpdate} openCreateModal={openCreateModal}/>} />
        </Routes>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <ActorForm existingActor={currentActor} updateCallback={onUpdate} />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

const Home = () => (
  <div>
    <h2>Welcome to the Homepage</h2>
    <p>
      <Link to="/actors">Go to Actors List</Link>
    </p>
  </div>
);

export default App

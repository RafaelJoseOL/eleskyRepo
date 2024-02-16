import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Home } from "./pages/frontPage/index";
import { NewSong } from "./pages/newSong/index";
import { Playlist } from "./pages/playlist/index";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { SocialIcon } from 'react-social-icons'
import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from "./config/firebase-config";

function App() {
  const [listOfSongs, setListOfSongs] = useState([]);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const q = query(collection(db, "songs"));
                const querySnapshot = await getDocs(q);
                const songsData = querySnapshot.docs.map((doc) => {
                    return {
                        song_id: doc.data().song_id,
                        song_name: doc.data().song_name,
                        song_tags: doc.data().song_tags,
                        song_file: doc.data().song_file
                    };
                });
                setListOfSongs(songsData);
            } catch (error) {
                console.error('Error al obtener las canciones:', error);
            }
        };
        fetchSongs();
    }, []);

  return (
    <div className="App">
      <Router>
        <div className='mainContainer'>
          <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
            <div className="container-fluid">
              <Link to="/" className="navbar-brand ms-4 straru-navBar">Elesky</Link>
              <button className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse navbar-custom" id="navbarSupportedContent">
                <div className='mb-2 mb-lg-0 ms-4'>
                  <Link to="/NewSong" className="navbar-brand ms-4">Añadir canción</Link>
                  <Link to="/Playlist" className="navbar-brand ms-4">Playlist</Link>
                </div>
              </div>
            </div>
          </nav>
          <Routes>
            <Route path="/" exact element={<Home listOfSongs={listOfSongs} />} />
            <Route path="/NewSong" exact element={<NewSong listOfSongs={listOfSongs} />} />
            <Route path="/Playlist" exact element={<Playlist listOfSongs={listOfSongs} />} />
          </Routes>
          <footer className="text-center text-white myFooter">
            <div className="container p-3 col-12 col-md-3">
              <section className="my-auto row">
                <div className='linktr col-3'>
                  <a href="https://linktr.ee/elesky" target="_blank" rel="noreferrer noopener">
                    <img
                      src="https://ugc.production.linktr.ee/q7EqoRRTuJ7OvFlR0sgn_jz6yd4g28P9oz64Q?io=true&size=avatar-v3_0"
                      alt="linktr"
                      className='img-fluid rounded-circle linktrIcon'
                    />
                  </a>
                  <div className="icon-subtext">Linktr</div>
                </div>                
                <div className='conciertos col-3'>
                  <a href="https://lnk.bio/Elesky" target="_blank" rel="noreferrer noopener">
                    <img
                      src="https://cdn2.lnk.bi/profilepics/-1615146_20231026757.jpg"
                      alt="linktr"
                      className='rounded-circle linktrIcon'
                    />
                  </a>
                  <div className="icon-subtext">Conciertos</div>
                </div>
                <div className='twitter col-3'>
                  <SocialIcon className="social-icon" url="https://twitter.com/elesky25" target="_blank" rel="noreferrer noopener" />
                  <div className="icon-subtext">Twitter</div>
                </div>
                <div className='instagram col-3'>
                  <SocialIcon className="mx-2 social-icon" url="https://www.instagram.com/elesky" target="_blank" rel="noreferrer noopener" />
                  <div className="icon-subtext">Instagram</div>
                </div>
              </section>
            </div>
          </footer>
        </div>
      </Router>
    </div>
  );
}

export default App;

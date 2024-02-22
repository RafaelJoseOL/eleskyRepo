import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Home } from "./pages/frontPage/index";
import { NewSong } from "./pages/newSong/index";
import { Playlist } from "./pages/playlist/index";
import { Error404 } from "./pages/error/Error404";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { SocialIcon } from 'react-social-icons'
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from "./config/firebase-config";
import {
  GoogleAuthProvider, getAuth, signInWithPopup, signOut,
  browserLocalPersistence, setPersistence, onAuthStateChanged
} from "firebase/auth";
import googleIcon from "./images/google.png";
import { useAddUser } from "./hooks/useAddUser";

import { Test } from "./pages/test";

function App() {
  const [listOfSongs, setListOfSongs] = useState([]);
  const [listOfTags, setListOfTags] = useState([]);
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userLikedSongs, setUserLikedSongs] = useState([]);
  const [userID, setUserID] = useState(0);
  const [volumen, setVolumen] = useState(50);
  const [loading, setLoading] = useState(true);
  const provider = new GoogleAuthProvider();
  const { addUser } = useAddUser();

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
      setLoading(false);
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const docRef = doc(db, "tags", "50tMAIpnUZiPQMXirgHN");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const tagsData = docSnap.data().tag_names.sort((a, b) => a.localeCompare(b));
          setListOfTags(tagsData);
        } else {
          console.log("No se encontró el documento");
        }
      } catch (error) {
        console.error('Error al obtener las etiquetas:', error);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLogged(true);
        setUserID(user.uid);
        await checkAdminStatus(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleVolumeChange = (event) => {
    const nuevoVolumen = event.target.value;
    setVolumen(nuevoVolumen);
  };

  const checkAdminStatus = async (email) => {
    try {
      const adminsRef = collection(db, "admins");
      const q = query(adminsRef, where("email", "==", email.toString()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error al verificar el estado del administrador:', error);
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const auth = getAuth();
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUserID(user.uid);

      const userRef = collection(db, "users");
      const q = query(userRef, where("user_id", "==", user.uid.toString()));

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        console.log("Existe")
      } else {
        try {
          addUser({ user_id: user.uid });
          console.log("Usuario añadido");
        } catch (error) {
          console.error('Error al añadir usuario:', error);
        }
      }

      console.log("Inicio de sesión exitoso:", user);
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setIsAdmin(false);
      setIsLogged(false);
    } catch (error) {
      console.error("Error al cerrar la sesión:", error);
    }
  };

  return (
    <div className="App">
      <Router>
        <div className='mainContainer'>
          <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
            <div className="container-fluid">
              <Link to="/" className="navbar-brand ms-4">Inicio</Link>
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
                <div className='row'>
                  <div className='col-12 col-lg-4'>
                    <Link to="/Playlist" className="navbar-brand ms-4">Playlist</Link>
                  </div>
                  {isAdmin && (
                    <div className='col-12 col-lg-4'>
                      <Link to="/NewSong" className="navbar-brand ms-4">Añadir canción</Link>
                    </div>
                  )}
                </div>
                <div className='col-12 col-lg-4'>
                  <label className='navbar-brand ms-4'>Volumen global: </label>
                  <input type="range" min="0" max="100" value={volumen} onChange={handleVolumeChange} className='volumeSlider' />
                </div>
                <div className="ms-auto mb-2">
                  {!isLogged ? (
                    <button className="navbar-brand ms-4 log-btn" onClick={handleGoogleLogin}>
                      <img src={googleIcon} className='log-img me-3' />
                      <span>Login</span>
                    </button>
                  ) : (
                    <button className="navbar-brand ms-4 log-btn" onClick={handleGoogleLogout}>
                      <img src={googleIcon} className='log-img me-3' />
                      <span>Logout</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/" exact element={<Home listOfSongs={listOfSongs} isLogged={isLogged} userID={userID}
              userLikedSongs={userLikedSongs} setUserLikedSongs={setUserLikedSongs} volumen={volumen}
              loading={loading} listOfTags={listOfTags} />} />
            <Route path="/NewSong" exact element={<NewSong listOfSongs={listOfSongs} listOfTags={listOfTags} />} />
            <Route path="/Playlist" exact element={<Playlist listOfSongs={listOfSongs} isLogged={isLogged}
              userLikedSongs={userLikedSongs} setUserLikedSongs={setUserLikedSongs} volumen={volumen}
              listOfTags={listOfTags} />} />
            <Route path="/Test" exact element={<Test />} />
            <Route path="/*" exact element={<Error404 />} />
          </Routes>
          <footer className="text-center text-white myFooter">
            <div className="container p-3 col-12 col-xl-3">
              <section className="my-auto row">
                <div className='linktr col-3'>
                  <a href="https://linktr.ee/elesky" target="_blank" rel="noreferrer noopener">
                    <img
                      src="https://ugc.production.linktr.ee/q7EqoRRTuJ7OvFlR0sgn_jz6yd4g28P9oz64Q?io=true&size=avatar-v3_0"
                      alt="linktr"
                      className='img-fluid rounded-circle linktrIcon'
                    />
                  </a>
                  <div className="icon-subtext">Enlaces</div>
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

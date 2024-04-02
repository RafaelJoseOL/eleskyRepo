import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Home } from "./pages/frontPage/home";
import { NewSong } from "./pages/newSong/newSong";
import { Playlists } from "./pages/playlist/playlists";
import { MyPlaylists } from "./pages/playlist/myPlaylists";
import { Login } from "./pages/login/login";
import { Videos } from "./pages/videos/videos";
import { Album } from "./pages/album/album";
import { Error404 } from "./pages/error/error404";
import { useAddUser } from "./hooks/useAddUser";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { SocialIcon } from 'react-social-icons'
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, analytics } from "./config/firebase-config";
import {
  GoogleAuthProvider, getAuth, signInWithPopup, signOut, browserLocalPersistence, setPersistence, onAuthStateChanged
} from "firebase/auth";
import googleIcon from "./images/google.png";

function App() {
  const [listOfSongs, setListOfSongs] = useState([]);
  const defaultTags = ["Piano", "Flauta", "Guitarra", "Ukelele", "Voz", "Oído", "Concierto", "Mashups", "Medleys", "Memes"];
  const listOfTags = ["Animación", "Cantantes", "Clásica", "Películas", "Series", "Videojuegos"];
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userLikedSongs, setUserLikedSongs] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [userPlaylistsCount, setUserPlaylistsCount] = useState(0);
  const [userID, setUserID] = useState(0);
  const [volumen, setVolumen] = useState(50);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const provider = new GoogleAuthProvider();
  const { addUser } = useAddUser();

  useEffect(() => {
    const fetchSongsIfNeeded = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "metadata", "songs");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const currentLastSongID = docSnap.data().lastSongID.toString();
          const cachedLastSongID = localStorage.getItem("lastSongID");

          if (currentLastSongID !== cachedLastSongID) {
            const q = query(collection(db, "songsDocs"));
            const querySnapshot = await getDocs(q);
            const songsData = querySnapshot.docs.map(doc => ({
              song_id: doc.data().song_id,
              song_name: doc.data().song_name,
              song_origin: doc.data().song_origin,
              song_tags: doc.data().song_tags,
              song_file: doc.data().song_file,
              song_lore: doc.data().song_lore,
              song_date: doc.data().createdAt
            }));

            setListOfSongs(songsData);
            localStorage.setItem("songsData", JSON.stringify(songsData));
            localStorage.setItem("lastSongID", currentLastSongID);
          } else {
            const cachedSongsData = JSON.parse(localStorage.getItem("songsData"));
            if (cachedSongsData) {
              setListOfSongs(cachedSongsData);
            }
          }
        }
      } catch (error) {
        console.error('Error al obtener las canciones:', error);
      }
      setLoading(false);
    };
    fetchSongsIfNeeded();
  }, []);

  useEffect(() => {
    const fetchUserLikedSongs = async () => {
      if (isLogged) {
        try {
          const docRef = doc(db, 'users', userID);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserLikedSongs(userData.user_likedSongs || []);
          }
        } catch (error) {
          console.error(
            'Error al obtener las canciones que le gustan al usuario:', error
          );
        }
      } else {
        setUserLikedSongs([]);
      }
    };
    fetchUserLikedSongs();
  }, [isLogged]);

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      if (isLogged) {
        try {
          const docRef = doc(db, 'usersPlaylists', userID);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserPlaylists(userData || []);
            setUserPlaylistsCount(Object.keys(userData).length);
          }
        } catch (error) {
          console.error(
            'Error al obtener las playlists del usuario:', error
          );
        }
      } else {
        setUserPlaylists([]);
      }
    };
    fetchUserPlaylists();
  }, [isLogged, refresh]);

  const refreshPlaylists = () => {
    setRefresh(!refresh);
  }

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
      console.error('Error al verificar el estado de admin:', error);
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
      setRedirect(true);
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
              <Link to="/" className="navbar-brand ms-3">Inicio</Link>
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
                  <div className='col-12 col-lg-3 ms-3'>
                    <Link to="/Playlists" className="navbar-brand">Playlists</Link>
                  </div>
                  {isLogged && (
                    <div className='col-12 col-lg-3 ms-3'>
                      <Link to="/MyPlaylists" className="navbar-brand">Mis Playlists</Link>
                    </div>
                  )}
                  {isAdmin && (
                    <div className='col-12 col-lg-2 ms-3'>
                      <Link to="/NewSong" className="navbar-brand">Añadir canción</Link>
                    </div>
                  )}
                </div>
                <div className='mx-lg-auto'>
                  <label className='navbar-brand ms-3 ms-lg-0'>Volumen global: </label>
                  <input type="range" min="0" max="100" value={volumen} onChange={handleVolumeChange} className='volumeSlider' />
                </div>
                <div className="ms-3 ms-lg-auto mb-2">
                  {!isLogged ? (
                    <button className="navbar-brand log-btn" onClick={handleGoogleLogin}>
                      <span>Login</span>
                      <img src={googleIcon} className='log-img ms-3' />
                    </button>
                    // <div className='col-12 col-lg-2 ms-3'>
                    //   <Link to="/Login" className="navbar-brand">Login</Link>
                    // </div>
                  ) : (
                    <button className="navbar-brand log-btn" onClick={handleGoogleLogout}>
                      <span>Logout</span>
                      <img src={googleIcon} className='log-img ms-3' />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/" exact element={<Home listOfSongs={listOfSongs} isLogged={isLogged} userID={userID}
              userLikedSongs={userLikedSongs} setUserLikedSongs={setUserLikedSongs} volumen={volumen}
              loading={loading} listOfTags={listOfTags} defaultTags={defaultTags} analytics={analytics} />} />
            <Route path="/NewSong" exact element={<NewSong listOfTags={listOfTags}
              isAdmin={isAdmin} defaultTags={defaultTags} />} />
            <Route path="/Playlists" exact element={<Playlists listOfSongs={listOfSongs} isLogged={isLogged}
              userLikedSongs={userLikedSongs} setUserLikedSongs={setUserLikedSongs} volumen={volumen}
              listOfTags={listOfTags} defaultTags={defaultTags} userPlaylists={userPlaylists} analytics={analytics} />} />
            <Route path="/MyPlaylists" exact element={<MyPlaylists listOfSongs={listOfSongs} isLogged={isLogged}
              db={db} userID={userID} userPlaylists={userPlaylists} userPlaylistsCount={userPlaylistsCount}
              refreshPlaylists={refreshPlaylists} />} />
            <Route path="/Login" exact element={<Login handleGoogleLogin={handleGoogleLogin} redirect={redirect} 
            isLogged={isLogged} />} />
            {/* <Route path="/Album" exact element={<Album isAdmin={isAdmin} />} />
            <Route path="/Videos" exact element={<Videos isAdmin={isAdmin} />} /> */}
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

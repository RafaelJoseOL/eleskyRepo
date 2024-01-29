import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Home } from "./pages/frontPage/index";
import { NewSong } from "./pages/newSong/index";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <div className='mainContainer'>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
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
                <div className="collapse navbar-collapse bg-dark" id="navbarSupportedContent">
                  <div className='mb-2 mb-lg-0 ms-4'>
                    <Link to="/NewSong" className="navbar-brand ms-4 straru-navBar">Añadir canción</Link>
                  </div>
                </div>
              </div>
            </nav>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/NewSong" exact element={<NewSong />} />
          </Routes>
          <footer className="bg-dark text-center text-white myFooter">
            <div className="container p-4 col-10 col-md-3">
              <section className="my-auto row">
              </section>
            </div>
          </footer>
        </div>
      </Router>
    </div>
  );
}

export default App;

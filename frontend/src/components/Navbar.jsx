import { Link } from "react-router-dom"
import "../styles/Navbar.css"
import logo from "../assets/logo-cse-cnss-2026.png";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo CȘE CNSS" />

          <div className="logo-text">
            <span>Consiliul Școlar</span>
            <small>al Elevilor</small>
            <span>Colegiul Național "Sfântul Sava"</span>
          </div>
        </Link>

        <nav className="navbar-links">
          <Link to="/">Acasă</Link>
          <Link to="/echipa">Echipa Noastră</Link>
          <Link to="/stiri">Știri</Link>
          <Link to="/cluburi">Cluburi</Link>
          <Link to="/galerie">Galerie</Link>
          <Link to="/contact">Contact</Link>
          <a
            href="https://teamup.com/ksbw97yaj1zrkced2r"
            target="_blank"
            rel="noopener noreferrer"
            >
                Program activități CNSS
        </a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
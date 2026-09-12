import { Link } from "react-router-dom";
import logo from "../assets/logo-cse-cnss-2026.png";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-main">

          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logo} alt="Logo CȘE CNSS" />

              <div>
                <strong>Consiliul Școlar al Elevilor</strong>
                <span>Colegiul Național „Sfântul Sava”</span>
              </div>
            </div>

            <p>
              Vocea elevilor. Idei care devin proiecte.
              O comunitate construită împreună.
            </p>
          </div>

          <div className="footer-column">
            <h3>Navigare</h3>

            <Link to="/">Acasă</Link>
            <Link to="/echipa">Echipa Noastră</Link>
            <Link to="/stiri">Știri</Link>
            <Link to="/galerie">Galerie</Link>
          </div>

          <div className="footer-column">
            <h3>Comunitate</h3>

            <Link to="/cluburi">Cluburile liceului</Link>
            <Link to="/contact">Contact</Link>

            <a
              href="https://teamup.com/ksbw97yaj1zrkced2r"
              target="_blank"
              rel="noopener noreferrer"
            >
              Program activități
            </a>
          </div>

          <div className="footer-cta">
            <span>AI O IDEE?</span>

            <h3>Hai să o transformăm în realitate.</h3>

            <Link to="/contact">
              Vorbește cu noi →
            </Link>
          </div>

        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Consiliul Școlar al Elevilor CNSS
          </p>

          <p>
            Făcut cu 💛 pentru comunitatea savistă!
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
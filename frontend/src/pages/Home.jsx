import { Link } from "react-router-dom";
import "../styles/Home.css";

import boardRestrans from "../assets/board-restrans.png";

function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              Vocea elevilor contează! <span>💛</span>
            </div>

            <h1 className="hero-title">
              Împreună facem
              <br />
              liceul
            </h1>

            <div
              className="collage-title"
              aria-label="mai bun"
            >
              <div className="collage-word">
                <span className="collage-letter letter-m">M</span>
                <span className="collage-letter letter-a">A</span>
                <span className="collage-letter letter-i">I</span>
              </div>

              <div className="collage-word">
                <span className="collage-letter letter-b">B</span>
                <span className="collage-letter letter-u">U</span>
                <span className="collage-letter letter-n">N</span>
                <span className="collage-period">.</span>
              </div>
            </div>

            <p className="hero-description">
              Consiliul Școlar al Elevilor reprezintă vocea elevilor și
              transformă ideile în proiecte. Împreună construim o comunitate
              mai activă, deschisă și implicată.
            </p>

            <div className="hero-actions">
              <Link to="/cluburi" className="primary-button">
                Descoperă cluburile
              </Link>

              <Link to="/echipa" className="secondary-button">
                Cunoaște echipa
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-blue-shape" />


            <img
              src={boardRestrans}
              alt="Board-ul Consiliului Școlar al Elevilor"
              className="hero-board"
            />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-label">
            DESPRE NOI
          </div>

          <div className="about-grid">
            <div className="about-heading">
              <h2>
                Elevi pentru <span>elevi.</span>
              </h2>
            </div>

            <div className="about-content">
              <p>
                Consiliul Școlar al Elevilor din Colegiul Național
                „Sfântul Sava” este structura dedicată reprezentării și
                susținerii drepturilor și intereselor elevilor din cadrul
                liceului.
              </p>

              <p>
                Ne asigurăm că vocea fiecărui elev este auzită în fața
                conducerii școlii și a autorităților educaționale. Colaborăm
                activ cu toți elevii pentru a identifica și adresa problemele
                care îi afectează, promovând un mediu educațional mai echitabil
                și mai accesibil.
              </p>

              <Link to="/echipa" className="about-link">
                Află mai multe despre noi <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="activities-section">
        <div className="activities-container">
          <div className="activities-header">
            <div>
              <div className="section-label">CE FACEM</div>

              <h2>
                Mai mult decât un <span>consiliu.</span>
              </h2>
            </div>

            <p>
              Reprezentăm elevii, susținem inițiativele lor și creăm
              oportunități prin care fiecare poate contribui la comunitatea
              liceului.
            </p>
          </div>

          <div className="activities-grid">
            <article className="activity-card">
              <div className="activity-icon">💬</div>
              <span className="activity-number">01</span>

              <h3>Reprezentăm elevii</h3>

              <p>
                Ascultăm problemele, propunerile și ideile elevilor și le
                reprezentăm în relația cu liceul.
              </p>
            </article>

            <article className="activity-card">
              <div className="activity-icon">🎉</div>
              <span className="activity-number">02</span>

              <h3>Organizăm evenimente</h3>

              <p>
                Construim experiențe care aduc elevii împreună și fac viața
                de liceu mai interesantă.
              </p>
            </article>

            <article className="activity-card">
              <div className="activity-icon">💡</div>
              <span className="activity-number">03</span>

              <h3>Susținem inițiative</h3>

              <p>
                Ajutăm ideile elevilor să devină proiecte reale și încurajăm
                implicarea în comunitate.
              </p>
            </article>

            <article className="activity-card activity-card-highlight">
              <div className="activity-icon">🤝</div>
              <span className="activity-number">04</span>

              <h3>Construim comunitatea</h3>

              <p>
                Conectăm elevii prin cluburi, proiecte și activități în care
                fiecare își poate găsi locul.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
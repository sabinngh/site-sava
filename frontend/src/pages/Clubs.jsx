import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { API_URL } from "../config/api";

import "../styles/Clubs.css";


function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadClubs() {
      try {
        const response = await fetch(
          `${API_URL}/api/clubs`
        );

        if (!response.ok) {
          throw new Error(
            "Cluburile nu au putut fi încărcate."
          );
        }

        const data = await response.json();

        setClubs(data);

      } catch (error) {
        console.error(error);
        setError(error.message);

      } finally {
        setLoading(false);
      }
    }

    loadClubs();
  }, []);


  return (
    <main className="clubs-page">

      <section className="clubs-hero">

        <div className="clubs-container">

          <span className="clubs-eyebrow">
            CLUBURILE CȘE
          </span>

          <h1>
            Descoperă comunitățile
            <br />
            din liceul nostru
          </h1>

          <p>
            Explorează cluburile elevilor, descoperă
            activitățile lor și găsește comunitatea
            potrivită pentru tine.
          </p>

          <Link
            to="/cluburi/inscriere"
            className="club-registration-button"
          >
            Înscrie un club
            <span>→</span>
          </Link>

        </div>

      </section>


      <section className="clubs-content">

        <div className="clubs-container">

          <div className="clubs-content-header">

            <div>
              <span>COMUNITĂȚI</span>
              <h2>Cluburi active</h2>
            </div>

            <span className="public-clubs-count">
              {clubs.length}
              {clubs.length === 1
                ? " club"
                : " cluburi"}
            </span>

          </div>


          {loading && (
            <div className="clubs-loading">
              Se încarcă cluburile...
            </div>
          )}


          {error && (
            <div className="clubs-error">
              {error}
            </div>
          )}


          {!loading &&
            !error &&
            clubs.length === 0 && (

              <div className="clubs-public-empty">

                <h3>
                  Nu există cluburi publicate momentan.
                </h3>

                <p>
                  Cluburile aprobate de CȘE vor apărea aici.
                </p>

              </div>
            )}


          {!loading &&
            !error &&
            clubs.length > 0 && (

              <div className="clubs-public-grid">

                {clubs.map((club) => (

                  <Link
                    to={`/cluburi/${club.id}`}
                    className="public-club-card"
                    key={club.id}
                  >

                    <div className="public-club-image">

                      {club.cover_image_url ? (

                        <img
                          src={`${API_URL}${club.cover_image_url}`}
                          alt={club.name}
                        />

                      ) : (

                        <div className="public-club-placeholder">
                          CȘE
                        </div>

                      )}

                    </div>


                    <div className="public-club-content">

                      <span className="public-club-label">
                        CLUB
                      </span>

                      <h3>{club.name}</h3>

                      <p>
                        {club.short_description}
                      </p>


                      <div className="public-club-footer">

                        <span>
                          Președinte
                        </span>

                        <strong>
                          {club.president_name}
                        </strong>

                      </div>


                      <div className="public-club-open">
                        Descoperă clubul
                        <span>→</span>
                      </div>

                    </div>

                  </Link>

                ))}

              </div>
            )}

        </div>

      </section>

    </main>
  );
}


export default Clubs;
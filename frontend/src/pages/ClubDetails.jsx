import { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";


import { API_URL } from "../config/api";

import "../styles/ClubDetails.css";


function ClubDetails() {
  const { id } = useParams();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    async function loadClub() {
      try {
        const response = await fetch(
           `${API_URL}/api/clubs/${id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              "Clubul nu a fost găsit."
            );
          }

          throw new Error(
            "Clubul nu a putut fi încărcat."
          );
        }

        const data = await response.json();

        setClub(data);

      } catch (error) {
        console.error(error);
        setError(error.message);

      } finally {
        setLoading(false);
      }
    }

    loadClub();
  }, [id]);


  if (loading) {
    return (
      <main className="club-details-page">
        <div className="club-details-container">
          <div className="club-details-state">
            Se încarcă clubul...
          </div>
        </div>
      </main>
    );
  }


  if (error || !club) {
    return (
      <main className="club-details-page">

        <div className="club-details-container">

          <div className="club-details-state">

            <h1>Club indisponibil</h1>

            <p>
              {error ||
                "Clubul nu a putut fi găsit."}
            </p>

            <Link to="/cluburi">
              ← Înapoi la cluburi
            </Link>

          </div>

        </div>

      </main>
    );
  }


  return (
    <main className="club-details-page">

      <div className="club-details-container">

        <Link
          to="/cluburi"
          className="club-details-back"
        >
          ← Toate cluburile
        </Link>


        <section className="club-details-hero">

          <div className="club-details-hero-content">

            <span className="club-details-label">
              CLUB CNSS
            </span>

            <h1>{club.name}</h1>

            <p>
              {club.short_description}
            </p>

          </div>


          <div className="club-details-cover">

            {club.cover_image_url ? (

              <img
                src={`${API_URL}${club.cover_image_url}`}
                alt={club.name}
              />

            ) : (

              <div className="club-details-placeholder">
                CȘE
              </div>

            )}

          </div>

        </section>


        <section className="club-details-layout">

          <article className="club-description">

            <span className="section-label">
              DESPRE CLUB
            </span>

            <h2>
              Cine suntem?
            </h2>

            <p>
              {club.description}
            </p>

          </article>


          <aside className="club-information-card">

            <span className="section-label">
              INFORMAȚII
            </span>


            <div className="club-info-item">

              <span>Președinte</span>

              <strong>
                {club.president_name}
              </strong>

            </div>


            {club.contact_email && (

              <div className="club-info-item">

                <span>Email</span>

                <a
                  href={`mailto:${club.contact_email}`}
                >
                  {club.contact_email}
                </a>

              </div>

            )}


            {club.instagram && (

              <div className="club-info-item">

                <span>Instagram</span>

                <a
                  href={`https://instagram.com/${club.instagram.replace(
                    "@",
                    ""
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {club.instagram}
                </a>

              </div>

            )}

          </aside>

        </section>


        {club.images &&
          club.images.length > 0 && (

            <section className="club-gallery-section">

              <div className="club-gallery-header">

                <span className="section-label">
                  GALERIE
                </span>

                <h2>
                  Activitatea clubului
                </h2>

              </div>


              <div className="club-images-grid">

                {club.images.map((image) => (

                  <div
                    className="club-gallery-image"
                    key={image.id}
                  >

                    <img
                      src={`${API_URL}${image.image_url}`}
                      alt={
                        image.description ||
                        club.name
                      }
                    />

                    {image.description && (
                      <span>
                        {image.description}
                      </span>
                    )}

                  </div>

                ))}

              </div>

            </section>

          )}


        <section className="club-details-edit-section">
            <div className="club-details-edit-content">
                <span className="section-label">
                  REPREZINȚI ACEST CLUB?
                </span>

                <h2>
                  Informațiile s-au schimbat?
                </h2>

                <p>
                  Poți propune actualizarea informațiilor acestui club.
                  Modificările vor fi verificate de administrator înainte
                  de publicare.
                </p>
            </div>

            <button
                type="button"
                className="club-edit-button"
                onClick={() =>
                  navigate(`/cluburi/${club.id}/propune-modificari`)
                }
                >
                Propune modificări
                <span aria-hidden="true">→</span>
            </button>
        </section>

      </div>

    </main>
  );
}


export default ClubDetails;
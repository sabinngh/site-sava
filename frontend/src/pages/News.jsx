import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { API_URL } from "../config/api";

import "../styles/News.css";


function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadNews() {
      try {
        const response = await fetch(
           `${API_URL}/api/news`
        );

        if (!response.ok) {
          throw new Error(
            "Știrile nu au putut fi încărcate."
          );
        }

        const data = await response.json();

        setNews(data);

      } catch (error) {
        console.error(error);

        setError(
          "Nu am putut încărca știrile."
        );

      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);


  if (loading) {
    return (
      <main className="news-page">
        <p className="news-status">
          Se încarcă știrile...
        </p>
      </main>
    );
  }


  return (
    <main className="news-page">

      <section className="news-hero">

        <span>NOUTĂȚI</span>

        <h1>
          Ce se întâmplă în <strong>CȘE.</strong>
        </h1>

        <p>
          Descoperă proiectele, evenimentele și inițiativele
          comunității noastre.
        </p>

      </section>


      <section className="news-section">

        {error ? (
          <p className="news-status">
            {error}
          </p>

        ) : news.length === 0 ? (
          <div className="news-empty">
            <h2>Momentan nu există știri.</h2>

            <p>
              Revino în curând pentru noutăți.
            </p>
          </div>

        ) : (
          <div className="news-grid">

            {news.map((item) => (

              <article
                className="news-card"
                key={item.id}
              >

                {item.image_url ? (
                  <img
                    className="news-card-image"
                    src={`${API_URL}${item.image_url}`}
                    alt={item.title}
                  />
                ) : (
                  <div className="news-card-placeholder">
                    CȘE
                  </div>
                )}


                <div className="news-card-content">

                  <span className="news-card-date">
                    {new Date(
                      item.created_at
                    ).toLocaleDateString(
                      "ro-RO",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>


                  <h2>{item.title}</h2>


                  <p>
                    {item.content}
                  </p>


                  <Link
                    to={`/stiri/${item.id}`}
                    className="news-read-more"
                  >
                    Citește mai mult →
                  </Link>

                </div>

              </article>

            ))}

          </div>
        )}

      </section>

    </main>
  );
}


export default News;
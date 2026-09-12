import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { API_URL } from "../config/api";

import "../styles/NewsArticle.css";


function NewsArticle() {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadArticle() {
      try {
        const response = await fetch(
          `${API_URL}/api/news/${id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              "Știrea nu a fost găsită."
            );
          }

          throw new Error(
            "Știrea nu a putut fi încărcată."
          );
        }

        const data = await response.json();

        setArticle(data);

      } catch (error) {
        console.error(error);
        setError(error.message);

      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [id]);


  if (loading) {
    return (
      <main className="article-page">
        <div className="article-status">
          Se încarcă știrea...
        </div>
      </main>
    );
  }


  if (error || !article) {
    return (
      <main className="article-page">

        <div className="article-status">

          <h1>Știrea nu este disponibilă</h1>

          <p>
            {error}
          </p>

          <Link to="/stiri">
            ← Înapoi la știri
          </Link>

        </div>

      </main>
    );
  }


  return (
    <main className="article-page">

      <article className="article-container">

        <Link
          to="/stiri"
          className="article-back"
        >
          ← Înapoi la știri
        </Link>


        <header className="article-header">

          <span className="article-label">
            NOUTĂȚI • CȘE
          </span>

          <h1>{article.title}</h1>

          <time className="article-date">
            {new Date(
              article.created_at
            ).toLocaleDateString(
              "ro-RO",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </time>

        </header>


        {article.image_url && (
          <div className="article-image-container">

            <img
              src={`${API_URL}${article.image_url}`}
              alt={article.title}
              className="article-image"
            />

          </div>
        )}


        <div className="article-content">
          {article.content}
        </div>


        <footer className="article-footer">

          <div>
            <span>Consiliul Școlar al Elevilor</span>
            <strong>Colegiul Național „Sfântul Sava”</strong>
          </div>

          <Link to="/stiri">
            Vezi toate știrile →
          </Link>

        </footer>

      </article>

    </main>
  );
}


export default NewsArticle;
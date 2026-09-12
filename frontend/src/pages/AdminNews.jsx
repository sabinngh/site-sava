import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../config/api";

import "../styles/AdminNews.css";


function AdminNews() {
  const navigate = useNavigate();

  const [checkingAuth, setCheckingAuth] = useState(true);

  const [news, setNews] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [message, setMessage] = useState("");
  const [publishing, setPublishing] = useState(false);


  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch(
          `${API_URL}/api/auth/status`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!data.authenticated) {
          navigate("/admin/login", {
            replace: true,
          });

          return;
        }

        setCheckingAuth(false);

        await loadNews();

      } catch (error) {
        console.error(error);

        navigate("/admin/login", {
          replace: true,
        });
      }
    }

    checkAuth();
  }, [navigate]);

  async function loadNews() {
        try {
            const response = await fetch(
            `${API_URL}/api/news`
            );

            if (!response.ok) {
            throw new Error(
                "Nu am putut încărca știrile."
            );
            }

            const data = await response.json();

            setNews(data);

        } catch (error) {
            console.error(
            "Eroare la încărcarea știrilor:",
            error
            );
        }
    }


  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setPublishing(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(
         `${API_URL}/api/news`,
        {
          method: "POST",

          credentials: "include",

          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Știrea nu a putut fi publicată."
        );
      }

      setMessage("Știrea a fost publicată cu succes!");

      setTitle("");
      setContent("");
      setImage(null);
      setImagePreview(null);

    } catch (error) {
      console.error(error);
      setMessage(error.message);

    } finally {
      setPublishing(false);
    }
  }

  async function handleDelete(newsId) {
        const confirmed = window.confirm(
            "Sigur vrei să ștergi această știre?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
            `${API_URL}/api/news/${newsId}`,
            {
                method: "DELETE",
                credentials: "include",
            }
            );

            const data = await response.json();

            if (!response.ok) {
            throw new Error(
                data.error ||
                "Știrea nu a putut fi ștearsă."
            );
            }

            setMessage("Știrea a fost ștearsă.");

            await loadNews();

        } catch (error) {
            console.error(error);
            setMessage(error.message);
        }
    }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
        setImage(null);
        setImagePreview(null);
        return;
    }

    setImage(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  }


  if (checkingAuth) {
    return (
      <main className="admin-news-page">
        <p>Se verifică autentificarea...</p>
      </main>
    );
  }


  return (
    <main className="admin-news-page">

      <div className="admin-news-container">

        <button
          type="button"
          className="admin-back-button"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Înapoi la panoul de administrare
        </button>


        <header className="admin-news-header">

          <span>ADMIN • ȘTIRI</span>

          <h1>Adaugă o știre</h1>

          <p>
            Publică noutăți despre activitățile, proiectele și
            evenimentele comunității CȘE.
          </p>

        </header>


        <form
          className="news-form"
          onSubmit={handleSubmit}
        >

          <div className="news-form-group">
            <label htmlFor="news-title">
              Titlul știrii *
            </label>

            <input
              id="news-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Ex: Balul Bobocilor 2026"
              required
            />
          </div>


          <div className="news-form-group">
            <label htmlFor="news-content">
              Conținut *
            </label>

            <textarea
              id="news-content"
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              placeholder="Scrie aici conținutul știrii..."
              rows="14"
              required
            />
          </div>


          <div className="news-form-group">
                <label>Imagine</label>

                <div className="image-upload">
                    <input
                    id="news-image"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleImageChange}
                    />

                    <label
                    htmlFor="news-image"
                    className="image-upload-button"
                    >
                    <span className="image-upload-icon">+</span>

                    <div>
                        <strong>Alege o imagine</strong>
                        <span>JPG, PNG sau WEBP • maximum 5 MB</span>
                    </div>
                    </label>
                </div>
            </div>


          {image && (
            <div className="selected-image">
                <span>
                Imagine selectată: <strong>{image.name}</strong>
                </span>

                <button
                type="button"
                onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                }}
                >
                Elimină
                </button>
            </div>
          )}

          {imagePreview && (
            <div className="image-preview">
                <span>Previzualizare</span>

                <img
                src={imagePreview}
                alt="Previzualizare știre"
                />
            </div>
          )}


          {message && (
            <p className="news-form-message">
              {message}
            </p>
          )}


          <div className="news-form-actions">

            <button
              type="button"
              className="news-cancel-button"
              onClick={() =>
                navigate("/admin/dashboard")
              }
            >
              Anulează
            </button>

            <button
              type="submit"
              className="news-publish-button"
              disabled={publishing}
            >
              {publishing
                ? "Se publică..."
                : "Publică știrea"}
            </button>

          </div>

        </form>

        <section className="published-news">

        <div className="published-news-header">
            <div>
            <span>ȘTIRI</span>
            <h2>Știri publicate</h2>
            </div>

            <span>
            {news.length}{" "}
            {news.length === 1 ? "știre" : "știri"}
            </span>
        </div>


        {news.length === 0 ? (
            <div className="no-news">
            <p>Nu există încă știri publicate.</p>
            </div>
        ) : (
            <div className="published-news-list">

            {news.map((item) => (
                <article
                className="published-news-item"
                key={item.id}
                >

                {item.image_url ? (
                    <img
                    src={`${API_URL}${item.image_url}`}
                    alt={item.title}
                    />
                ) : (
                    <div className="published-news-placeholder">
                    Fără imagine
                    </div>
                )}


                <div className="published-news-info">

                    <span className="published-news-date">
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

                    <h3>{item.title}</h3>

                    <p>{item.content}</p>

                </div>


                <button
                    type="button"
                    className="delete-news-button"
                    onClick={() =>
                    handleDelete(item.id)
                    }
                >
                    Șterge
                </button>

                </article>
            ))}

            </div>
        )}

        </section>

      </div>

    </main>
  );
}


export default AdminNews;
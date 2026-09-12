import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../config/api";

import "../styles/AdminGallery.css";


function AdminGallery() {
  const navigate = useNavigate();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [gallery, setGallery] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);


  async function loadGallery() {
    try {
      const response = await fetch(
        `${API_URL}/api/gallery`
      );

      if (!response.ok) {
        throw new Error(
          "Galeria nu a putut fi încărcată."
        );
      }

      const data = await response.json();

      setGallery(data);

    } catch (error) {
      console.error(
        "Eroare la încărcarea galeriei:",
        error
      );
    }
  }


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

        await loadGallery();

      } catch (error) {
        console.error(error);

        navigate("/admin/login", {
          replace: true,
        });
      }
    }

    checkAuth();
  }, [navigate]);


    function handleImageChange(event) {
        const selectedFiles = Array.from(
            event.target.files
        );

        if (selectedFiles.length === 0) {
            return;
        }

        imagePreviews.forEach((preview) => {
            URL.revokeObjectURL(preview);
        });

        setImages(selectedFiles);

        const previews = selectedFiles.map(
            (file) => URL.createObjectURL(file)
        );

        setImagePreviews(previews);
    }


    function removeSelectedImages() {
        imagePreviews.forEach((preview) => {
            URL.revokeObjectURL(preview);
        });

        setImages([]);
        setImagePreviews([]);
    }


async function handleSubmit(event) {
    event.preventDefault();

    if (images.length === 0) {
        setMessage(
            "Selectează cel puțin o fotografie."
        );
        return;
    }

    setMessage("");
    setUploading(true);

    const formData = new FormData();

    formData.append(
        "description",
        description
    );

    
    images.forEach((image) => {
        formData.append(
        "images",
        image
        );
    });

    try {
        const response = await fetch(
        `${API_URL}/api/gallery`,
        {
            method: "POST",
            credentials: "include",
            body: formData,
        }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error ||
                "Fotografiile nu au putut fi încărcate."
            );
        }


        setMessage(
            data.message ||
            "Fotografiile au fost adăugate."
        );

        setDescription("");

        removeSelectedImages();

        await loadGallery();

        } catch (error) {
            console.error(error);

            setMessage(error.message);

        } finally {
            setUploading(false);
        }
    }


  async function handleDelete(imageId) {
    const confirmed = window.confirm(
      `Sigur vrei să ștergi fotografia #${imageId}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/gallery/${imageId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Fotografia nu a putut fi ștearsă."
        );
      }

      setMessage(
        `Fotografia #${imageId} a fost ștearsă.`
      );

      await loadGallery();

    } catch (error) {
      console.error(error);

      setMessage(error.message);
    }
  }


  if (checkingAuth) {
    return (
      <main className="admin-gallery-page">
        <p>Se verifică autentificarea...</p>
      </main>
    );
  }


  return (
    <main className="admin-gallery-page">

      <div className="admin-gallery-container">

        <button
          type="button"
          className="gallery-back-button"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          ← Înapoi la panoul de administrare
        </button>


        <header className="admin-gallery-header">

          <span>ADMIN • GALERIE</span>

          <h1>Galerie foto</h1>

          <p>
            Încarcă și gestionează fotografiile
            activităților și evenimentelor CȘE.
          </p>

        </header>


        <form
          className="gallery-upload-form"
          onSubmit={handleSubmit}
        >

          <div className="gallery-form-group">

            <div className="gallery-description-header">
              <label htmlFor="gallery-description">
                Descriere scurtă *
              </label>

              <span>
                {description.length}/60
              </span>
            </div>

            <input
              id="gallery-description"
              type="text"
              value={description}
              maxLength="60"
              placeholder="Ex: Ziua Porților Deschise 2026"
              onChange={(event) =>
                setDescription(event.target.value)
              }
              required
            />

          </div>


          <div className="gallery-form-group">

            <label>Fotografie *</label>

            <div className="gallery-image-upload">

              <input
                id="gallery-image"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                multiple
                onChange={handleImageChange}
              />

              <label
                htmlFor="gallery-image"
                className="gallery-upload-area"
              >
                <span className="gallery-upload-icon">
                  +
                </span>

                <div>
                  <strong>
                    Alege fotografiile
                  </strong>

                  <span>
                    Poți selecta mai multe fotografii simultan.
                    JPG, PNG sau WEBP • maximum 5 MB
                  </span>
                </div>
              </label>

            </div>

          </div>


          {imagePreviews.length > 0 && (

            <div className="gallery-preview">

                <div className="gallery-preview-header">

                <span>
                    {imagePreviews.length}{" "}
                    {imagePreviews.length === 1
                    ? "fotografie selectată"
                    : "fotografii selectate"}
                </span>

                <button
                    type="button"
                    onClick={removeSelectedImages}
                >
                    Elimină toate
                </button>

                </div>


                <div className="gallery-preview-grid">

                {imagePreviews.map(
                    (preview, index) => (

                    <div
                        className="gallery-preview-item"
                        key={preview}
                    >

                        <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        />

                        <span>
                        {images[index]?.name}
                        </span>

                    </div>

                    )
                )}

                </div>

            </div>

            )}


          {message && (
            <p className="gallery-message">
              {message}
            </p>
          )}


          <div className="gallery-form-actions">

            <button
              type="submit"
              className="gallery-submit-button"
              disabled={uploading}
            >
              {uploading
                ? "Se încarcă..."
                : "Adaugă în galerie"}
            </button>

          </div>

        </form>


        <section className="admin-gallery-images">

          <div className="gallery-list-header">

            <div>
              <span>FOTOGRAFII</span>
              <h2>Fotografii încărcate</h2>
            </div>

            <span>
              {gallery.length}{" "}
              {gallery.length === 1
                ? "fotografie"
                : "fotografii"}
            </span>

          </div>


          {gallery.length === 0 ? (

            <div className="gallery-empty">
              <h3>Galeria este goală.</h3>

              <p>
                Fotografiile încărcate vor apărea aici.
              </p>
            </div>

          ) : (

            <div className="admin-gallery-grid">

              {gallery.map((item) => (

                <article
                  className="admin-gallery-card"
                  key={item.id}
                >

                  <img
                    src={`${API_URL}${item.image_url}`}
                    alt={item.description}
                  />


                  <div className="admin-gallery-card-content">

                    <div className="gallery-card-meta">

                      <span>
                        #{item.id}
                      </span>

                      <time>
                        {new Date(
                          item.created_at
                        ).toLocaleDateString(
                          "ro-RO",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </time>

                    </div>


                    <h3>
                      {item.description}
                    </h3>


                    <button
                      type="button"
                      className="gallery-delete-button"
                      onClick={() =>
                        handleDelete(item.id)
                      }
                    >
                      Șterge fotografia
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}


export default AdminGallery;
import { useEffect, useState } from "react";

import { API_URL } from "../config/api";

import "../styles/Gallery.css";


function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {
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

        setImages(data);

      } catch (error) {
        console.error(error);

        setError(error.message);

      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);


  return (
    <main className="gallery-page">

      <section className="gallery-hero">

        <span>GALERIE FOTO</span>

        <h1>
          Momente din comunitatea{" "}
          <strong>savistă.</strong>
        </h1>

        <p>
          Descoperă activitățile, proiectele și
          evenimentele care ne aduc împreună.
        </p>

      </section>


      <section className="public-gallery">

        {loading && (
          <p className="gallery-status">
            Se încarcă fotografiile...
          </p>
        )}


        {error && (
          <p className="gallery-status">
            {error}
          </p>
        )}


        {!loading &&
          !error &&
          images.length === 0 && (

            <div className="gallery-status">
              <h2>Galeria este momentan goală.</h2>

              <p>
                Revino în curând pentru fotografii
                de la activitățile noastre.
              </p>
            </div>

          )}


        {!loading &&
          !error &&
          images.length > 0 && (

            <div className="public-gallery-grid">

              {images.map((image) => (

                <article
                className="public-gallery-item"
                key={image.id}
                onClick={() => setSelectedImage(image)}
                >
                    <img
                        src={`${API_URL}${image.image_url}`}
                        alt={image.description}
                        loading="lazy"
                    />

                    <div className="public-gallery-overlay">
                        <h2>{image.description}</h2>

                        <time>
                        {new Date(image.created_at).toLocaleDateString(
                            "ro-RO",
                            {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            }
                        )}
                        </time>
                    </div>
                </article>
              ))}

            </div>

          )}

      </section>

      {selectedImage && (
        <div
            className="gallery-lightbox"
            onClick={() => setSelectedImage(null)}
        >
                <button
                type="button"
                className="lightbox-close"
                onClick={() => setSelectedImage(null)}
                >
                ×
                </button>

                <div
                className="lightbox-content"
                onClick={(event) => event.stopPropagation()}
                >
                <img
                    src={`${API_URL}${selectedImage.image_url}`}
                    alt={selectedImage.description}
                />

                    <div className="lightbox-info">
                        <h2>{selectedImage.description}</h2>

                        <time>
                        {new Date(
                            selectedImage.created_at
                        ).toLocaleDateString(
                            "ro-RO",
                            {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            }
                        )}
                        </time>
                    </div>
                </div>
            </div>
        )}

    </main>
  );
}


export default Gallery;
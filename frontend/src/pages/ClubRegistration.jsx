import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import { API_URL } from "../config/api";


import "../styles/ClubRegistration.css";


function ClubRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    description: "",
    president_name: "",
    contact_email: "",
    instagram: "",
    requester_name: "",
    requester_email: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);


  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }


  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setCoverImage(null);
      setPreviewUrl(null);
      return;
    }

    setCoverImage(file);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  }


  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);


  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");
    setSubmitting(true);

    const data = new FormData();

    data.append("name", formData.name);
    data.append(
      "short_description",
      formData.short_description
    );
    data.append(
      "description",
      formData.description
    );
    data.append(
      "president_name",
      formData.president_name
    );
    data.append(
      "contact_email",
      formData.contact_email
    );
    data.append(
      "instagram",
      formData.instagram
    );
    data.append(
      "requester_name",
      formData.requester_name
    );
    data.append(
      "requester_email",
      formData.requester_email
    );

    if (coverImage) {
      data.append(
        "cover_image",
        coverImage
      );
    }


    try {
      const response = await fetch(
        `${API_URL}/api/clubs/requests`,
        {
          method: "POST",
          body: data,
        }
      );

      const responseData =
        await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error ||
          "Cererea nu a putut fi trimisă."
        );
      }


      setMessage(
        "Cererea a fost trimisă cu succes! Va fi verificată de administrator."
      );


      setFormData({
        name: "",
        short_description: "",
        description: "",
        president_name: "",
        contact_email: "",
        instagram: "",
        requester_name: "",
        requester_email: "",
      });

      setCoverImage(null);
      setPreviewUrl(null);

      // Resetăm și input-ul de tip file
      const fileInput =
        document.getElementById(
          "club-cover-image"
        );

      if (fileInput) {
        fileInput.value = "";
      }

    } catch (error) {
      console.error(error);
      setError(error.message);

    } finally {
      setSubmitting(false);
    }
  }


  return (
    <main className="club-registration-page">

      <div className="club-registration-container">

        <button
          type="button"
          className="club-registration-back"
          onClick={() => navigate("/cluburi")}
        >
          ← Înapoi la cluburi
        </button>


        <header className="club-registration-header">

          <span>CLUBURI • ÎNSCRIERE</span>

          <h1>
            Înscrie un club
          </h1>

          <p>
            Completează formularul pentru a propune
            înscrierea unui club pe platforma CȘE.
            Cererea va fi verificată înainte ca
            acesta să fie publicat.
          </p>

        </header>


        <form
          className="club-registration-form"
          onSubmit={handleSubmit}
        >

          <section className="registration-section">

            <div className="registration-section-heading">
              <span>01</span>

              <div>
                <h2>Despre club</h2>
                <p>
                  Informațiile care vor apărea
                  public pe pagina clubului.
                </p>
              </div>
            </div>


            <div className="registration-fields">

              <div className="registration-field full-width">

                <label htmlFor="club-name">
                  Numele clubului *
                </label>

                <input
                  id="club-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Clubul de Debate"
                  maxLength="120"
                  required
                />

              </div>


              <div className="registration-field full-width">

                <label htmlFor="club-short-description">
                  Descriere scurtă *
                </label>

                <input
                  id="club-short-description"
                  name="short_description"
                  type="text"
                  value={formData.short_description}
                  onChange={handleChange}
                  placeholder="Ex: Dezbateri, argumentare și public speaking."
                  maxLength="200"
                  required
                />

                <small>
                  {formData.short_description.length}/200 caractere
                </small>

              </div>


              <div className="registration-field full-width">

                <label htmlFor="club-description">
                  Descriere completă *
                </label>

                <textarea
                  id="club-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Prezintă activitatea clubului, obiectivele și proiectele sale..."
                  rows="9"
                  required
                />

              </div>

            </div>

          </section>


          <section className="registration-section">

            <div className="registration-section-heading">
              <span>02</span>

              <div>
                <h2>Conducere și contact</h2>
                <p>
                  Datele principale de contact ale clubului.
                </p>
              </div>
            </div>


            <div className="registration-fields">

              <div className="registration-field">

                <label htmlFor="club-president">
                  Președinte *
                </label>

                <input
                  id="club-president"
                  name="president_name"
                  type="text"
                  value={formData.president_name}
                  onChange={handleChange}
                  placeholder="Nume și prenume"
                  required
                />

              </div>


              <div className="registration-field">

                <label htmlFor="club-email">
                  Email de contact *
                </label>

                <input
                  id="club-email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="club@example.com"
                  required
                />

              </div>


              <div className="registration-field full-width">

                <label htmlFor="club-instagram">
                  Instagram
                </label>

                <input
                  id="club-instagram"
                  name="instagram"
                  type="text"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@club.sava"
                />

                <small>
                  Opțional
                </small>

              </div>

            </div>

          </section>


          <section className="registration-section">

            <div className="registration-section-heading">
              <span>03</span>

              <div>
                <h2>Imagine de copertă</h2>

                <p>
                  Alege fotografia principală care
                  va reprezenta clubul.
                </p>
              </div>
            </div>


            <div className="club-cover-upload">

              <input
                id="club-cover-image"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleImageChange}
              />


              <label
                htmlFor="club-cover-image"
                className="club-cover-upload-button"
              >
                <span className="upload-icon">
                  +
                </span>

                <span>
                  <strong>
                    Alege o fotografie
                  </strong>

                  <small>
                    JPG, PNG sau WEBP
                  </small>
                </span>
              </label>


              {previewUrl && (
                <div className="club-cover-preview">

                  <div className="club-cover-preview-header">

                    <span>
                      PREVIZUALIZARE
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setCoverImage(null);
                        setPreviewUrl(null);

                        const input =
                          document.getElementById(
                            "club-cover-image"
                          );

                        if (input) {
                          input.value = "";
                        }
                      }}
                    >
                      Elimină
                    </button>

                  </div>


                  <img
                    src={previewUrl}
                    alt="Previzualizare copertă club"
                  />

                </div>
              )}

            </div>

          </section>


          <section className="registration-section">

            <div className="registration-section-heading">
              <span>04</span>

              <div>
                <h2>Datele solicitantului</h2>

                <p>
                  Aceste informații sunt folosite
                  pentru identificarea persoanei
                  care trimite cererea.
                </p>
              </div>
            </div>


            <div className="registration-fields">

              <div className="registration-field">

                <label htmlFor="requester-name">
                  Numele tău *
                </label>

                <input
                  id="requester-name"
                  name="requester_name"
                  type="text"
                  value={formData.requester_name}
                  onChange={handleChange}
                  placeholder="Nume și prenume"
                  required
                />

              </div>


              <div className="registration-field">

                <label htmlFor="requester-email">
                  Emailul tău *
                </label>

                <input
                  id="requester-email"
                  name="requester_email"
                  type="email"
                  value={formData.requester_email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  required
                />

              </div>

            </div>

          </section>


          {error && (
            <p className="registration-error">
              {error}
            </p>
          )}


          {message && (
            <div className="registration-success">

              <strong>
                Cerere trimisă!
              </strong>

              <p>
                {message}
              </p>

            </div>
          )}


          <div className="registration-actions">

            <button
              type="button"
              className="registration-cancel"
              onClick={() => navigate("/cluburi")}
            >
              Anulează
            </button>


            <button
              type="submit"
              className="registration-submit"
              disabled={submitting}
            >
              {submitting
                ? "Se trimite..."
                : "Trimite cererea →"}
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}


export default ClubRegistration;
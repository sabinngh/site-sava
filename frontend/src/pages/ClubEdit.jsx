import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_URL } from "../config/api";

import "../styles/ClubEdit.css";


function ClubEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    description: "",
    president_name: "",
    contact_email: "",
    instagram: "",
    requester_name: "",
    requester_email: "",
    reason: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadClub() {
      try {
        const response = await fetch(
          `${API_URL}/api/clubs/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Clubul nu a putut fi încărcat."
          );
        }

        setClub(data);

        setFormData({
          name: data.name || "",
          short_description: data.short_description || "",
          description: data.description || "",
          president_name: data.president_name || "",
          contact_email: data.contact_email || "",
          instagram: data.instagram || "",
          requester_name: "",
          requester_email: "",
          reason: "",
        });

      } catch (error) {
        console.error(error);
        setError(error.message);

      } finally {
        setLoading(false);
      }
    }

    loadClub();
  }, [id]);


  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);


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
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setCoverImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }


  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");
    setError("");

    const data = new FormData();

    data.append("name", formData.name);
    data.append(
      "short_description",
      formData.short_description
    );
    data.append("description", formData.description);
    data.append(
      "president_name",
      formData.president_name
    );
    data.append(
      "contact_email",
      formData.contact_email
    );
    data.append("instagram", formData.instagram);

    data.append(
      "requester_name",
      formData.requester_name
    );

    data.append(
      "requester_email",
      formData.requester_email
    );

    data.append(
        "reason",
        formData.reason
    );

    if (coverImage) {
      data.append("cover_image", coverImage);
    }

    try {
      const response = await fetch(
        `${API_URL}/api/clubs/${id}/edit-requests`,
        {
          method: "POST",
          body: data,
        }
      );

      const contentType =
        response.headers.get("content-type");

        if (
            !contentType ||
            !contentType.includes("application/json")
        ) {
            throw new Error(
            `Serverul a răspuns cu eroarea ${response.status}.`
            );
        }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error ||
          "Cererea nu a putut fi trimisă."
        );
      }

      setMessage(
        "Propunerea a fost trimisă și așteaptă aprobarea administratorului."
      );

    } catch (error) {
      console.error(error);
      setError(error.message);

    } finally {
      setSubmitting(false);
    }
  }


  if (loading) {
    return (
      <main className="club-edit-page">
        <p>Se încarcă...</p>
      </main>
    );
  }


  if (!club) {
    return (
      <main className="club-edit-page">
        <p>Clubul nu a fost găsit.</p>
      </main>
    );
  }


  return (
    <main className="club-edit-page">

      <div className="club-edit-container">

        <button
          type="button"
          className="club-edit-back"
          onClick={() =>
            navigate(`/cluburi/${club.id}`)
          }
        >
          ← Înapoi la club
        </button>


        <header className="club-edit-header">

          <span>PROPUNERE MODIFICĂRI</span>

          <h1>
            Editează {club.name}
          </h1>

          <p>
            Propune actualizări pentru informațiile
            clubului. Modificările vor fi publicate
            numai după aprobarea administratorului.
          </p>

        </header>


        <form
          className="club-edit-form"
          onSubmit={handleSubmit}
        >

          <section className="club-edit-section">

            <div className="club-edit-section-header">
              <span>CLUB</span>
              <h2>Informații generale</h2>
            </div>


            <div className="club-edit-group">

              <label htmlFor="name">
                Numele clubului *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>


            <div className="club-edit-group">

              <label htmlFor="short_description">
                Descriere scurtă *
              </label>

              <input
                id="short_description"
                name="short_description"
                type="text"
                value={formData.short_description}
                onChange={handleChange}
                maxLength="160"
                required
              />

              <small>
                Aceasta apare pe cardul clubului.
              </small>

            </div>


            <div className="club-edit-group">

              <label htmlFor="description">
                Descriere completă *
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="10"
                required
              />

            </div>

          </section>


          <section className="club-edit-section">

            <div className="club-edit-section-header">
              <span>CONTACT</span>
              <h2>Conducere și contact</h2>
            </div>


            <div className="club-edit-grid">

              <div className="club-edit-group">

                <label htmlFor="president_name">
                  Președinte *
                </label>

                <input
                  id="president_name"
                  name="president_name"
                  type="text"
                  value={formData.president_name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="club-edit-group">

                <label htmlFor="contact_email">
                  Email club
                </label>

                <input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleChange}
                />

              </div>


              <div className="club-edit-group">

                <label htmlFor="instagram">
                  Instagram
                </label>

                <input
                  id="instagram"
                  name="instagram"
                  type="text"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@club"
                />

              </div>

            </div>

          </section>


          <section className="club-edit-section">

            <div className="club-edit-section-header">
              <span>IMAGINE</span>
              <h2>Imagine de copertă</h2>
            </div>


            <div className="club-cover-edit">

              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview imagine nouă"
                />
              ) : club.cover_image_url ? (
                <img
                  src={`${API_URL}${club.cover_image_url}`}
                  alt={club.name}
                />
              ) : (
                <div className="club-edit-placeholder">
                  CȘE
                </div>
              )}

            </div>


            <label className="club-image-selector">

              <span>
                Alege o imagine nouă
              </span>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleImageChange}
              />

            </label>


            {coverImage && (
              <p className="club-selected-file">
                Imagine selectată:{" "}
                <strong>{coverImage.name}</strong>
              </p>
            )}

          </section>


          <section className="club-edit-section">

            <div className="club-edit-section-header">
              <span>SOLICITANT</span>
              <h2>Cine propune modificările?</h2>
            </div>

            <p className="club-requester-description">
              Aceste informații sunt folosite de administrator
              pentru a identifica persoana care a trimis
              propunerea.
            </p>

            <div className="club-edit-group">
              <label htmlFor="reason">
                Ce dorești să modifici?
              </label>

              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="4"
                maxLength="500"
                placeholder="Ex: S-a schimbat președintele clubului și am actualizat descrierea."
                className="club-edit-reason"
              />

              <small>
                Opțional — ajută administratorul să înțeleagă
                mai ușor modificările propuse.
              </small>
            </div>

            <div className="club-edit-grid">

              <div className="club-edit-group">
                <label htmlFor="requester_name">
                  Numele tău *
                </label>

                <input
                  id="requester_name"
                  name="requester_name"
                  type="text"
                  value={formData.requester_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="club-edit-group">
                <label htmlFor="requester_email">
                  Emailul tău *
                </label>

                <input
                  id="requester_email"
                  name="requester_email"
                  type="email"
                  value={formData.requester_email}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

        </section>


          {error && (
            <p className="club-edit-error">
              {error}
            </p>
          )}


          {message && (
            <p className="club-edit-success">
              {message}
            </p>
          )}


          <div className="club-edit-actions">

            <button
              type="button"
              className="club-edit-cancel"
              onClick={() =>
                navigate(`/cluburi/${club.id}`)
              }
            >
              Anulează
            </button>


            <button
              type="submit"
              className="club-edit-submit"
              disabled={submitting}
            >
              {submitting
                ? "Se trimite..."
                : "Trimite propunerea"}
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}


export default ClubEdit;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

import { API_URL } from "../config/api";

function Admin() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    email: "",
    instagram: "",
    display_order: 0,
  });

  const [memberImage, setMemberImage] = useState(null);
  const [memberImagePreview, setMemberImagePreview] =
    useState(null);

  const [message, setMessage] = useState("");
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      setMemberImage(null);
      setMemberImagePreview(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage(
        "Fotografia trebuie să fie JPG, PNG sau WEBP."
      );

      event.target.value = "";

      setMemberImage(null);
      setMemberImagePreview(null);

      return;
    }

    setMemberImage(file);
    setMemberImagePreview(
      URL.createObjectURL(file)
    );

    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("role", formData.role);

      data.append(
        "description",
        formData.description
      );

      data.append("email", formData.email);

      data.append(
        "instagram",
        formData.instagram
      );

      data.append(
        "display_order",
        String(formData.display_order)
      );

      if (memberImage) {
        data.append(
          "image",
          memberImage
        );
      }

      const response = await fetch(
        `${API_URL}/api/members`,
        {
          method: "POST",
          credentials: "include",
          body: data,
        }
      );

      const responseData =
        await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error ||
          "Membrul nu a putut fi adăugat."
        );
      }

      setMessage(
        `${responseData.name} a fost adăugat cu succes!`
      );

      setFormData({
        name: "",
        role: "",
        description: "",
        email: "",
        instagram: "",
        display_order: 0,
      });

      setMemberImage(null);

      if (memberImagePreview) {
        URL.revokeObjectURL(
          memberImagePreview
        );
      }

      setMemberImagePreview(null);

      await loadMembers();

    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
        "A apărut o eroare."
      );
    }
  }

  async function loadMembers() {
    try {
        const response = await fetch(
        `${API_URL}/api/members`
        );

        if (!response.ok) {
        throw new Error("Nu am putut încărca membrii.");
        }

        const data = await response.json();

        setMembers(data);
    } catch (error) {
        console.error(error);
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

            await loadMembers();

            } catch (error) {
              console.error(error);
              navigate("/admin/login", {
                replace: true,
            });
            }
        }

        checkAuth();
    }, [navigate]);

  async function handleDelete(memberId) {
    const confirmed = window.confirm(
        "Sigur vrei să ștergi acest membru?"
    );


    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
        `${API_URL}/api/members/${memberId}`,
        {
            method: "DELETE",
            credentials:"include",
        }
        );

        if (!response.ok) {
        throw new Error("Membrul nu a putut fi șters.");
        }

        setMessage("Membrul a fost șters cu succes.");

        await loadMembers();
    } catch (error) {
        console.error(error);
        setMessage("A apărut o eroare la ștergerea membrului.");
    }
        }

    async function handleLogout() {
        try {
          const response = await fetch(
            `${API_URL}/api/auth/logout`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Logout-ul a eșuat.");
          }

          navigate("/admin/login", {
            replace: true,
          });

        } catch (error) {
          console.error("Eroare la logout:", error);
        }
    }

  if (checkingAuth) {
    return (
      <main className="admin-page">
        <p>Se verifică autentificarea...</p>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
            <div>
              <span>ADMIN</span>

              <h1>Panou de administrare</h1>

              <p>
                Gestionează conținutul site-ului CȘE.
              </p>
            </div>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          <section className="admin-actions">

            <div className="admin-action-card">

              <div>
                <span>ȘTIRI</span>

                <h2>Publică o noutate</h2>

                <p>
                  Adaugă articole despre evenimente,
                  proiecte și activități CȘE.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin/news")}
              >
                Adaugă o știre →
              </button>

            </div>

            <div className="admin-action-card">

              <div>
                <span>GALERIE</span>

                <h2>Gestionează fotografiile</h2>

                <p>
                  Adaugă sau șterge fotografii din
                  galeria CȘE.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/gallery")
                }
              >
                Gestionează galeria →
              </button>

           </div>

           <div className="admin-action-card">

            <div>
              <span>CLUBURI</span>

              <h2>Gestionează cluburile</h2>

              <p>
                Verifică cererile de înscriere,
                aprobă cluburi și gestionează
                cluburile existente.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/clubs")
              }
            >
              Gestionează cluburile →
            </button>

          </div>

        </section>

        <form className="member-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nume *</label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Funcție *</label>

            <input
              id="role"
              name="role"
              type="text"
              value={formData.role}
              onChange={handleChange}
              placeholder="Ex: Președinte"
              required
            />
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="description">Descriere</label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
            />
          </div>

          <div className="form-group form-group-full">

            <label>
              Fotografie
            </label>

            <label
              htmlFor="member_image"
              className="member-image-selector"
            >
              Alege fotografia

              <input
                id="member_image"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleImageChange}
              />
            </label>

            {memberImage && (
              <p className="member-selected-file">
                {memberImage.name}
              </p>
            )}

            {memberImagePreview && (
              <div className="member-image-preview">
                <img
                  src={memberImagePreview}
                  alt="Previzualizare"
                />
              </div>
            )}

          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="instagram">Instagram</label>

            <input
              id="instagram"
              name="instagram"
              type="text"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="@username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="display_order">Ordine afișare</label>

            <input
              id="display_order"
              name="display_order"
              type="number"
              min="0"
              value={formData.display_order}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="admin-submit">
            Adaugă membru
          </button>

          {message && (
            <p className="admin-message">{message}</p>
          )}
        </form>

        <section className="admin-members">
            <div className="admin-members-header">
                <div>
                <span>ECHIPĂ</span>
                <h2>Membri existenți</h2>
                </div>

                <span>
                {members.length} {members.length === 1 ? "membru" : "membri"}
                </span>
            </div>

            <div className="admin-members-list">
                {members.map((member) => (
                <div className="admin-member" key={member.id}>

                    <div className="admin-member-info">
                    {member.image_url ? (
                        <img
                        src={`${API_URL}${member.image_url}`}
                        alt={member.name}
                        />
                    ) : (
                        <div className="admin-member-placeholder">
                        {member.name.charAt(0)}
                        </div>
                    )}

                    <div>
                        <strong>{member.name}</strong>
                        <span>{member.role}</span>
                    </div>
                    </div>

                    <button
                    type="button"
                    className="delete-member-button"
                    onClick={() => handleDelete(member.id)}
                    >
                    Șterge
                    </button>

                </div>
                ))}
            </div>
        </section>

      </div>


    </main>
  );
}

export default Admin;
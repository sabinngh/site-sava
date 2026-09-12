import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../config/api";

import "../styles/AdminLogin.css";


function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Autentificarea a eșuat."
        );
      }

      navigate("/admin/dashboard", {
        replace: true,
      });

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-login-label">
          ADMIN
        </div>

        <h1>Autentificare</h1>

        <p className="admin-login-description">
          Acces restricționat administratorului CȘE.
        </p>


        <form onSubmit={handleSubmit}>

          <div className="login-form-group">
            <label htmlFor="admin-email">
              Email
            </label>

            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="username"
              required
            />
          </div>


          <div className="login-form-group">
            <label htmlFor="admin-password">
              Parolă
            </label>

            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />
          </div>


          {error && (
            <p className="login-error">
              {error}
            </p>
          )}


          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Se autentifică..."
              : "Autentificare"}
          </button>

        </form>

      </div>

    </main>
  );
}


export default AdminLogin;
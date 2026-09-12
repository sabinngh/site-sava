import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../config/api";

import "../styles/AdminClubs.css";


function AdminClubs() {
  const navigate = useNavigate();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);

  const [requests, setRequests] = useState([]);
  const [clubs, setClubs] = useState([]);

  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const [confirmModal, setConfirmModal] = useState(null);

  const [editRequests, setEditRequests] =
    useState([]);

  const [processingEditId, setProcessingEditId] =
    useState(null);


  useEffect(() => {
    async function initializePage() {
      try {
        const authResponse = await fetch(
          `${API_URL}/api/auth/status`,
          {
            credentials: "include",
          }
        );

        const authData = await authResponse.json();

        if (!authData.authenticated) {
          navigate("/admin/login", {
            replace: true,
          });

          return;
        }

        setCheckingAuth(false);

        await loadData();

      } catch (error) {
        console.error(error);

        navigate("/admin/login", {
          replace: true,
        });
      }
    }

    initializePage();
  }, [navigate]);


  async function loadData() {
      setLoading(true);

      try {
        const [
          requestsResponse,
          clubsResponse,
          editRequestsResponse,
        ] = await Promise.all([
          fetch(
            `${API_URL}/api/clubs/requests`,
            {
              credentials: "include",
            }
          ),

          fetch(
            `${API_URL}/api/clubs`
          ),

          fetch(
            `${API_URL}/api/clubs/edit-requests`,
            {
              credentials: "include",
            }
          ),
        ]);

        if (!requestsResponse.ok) {
          throw new Error(
            "Nu am putut încărca cererile."
          );
        }

        if (!clubsResponse.ok) {
          throw new Error(
            "Nu am putut încărca cluburile."
          );
        }

        if (!editRequestsResponse.ok) {
          throw new Error(
            "Nu am putut încărca propunerile de modificare."
          );
        }

        const requestsData =
          await requestsResponse.json();

        const clubsData =
          await clubsResponse.json();

        const editRequestsData =
          await editRequestsResponse.json();

        setRequests(requestsData);
        setClubs(clubsData);
        setEditRequests(editRequestsData);

      } catch (error) {
        console.error(error);

        setMessage(
          "A apărut o eroare la încărcarea cluburilor."
        );

      } finally {
        setLoading(false);
      }
    }


  async function handleApprove(requestId) {
    setProcessingId(requestId);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/requests/${requestId}/approve`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Clubul nu a putut fi aprobat."
        );
      }

      setMessage(
        `${data.club.name} a fost aprobat cu succes.`
      );

      await loadData();

    } catch (error) {
      console.error(error);
      setMessage(error.message);

    } finally {
      setProcessingId(null);
    }
  }


  async function handleReject(requestId) {
    setProcessingId(requestId);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/clubs/requests/${requestId}/reject`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Cererea nu a putut fi respinsă."
        );
      }

      setMessage(
        "Cererea a fost respinsă."
      );

      await loadData();

    } catch (error) {
      console.error(error);
      setMessage(error.message);

    } finally {
      setProcessingId(null);
    }
  }


  function formatDate(dateString) {
    if (!dateString) {
      return "";
    }

    return new Date(dateString).toLocaleDateString(
      "ro-RO",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  async function handleDeleteClub(clubId, clubName) {

    setProcessingId(clubId);
    setMessage("");

    try {
        const response = await fetch(
        `${API_URL}/api/clubs/${clubId}`,
        {
            method: "DELETE",
            credentials: "include",
        }
        );

        const data = await response.json();

        if (!response.ok) {
        throw new Error(
            data.error ||
                "Clubul nu a putut fi șters."
        );
        }

        setMessage(
            `${clubName} a fost șters cu succes.`
        );

        await loadData();

        } catch (error) {
            console.error(error);
            setMessage(error.message);

        } finally {
            setProcessingId(null);
        }
    }

  async function loadEditRequests() {
    try {
      const response = await fetch(
        `${API_URL}/api/clubs/edit-requests`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Nu am putut încărca modificările."
        );
      }

      setEditRequests(data);

    } catch (error) {
      console.error(

      "Eroare la încărcarea modificărilor:",
      error);
    }
  }

  async function handleApproveEdit(requestId) {
    setProcessingEditId(requestId);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/clubs/edit-requests/${requestId}/approve`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Modificările nu au putut fi aprobate."
        );
      }

      setMessage(
        "Modificările au fost aprobate cu succes."
      );

      await loadData();

    } catch (error) {
      console.error(error);
      setMessage(error.message);

    } finally {
      setProcessingEditId(null);
    }
  }


    async function handleRejectEdit(requestId) {
      setProcessingEditId(requestId);
      setMessage("");

      try {
        const response = await fetch(
          `${API_URL}/api/clubs/edit-requests/${requestId}/reject`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Propunerea nu a putut fi respinsă."
          );
        }

        setMessage(
          "Propunerea a fost respinsă."
        );

        await loadData();

      } catch (error) {
        console.error(error);
        setMessage(error.message);

      } finally {
        setProcessingEditId(null);
      }
    }

  

  return (
    <main className="admin-clubs-page">

      <div className="admin-clubs-container">

        <button
          type="button"
          className="clubs-back-button"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          ← Înapoi la panoul de administrare
        </button>


        <header className="admin-clubs-header">

          <span>ADMIN • CLUBURI</span>

          <h1>Gestionează cluburile</h1>

          <p>
            Verifică cererile de înscriere și
            gestionează cluburile active.
          </p>

        </header>


        {message && (
          <p className="admin-clubs-message">
            {message}
          </p>
        )}


        {loading ? (
          <p>Se încarcă cluburile...</p>
        ) : (
          <>
            <section className="club-requests-section">

              <div className="clubs-section-header">
                <div>
                  <span>CERERI</span>
                  <h2>Cereri în așteptare</h2>
                </div>

                <span className="clubs-count">
                  {requests.length}
                </span>
              </div>


              {requests.length === 0 ? (

                <div className="clubs-empty-state">
                  <h3>Nicio cerere în așteptare</h3>

                  <p>
                    Cererile noi de înscriere a
                    cluburilor vor apărea aici.
                  </p>
                </div>

              ) : (

                <div className="club-request-list">

                  {requests.map((clubRequest) => (

                    <article
                      className="club-request-card"
                      key={clubRequest.id}
                    >

                      <div className="club-request-top">

                        <div>
                          <span className="request-status">
                            ÎN AȘTEPTARE
                          </span>

                          <h3>
                            {clubRequest.name}
                          </h3>
                        </div>

                        <span className="request-date">
                          {formatDate(
                            clubRequest.created_at
                          )}
                        </span>

                      </div>


                      <p className="request-short-description">
                        {clubRequest.short_description}
                      </p>


                      <div className="request-details">

                        <div>
                          <span>Președinte</span>
                          <strong>
                            {clubRequest.president_name}
                          </strong>
                        </div>

                        <div>
                          <span>Email club</span>
                          <strong>
                            {clubRequest.contact_email}
                          </strong>
                        </div>

                        <div>
                          <span>Solicitant</span>
                          <strong>
                            {clubRequest.requester_name}
                          </strong>
                        </div>

                        <div>
                          <span>Email solicitant</span>
                          <strong>
                            {clubRequest.requester_email}
                          </strong>
                        </div>

                      </div>


                      {clubRequest.instagram && (
                        <p className="request-instagram">
                          Instagram:{" "}
                          <strong>
                            {clubRequest.instagram}
                          </strong>
                        </p>
                      )}


                      <div className="request-full-description">

                        <span>DESCRIERE</span>

                        <p>
                          {clubRequest.description}
                        </p>

                      </div>


                      {clubRequest.cover_image_url && (
                        <div className="request-cover">

                          <span>IMAGINE DE COPERTĂ</span>

                          <img
                            src={`${API_URL}${clubRequest.cover_image_url}`}
                            alt={clubRequest.name}
                          />

                        </div>
                      )}


                      <div className="request-actions">

                        <button
                          type="button"
                          className="reject-club-button"
                          disabled={
                            processingId ===
                            clubRequest.id
                          }
                          onClick={() =>
                              setConfirmModal({
                                type: "reject",
                                id: clubRequest.id,
                                name: clubRequest.name,
                            })
                          }
                        >
                          Respinge
                        </button>


                        <button
                            type="button"
                            className="approve-club-button"
                            disabled={processingId === clubRequest.id}
                            onClick={() =>
                              setConfirmModal({
                                type: "approve",
                                id: clubRequest.id,
                                name: clubRequest.name,
                              })
                            }
                          >
                            {processingId === clubRequest.id
                              ? "Se procesează..."
                              : "Aprobă clubul"}
                        </button>

                      </div>

                    </article>

                  ))}

                </div>
              )}

            </section>


            <section className="club-edit-requests-section">

              <div className="clubs-section-header">
                <div>
                  <span>MODIFICĂRI</span>
                  <h2>Modificări propuse</h2>
                </div>

                <span className="clubs-count">
                  {editRequests.length}
                </span>
              </div>


              {editRequests.length === 0 ? (

                <div className="clubs-empty-state">
                  <h3>Nicio modificare în așteptare</h3>

                  <p>
                    Propunerile de modificare ale cluburilor
                    vor apărea aici.
                  </p>
                </div>

              ) : (

                <div className="club-edit-request-list">

                  {editRequests.map((editRequest) => {

                    const currentClub = clubs.find(
                      (club) =>
                        club.id === editRequest.club_id
                    );

                    return (
                      <div
                        className="club-edit-request-card"
                        key={editRequest.id}
                      >

                        <div className="edit-request-heading">

                          <div>
                            <span className="request-status">
                              ÎN AȘTEPTARE
                            </span>

                            <h3>
                              {editRequest.name}
                            </h3>
                          </div>

                          <span className="request-date">
                            {new Date(
                              editRequest.created_at
                            ).toLocaleDateString(
                              "ro-RO"
                            )}
                          </span>

                        </div>


                        {editRequest.reason && (
                          <div className="edit-reason">
                            <span>MOTIVUL MODIFICĂRII</span>

                            <p>
                              {editRequest.reason}
                            </p>
                          </div>
                        )}


                        <div className="edit-comparison">

                          <div className="comparison-header">
                            <span>INFORMAȚIE</span>
                            <span>ACTUAL</span>
                            <span>PROPUS</span>
                          </div>


                          <ComparisonRow
                            label="Nume"
                            current={currentClub?.name}
                            proposed={editRequest.name}
                          />

                          <ComparisonRow
                            label="Descriere scurtă"
                            current={
                              currentClub?.short_description
                            }
                            proposed={
                              editRequest.short_description
                            }
                          />

                          <ComparisonRow
                            label="Descriere"
                            current={
                              currentClub?.description
                            }
                            proposed={
                              editRequest.description
                            }
                          />

                          <ComparisonRow
                            label="Președinte"
                            current={
                              currentClub?.president_name
                            }
                            proposed={
                              editRequest.president_name
                            }
                          />

                          <ComparisonRow
                            label="Email"
                            current={
                              currentClub?.contact_email
                            }
                            proposed={
                              editRequest.contact_email
                            }
                          />

                          <ComparisonRow
                            label="Instagram"
                            current={
                              currentClub?.instagram
                            }
                            proposed={
                              editRequest.instagram
                            }
                          />

                        </div>


                        {editRequest.cover_image_filename && (
                          <div className="edit-image-comparison">

                            <span>IMAGINE PROPUSĂ</span>

                            <img
                              src={
                                `${API_URL}/api/clubs/edit-request-images/${editRequest.cover_image_filename}`
                              }
                              alt="Imagine propusă"
                            />

                          </div>
                        )}


                        <div className="edit-requester">

                          <span>PROPUS DE</span>

                          <strong>
                            {editRequest.requester_name}
                          </strong>

                          <p>
                            {editRequest.requester_email}
                          </p>

                        </div>


                        <div className="request-actions">

                          <button
                            type="button"
                            className="reject-club-button"
                            disabled={
                              processingEditId ===
                              editRequest.id
                            }
                            onClick={() =>
                              handleRejectEdit(
                                editRequest.id
                              )
                            }
                          >
                            Respinge modificările
                          </button>


                          <button
                            type="button"
                            className="approve-club-button"
                            disabled={
                              processingEditId ===
                              editRequest.id
                            }
                            onClick={() =>
                              handleApproveEdit(
                                editRequest.id
                              )
                            }
                          >
                            {processingEditId ===
                            editRequest.id
                              ? "Se procesează..."
                              : "Aprobă modificările"}
                          </button>

                        </div>

                      </div>
                    );
                  })}

                </div>

              )}

            </section>

            <section className="active-clubs-section">

              <div className="clubs-section-header">

                <div>
                  <span>PUBLICATE</span>
                  <h2>Cluburi active</h2>
                </div>

                <span className="clubs-count">
                  {clubs.length}
                </span>

              </div>


              {clubs.length === 0 ? (

                <div className="clubs-empty-state">
                  <h3>Nu există cluburi încă</h3>

                  <p>
                    Cluburile aprobate vor apărea aici.
                  </p>
                </div>

              ) : (

                <div className="active-clubs-grid">

                  {clubs.map((club) => (

                    <article
                      className="active-club-card"
                      key={club.id}
                    >

                      {club.cover_image_url ? (

                        <img
                          src={`${API_URL}${club.cover_image_url}`}
                          alt={club.name}
                        />

                      ) : (

                        <div className="club-cover-placeholder">
                          CȘE
                        </div>

                      )}


                      <div className="active-club-info">

                        <span>
                          CLUB #{club.id}
                        </span>

                        <h3>{club.name}</h3>

                        <p>
                          {club.short_description}
                        </p>

                        <div className="club-president">
                          Președinte:{" "}
                          <strong>
                            {club.president_name}
                          </strong>
                        </div>

                        <button
                            type="button"
                            className="delete-club-button"
                            disabled={processingId === club.id}
                            onClick={() =>
                                setConfirmModal({
                                  type: "delete",
                                  id: club.id,
                                  name: club.name,
                                })
                            }
                            >
                            {processingId === club.id
                                ? "Se șterge..."
                                : "Șterge clubul"}
                        </button>

                      </div>

                    </article>

                  ))}

                </div>
              )}

            </section>
          </>
        )}

      </div>

      {confirmModal && (
        <div
          className="club-modal-overlay"
          onClick={() => setConfirmModal(null)}
        >
          <div
            className="club-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className={`club-modal-icon ${
                confirmModal.type === "delete" ||
                confirmModal.type === "reject"
                  ? "danger"
                  : ""
              }`}
            >
              {confirmModal.type === "approve" ? "✓" : "!"}
            </div>

            <span className="club-modal-label">
              CONFIRMARE
            </span>

            <h2>
              {confirmModal.type === "approve" &&
                "Aprobă clubul?"}

              {confirmModal.type === "reject" &&
                "Respinge cererea?"}

              {confirmModal.type === "delete" &&
                "Șterge clubul?"}
            </h2>

            <p>
              {confirmModal.type === "approve" && (
                <>
                  Ești sigur că vrei să aprobi{" "}
                  <strong>{confirmModal.name}</strong>?
                  Clubul va deveni vizibil public pe site.
                </>
              )}

              {confirmModal.type === "reject" && (
                <>
                  Ești sigur că vrei să respingi cererea pentru{" "}
                  <strong>{confirmModal.name}</strong>?
                </>
              )}

              {confirmModal.type === "delete" && (
                <>
                  Ești sigur că vrei să ștergi definitiv{" "}
                  <strong>{confirmModal.name}</strong>?
                  Această acțiune nu poate fi anulată.
                </>
              )}
            </p>

            <div className="club-modal-actions">
              <button
                type="button"
                className="club-modal-cancel"
                onClick={() => setConfirmModal(null)}
              >
                Anulează
              </button>

              <button
                type="button"
                className={
                  confirmModal.type === "approve"
                    ? "club-modal-confirm"
                    : "club-modal-confirm club-modal-danger"
                }
                onClick={async () => {
                  const modal = confirmModal;

                  setConfirmModal(null);

                  if (modal.type === "approve") {
                    await handleApprove(modal.id);
                  }

                  if (modal.type === "reject") {
                    await handleReject(modal.id);
                  }

                  if (modal.type === "delete") {
                    await handleDeleteClub(
                      modal.id,
                      modal.name
                    );
                  }
                }}
              >
                {confirmModal.type === "approve" &&
                  "Da, aprobă clubul"}

                {confirmModal.type === "reject" &&
                  "Da, respinge cererea"}

                {confirmModal.type === "delete" &&
                  "Da, șterge clubul"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

function ComparisonRow({
  label,
  current,
  proposed,
}) {
  const currentValue =
    current || "—";

  const proposedValue =
    proposed || "—";

  const changed =
    currentValue !== proposedValue;

  return (
    <div
      className={
        changed
          ? "comparison-row changed"
          : "comparison-row"
      }
    >
      <strong>
        {label}
      </strong>

      <p>
        {currentValue}
      </p>

      <p>
        {proposedValue}
      </p>
    </div>
  );
}


export default AdminClubs;
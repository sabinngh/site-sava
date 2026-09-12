import { useEffect, useState } from "react";
import "../styles/Team.css";
import { API_URL } from "../config/api";

function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/members`)
      .then((response) => response.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Eroare la încărcarea echipei:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Se încarcă echipa...</p>;
  }

  return (
    <main className="team-page">
      <section className="team-hero">
        <span>ECHIPA NOASTRĂ</span>
        <h1>
          Elevii din spatele <strong>CȘE.</strong>
        </h1>

        <p>
          Cunoaște echipa care reprezintă vocea elevilor și contribuie
          la proiectele comunității noastre.
        </p>
      </section>

      <section className="team-members">
        {members.length === 0 ? (
          <p>Momentan nu există membri adăugați.</p>
        ) : (
          <div className="team-grid">
            {members.map((member) => (
              <article className="member-card" key={member.id}>
                {member.image_url ? (
                    <img src={`${API_URL}${member.image_url}`} alt={member.name} />
                    ) : (
                    <div className="member-image-placeholder">
                        <span>
                        {member.name
                            .split(" ")
                            .map((word) => word[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                    </div>
                    )}

                <div className="member-info">
                    <span>{member.role}</span>

                    <h2>{member.name}</h2>

                    {member.description && (
                        <p className="member-description">
                        {member.description}
                        </p>
                    )}

                    {(member.email || member.instagram) && (
                        <div className="member-contact">
                        {member.email && (
                            <a href={`mailto:${member.email}`}>
                            ✉️ {member.email}
                            </a>
                        )}

                        {member.instagram && (
                            <a
                            href={`https://instagram.com/${member.instagram.replace("@", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            >
                            📷 {member.instagram}
                            </a>
                        )}
                        </div>
                    )}
                    </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Team;
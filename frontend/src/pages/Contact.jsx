import "../styles/Contact.css";

import { API_URL } from "../config/api";

function Contact() {
  return (
    <main className="contact-page">
      <div className="contact-container">

        <header className="contact-header">
          <span>CONTACT</span>

          <h1>
            Hai să ținem legătura.
          </h1>

          <p>
            Consiliul Școlar al Elevilor din Colegiul
            Național „Sfântul Sava”.
          </p>
        </header>


        <section className="contact-main-card">

          <div className="contact-identity">

            <span className="contact-label">
              CȘE CNSS
            </span>

            <h2>
              De la elevi,<br />
              pentru elevi.
            </h2>

            <p>
              Spiritul Savist
            </p>

          </div>


          <div className="contact-details">

            <div className="contact-detail">
              <span>EMAIL</span>

              <a href="mailto:cse.sava@gmail.ro">
                cse.sava@gmail.ro
              </a>
            </div>


            <div className="contact-detail">
              <span>INSTAGRAM</span>

              <a
                href="https://instagram.com/cse.sava"
                target="_blank"
                rel="noreferrer"
              >
                @cse.sava
              </a>
            </div>


            <div className="contact-detail">
              <span>ORGANIZAȚIE</span>

              <strong>
                CȘE CNSS
              </strong>
            </div>

          </div>

        </section>


        <section className="contact-quote">

          <span>SPIRITUL SAVIST</span>

          <blockquote>
            „O tradiție de secole,
            un viitor pe măsură!”
          </blockquote>

        </section>

      </div>
    </main>
  );
}

export default Contact;
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Could not connect to API"));
  }, []);

  return (
    <main>
      <h1>Consiliul Școlar al Elevilor</h1>
      <p>Backend: {message}</p>
    </main>
  );
}

export default App;
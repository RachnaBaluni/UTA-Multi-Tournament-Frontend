import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Tournaments.module.css";

const Tournaments = () => {
  console.log("🔥🔥🔥 NEW TOURNAMENT COMPONENT RUNNING 🔥🔥🔥");

  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/main-events`,
        );

        setTournaments(response.data.data || []);
      } catch (err) {
        console.error("Error fetching tournaments:", err);
        setError("Unable to load tournaments.");
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "50px" }}>
        <h1>Loading tournaments...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "50px" }}>
        <h1>{error}</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: "50px" }}>
      <h1 style={{ color: "red", fontSize: "50px" }}>NEW TOURNAMENT PAGE</h1>

      <h2>Tournaments</h2>

      {tournaments.length === 0 ? (
        <p>No tournaments available.</p>
      ) : (
        <div>
          {tournaments.map((tournament) => (
            <Link
              key={tournament._id}
              to={`/tournaments/${tournament._id}`}
              style={{
                display: "block",
                padding: "20px",
                marginBottom: "15px",
                border: "1px solid #ccc",
                textDecoration: "none",
                color: "black",
              }}
            >
              <h2>{tournament.name}</h2>

              {tournament.date && (
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(tournament.date).toLocaleDateString()}
                </p>
              )}

              {tournament.location && (
                <p>
                  <strong>Location:</strong> {tournament.location}
                </p>
              )}

              <strong>View Details →</strong>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tournaments;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Tournaments.module.css";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        // Normal + Display tournaments
        const tournamentsResponse = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/tournaments/`,
        );

        // Main Events
        const mainEventsResponse = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/main-events`,
        );

        const allTournaments = tournamentsResponse.data.data || [];
        const mainEvents = mainEventsResponse.data.data || [];

        // Normal + Display
        const normalAndDisplay = allTournaments.filter(
          (tournament) =>
            tournament.type === "normal" || tournament.type === "display",
        );

        // Dono ko combine kar diya
        const combinedTournaments = [...normalAndDisplay, ...mainEvents];

        console.log("🔥 NORMAL + DISPLAY:", normalAndDisplay);
        console.log("🔥 MAIN EVENTS:", mainEvents);
        console.log("🔥🔥 FINAL TOURNAMENT LIST:", combinedTournaments);

        setTournaments(combinedTournaments);
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
      <h1>Tournaments</h1>

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

              {tournament.startDate && (
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(tournament.startDate).toLocaleDateString()}
                </p>
              )}

              {tournament.endDate && (
                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(tournament.endDate).toLocaleDateString()}
                </p>
              )}

              {tournament.location && (
                <p>
                  <strong>Location:</strong> {tournament.location}
                </p>
              )}

              <p>
                <strong>Type:</strong> {tournament.type}
              </p>

              <strong>View Details →</strong>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tournaments;

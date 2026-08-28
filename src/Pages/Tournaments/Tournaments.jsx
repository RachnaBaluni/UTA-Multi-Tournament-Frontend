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
      <div className={styles.pageContainer}>
        <h2>Loading tournaments...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentContainer}>
        <h1 className={styles.pageTitle}>Tournaments</h1>

        {tournaments.length === 0 ? (
          <p className={styles.noResults}>No tournaments available.</p>
        ) : (
          <div className={styles.tournamentList}>
            {tournaments.map((tournament) => (
              <Link
                key={tournament._id}
                to={`/tournaments/${tournament._id}`}
                className={styles.tournamentCard}
              >
                <div className={styles.tournamentInfo}>
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
                </div>

                <span className={styles.viewDetails}>View Details →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;

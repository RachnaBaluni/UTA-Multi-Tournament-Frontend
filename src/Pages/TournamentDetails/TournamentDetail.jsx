import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./TournamentDetail.module.css";

const TournamentDetail = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/main-events/${id}`
        );
        setTournament(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error fetching tournament data.</div>;
  }

  if (!tournament) {
    return <div className={styles.error}>Tournament not found.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <h1>{tournament.name}</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.detailItem}>
          <strong>Description:</strong>
          <p>{tournament.description}</p>
        </div>
        <div className={styles.detailItem}>
          <strong>Date:</strong>
          <p>{new Date(tournament.date).toLocaleDateString()}</p>
        </div>
        <div className={styles.detailItem}>
          <strong>Location:</strong>
          <p>{tournament.location}</p>
        </div>
        <div className={styles.detailItem}>
          <strong>Organizer:</strong>
          <p>{tournament.organizer}</p>
        </div>
        {tournament.rules && (
          <div className={styles.detailItem}>
            <strong>Rules:</strong>
            <p>{tournament.rules}</p>
          </div>
        )}
        <div className={styles.registerButtonContainer}>
          <button className={styles.registerButton}>Register Now</button>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;

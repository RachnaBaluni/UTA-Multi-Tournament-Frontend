import React from "react";
import { Link } from "react-router-dom";
import styles from "./TournamentListing.module.css";

const TournamentListing = ({ id, name, city, date }) => {
  return (
    <div className={styles.tournamentListing}>
      <div className={styles.tournamentDetails}>
        <h2>{name}</h2>
        <p>
          {city}, {date}
        </p>
      </div>
      <Link to={`/tournaments/${id}`} className={styles.registerButton}>
        Explore
      </Link>
    </div>
  );
};

export default TournamentListing;

import React from "react";
import styles from "./LoginPageTournament.module.css";

const LoginPageTournament = ({
  tournaments,
  selectedTournament,
  setSelectedTournament,
  handleNext,
  handleBack,
}) => {
  return (
    <div className={styles.container}>
      <section className={styles.formSection}>
        <label htmlFor="tournament" className={styles.label}>
          Choose Tournament
        </label>

        <select
          id="tournament"
          value={selectedTournament}
          onChange={(e) => setSelectedTournament(e.target.value)}
          className={styles.select}
        >
          <option value="">-- Select a Tournament --</option>

          {tournaments.map((tournament) => (
            <option key={tournament._id} value={tournament._id}>
              {tournament.name}
            </option>
          ))}
        </select>
      </section>

      <div className={styles.buttonGroup}>
        <button onClick={handleBack} className={styles.secondaryButton}>
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!selectedTournament}
          className={styles.primaryButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LoginPageTournament;

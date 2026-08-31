import React from "react";
import styles from "./RegisterPageTournament.module.css";

const RegisterPageTournament = ({
  formData,
  setFormData,
  handleNext,
  handleBack,
  tournaments,
}) => {
  return (
    <div className={styles.registerTournamentContainer}>
      <h2 className={styles.heading}>Select Tournament</h2>

      <div className={styles.formSection}>
        <label htmlFor="tournament" className={styles.label}>
          Choose Tournament
        </label>

        <select
          id="tournament"
          className={styles.select}
          value={formData.tournamentId || ""}
          onChange={(e) => {
            const tournamentId = e.target.value || null;

            setFormData({
              ...formData,
              tournamentId,
              event1: null,
              partner1: null,
              event2: null,
              partner2: null,
            });
          }}
        >
          <option value="">-- Select a Tournament --</option>

          {tournaments.map((tournament) => (
            <option key={tournament._id} value={tournament._id}>
              {tournament.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.buttonContainer}>
        <button
          type="button"
          className={styles.backButton}
          onClick={handleBack}
        >
          Back
        </button>

        <button
          type="button"
          className={styles.nextButton}
          onClick={() => {
            if (formData.tournamentId) {
              handleNext();
            }
          }}
          disabled={!formData.tournamentId}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RegisterPageTournament;

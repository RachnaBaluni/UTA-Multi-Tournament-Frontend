import React from "react";

const RegisterPageTournament = ({
  formData,
  setFormData,
  handleNext,
  handleBack,
  tournaments,
}) => {
  return (
    <div>
      <h2>Select Tournament</h2>

      <div>
        <label htmlFor="tournament">Choose Tournament</label>

        <select
          id="tournament"
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

      <div>
        <button onClick={handleBack}>Back</button>

        <button
          onClick={() => {
            if (formData.tournamentId) {
              handleNext();
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RegisterPageTournament;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./PlayerInfo.module.css";

const PlayerInfo = () => {
  const user = useSelector((state) => state.user.user);
  console.log("PROFILE USER:", user);
  console.log("CURRENT USER ID:", user?._id);
  console.log("CURRENT USER TYPE:", user?.type);

  const [showTournaments, setShowTournaments] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [registeredTournaments, setRegisteredTournaments] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(false);

  const BACKEND = import.meta.env.VITE_APP_BACKEND_URL;

  const fetchTournamentData = async () => {
    try {
      setLoadingTournaments(true);

      const [tournamentResponse, registeredResponse] = await Promise.all([
        axios.get(`${BACKEND}/api/tournaments`),
        axios.get(`${BACKEND}/api/teams/${user._id}`),
      ]);

      const registeredTeams = registeredResponse.data.success
        ? registeredResponse.data.data
        : [];
      console.log("REGISTERED TEAMS:", registeredTeams);

      setRegisteredTournaments(registeredTeams);

      const registeredTournamentIds = new Set(
        registeredTeams
          .map((team) => team.eventId?.tournamentId?._id?.toString())
          .filter(Boolean),
      );
      console.log("REGISTERED TOURNAMENT IDS:", [...registeredTournamentIds]);

      const availableTournaments = tournamentResponse.data.success
        ? tournamentResponse.data.data.filter(
            (tournament) =>
              (tournament.status === "Upcoming" ||
                tournament.status === "Active") &&
              !registeredTournamentIds.has(tournament._id?.toString()),
          )
        : [];
      console.log("AVAILABLE TOURNAMENTS:", availableTournaments);

      setTournaments(availableTournaments);
    } catch (error) {
      console.error("FETCH TOURNAMENT DATA ERROR:", error);
      setTournaments([]);
      setRegisteredTournaments([]);
    } finally {
      setLoadingTournaments(false);
    }
  };

  useEffect(() => {
    if (showTournaments && user?._id) {
      fetchTournamentData();
    }
  }, [showTournaments, user?._id]);

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>My Profile</h1>
          <p>View your personal and tournament information</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className={styles.profileCard}>
        <div className={styles.profileTitle}>
          <h2>Personal Details</h2>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span>Name</span>
            <strong>{user.name || "-"}</strong>
          </div>

          <div className={styles.detailItem}>
            <span>Email</span>
            <strong>{user.email || user.emailAddress || "-"}</strong>
          </div>

          <div className={styles.detailItem}>
            <span>Phone Number</span>
            <strong>
              {user.number ||
                user.contactNumber ||
                user.generalContactPhone ||
                "-"}
            </strong>
          </div>

          {user.type === "Player" && (
            <>
              <div className={styles.detailItem}>
                <span>Date of Birth</span>
                <strong>{user.dob || "-"}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>City</span>
                <strong>{user.city || "-"}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Shirt Size</span>
                <strong>{user.shirtSize || "-"}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Short Size</span>
                <strong>{user.shortSize || "-"}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Food Preference</span>
                <strong>{user.foodPref || "-"}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Accommodation</span>
                <strong>{user.stay || "-"}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Fee Status</span>
                <strong className={user.feePaid ? styles.paid : styles.notPaid}>
                  {user.feePaid ? "Paid" : "Not Paid"}
                </strong>
              </div>
            </>
          )}

          {user.type === "Coach" && (
            <>
              <div className={styles.detailItem}>
                <span>Date of Birth</span>
                <strong>{user.dob || "-"}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Gender</span>
                <strong>{user.gender || "-"}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Address</span>
                <strong>{user.address || "-"}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Experience</span>
                <strong>{user.experience ?? "-"} years</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Academy</span>
                <strong>{user.academy || "-"}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Academy Phone</span>
                <strong>{user.academyPhone || "-"}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Academy Email</span>
                <strong>{user.academyEmail || "-"}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Status</span>
                <strong>{user.status || "-"}</strong>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tournament Section */}
      <div className={styles.tournamentCard}>
        <div>
          <h2>🎾 Participate in a Tournament</h2>
          <p>
            Want to participate in another tournament? Check the available
            tournaments and register yourself.
          </p>
        </div>

        <button
          className={styles.participateBtn}
          onClick={() => setShowTournaments(!showTournaments)}
        >
          {showTournaments ? "Hide Tournaments" : "Participate in Tournament"}
        </button>
      </div>
      {/* Already Registered Tournaments */}
      {registeredTournaments.length > 0 && (
        <div className={styles.tournamentList}>
          <h2>Already Registered Tournaments</h2>

          {registeredTournaments.map((team) => {
            const tournament = team.eventId?.tournamentId;
            const event = team.eventId;

            const currentUserId = user?._id?.toString();

            const isPartner1 = team.partner1?._id?.toString() === currentUserId;

            const partner = isPartner1 ? team.partner2 : team.partner1;

            return (
              <div key={team._id} className={styles.tournamentItem}>
                <h3>{tournament?.name || "Tournament"}</h3>

                <p>
                  <strong>Event:</strong> {event?.name || "-"}
                </p>

                <p>
                  <strong>Start Date:</strong>{" "}
                  {tournament?.startDate
                    ? new Date(tournament.startDate).toLocaleDateString()
                    : "-"}
                </p>

                <p>
                  <strong>End Date:</strong>{" "}
                  {tournament?.endDate
                    ? new Date(tournament.endDate).toLocaleDateString()
                    : "-"}
                </p>

                <p>
                  <strong>My Team:</strong> {user.name || "-"}
                </p>

                <p>
                  <strong>Partner:</strong> {partner?.name || "No Partner"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className={styles.paid}>Already Registered</span>
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Tournament List */}
      {showTournaments && (
        <div className={styles.tournamentList}>
          <h2>Available Tournaments</h2>

          {loadingTournaments ? (
            <div className={styles.loading}>Loading tournaments...</div>
          ) : tournaments.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No tournaments available right now.</p>
            </div>
          ) : (
            tournaments.map((tournament) => (
              <div key={tournament._id}>
                <h3>{tournament.name}</h3>

                <p>
                  Start Date:{" "}
                  {tournament.startDate
                    ? new Date(tournament.startDate).toLocaleDateString()
                    : "-"}
                </p>

                <p>
                  End Date:{" "}
                  {tournament.endDate
                    ? new Date(tournament.endDate).toLocaleDateString()
                    : "-"}
                </p>

                <button
                  className={styles.participateBtn}
                  onClick={() => {
                    console.log("Selected Tournament:", tournament);
                    console.log("Selected Tournament ID:", tournament._id);
                  }}
                >
                  Participate
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerInfo;

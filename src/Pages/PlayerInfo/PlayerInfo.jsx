import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./PlayerInfo.module.css";

const PlayerInfo = () => {
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.user.user);
  const user = reduxUser?.user || reduxUser;
  const playerType = reduxUser?.playerType || user?.playerType;
  const [showTournaments, setShowTournaments] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(false);
  const [myTournamentRegistrations, setMyTournamentRegistrations] = useState(
    [],
  );
  const [loadingMyTournaments, setLoadingMyTournaments] = useState(false);

  const BACKEND = import.meta.env.VITE_APP_BACKEND_URL;

  const fetchMyTournamentRegistrations = async () => {
    if (!user?._id) return;

    try {
      setLoadingMyTournaments(true);

      const response = await axios.get(
        `${BACKEND}/api/player/tournament-registrations/${user._id}`,
      );

      if (response.data.success) {
        setMyTournamentRegistrations(response.data.data || []);
      } else {
        setMyTournamentRegistrations([]);
      }
    } catch (error) {
      console.error("FETCH MY TOURNAMENT REGISTRATIONS ERROR:", error);
      setMyTournamentRegistrations([]);
    } finally {
      setLoadingMyTournaments(false);
    }
  };

  const fetchTournaments = async () => {
    try {
      setLoadingTournaments(true);

      const response = await axios.get(`${BACKEND}/api/tournaments`);

      if (response.data.success) {
        console.log("🔥 ALL TOURNAMENTS:", response.data.data);

        response.data.data.forEach((tournament) => {
          console.log(
            "🔥 TOURNAMENT:",
            tournament.name,
            "TYPE:",
            tournament.type,
          );
        });
        // IDs of already participated tournaments
        const participatedTournamentIds = new Set(
          myTournamentRegistrations
            .map((registration) => registration.tournament?._id)
            .filter(Boolean)
            .map((id) => id.toString()),
        );

        const availableTournaments = response.data.data.filter((tournament) => {
          const tournamentId = tournament._id?.toString();

          // Completed tournaments hide
          const isCompleted = tournament.status?.toLowerCase() === "completed";
          const isNormalTournament =
            tournament.type?.toLowerCase() === "normal";
          // Already participated tournaments hide
          const alreadyParticipated =
            participatedTournamentIds.has(tournamentId);

          return !isCompleted && !alreadyParticipated;
        });

        setTournaments(availableTournaments);
      } else {
        setTournaments([]);
      }
    } catch (error) {
      console.error("FETCH TOURNAMENTS ERROR:", error);
      setTournaments([]);
    } finally {
      setLoadingTournaments(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchMyTournamentRegistrations();
    }
  }, [user?._id]);

  console.log("PLAYER INFO REDUX USER 👉", user);
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
          {/* Common fields */}
          <div className={styles.detailItem}>
            <span>Name</span>
            <strong>{user.name || "-"}</strong>
          </div>

          <div className={styles.detailItem}>
            <span>Email</span>
            <strong>{user.email || user.emailAddress || "-"}</strong>
          </div>

          {/* MEMBER PLAYER */}
          {playerType === "MemberPlayer" && (
            <>
              <div className={styles.detailItem}>
                <span>Phone Number</span>
                <strong>{user.number || "-"}</strong>
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
                <strong>{user.experience || "-"}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Academy</span>
                <strong>{user.academy || "-"}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Status</span>
                <strong>{user.status || "-"}</strong>
              </div>
            </>
          )}

          {/* NORMAL PLAYER */}
          {playerType === "NormalPlayer" && (
            <>
              <div className={styles.detailItem}>
                <span>WhatsApp Number</span>
                <strong>{user.whatsappNumber || "-"}</strong>
              </div>

              <div className={styles.detailItem}>
                <span>Date of Birth</span>
                <strong>
                  {user.dob ? new Date(user.dob).toLocaleDateString() : "-"}
                </strong>
              </div>

              <div className={styles.detailItem}>
                <span>City</span>
                <strong>{user.city || "-"}</strong>
              </div>
            </>
          )}

          {/* COACH */}
          {user.type === "Coach" && (
            <>
              <div className={styles.detailItem}>
                <span>Phone Number</span>
                <strong>
                  {user.number ||
                    user.contactNumber ||
                    user.generalContactPhone ||
                    "-"}
                </strong>
              </div>

              <div className={styles.detailItem}>
                <span>Date of Birth</span>
                <strong>
                  {user.dob ? new Date(user.dob).toLocaleDateString() : "-"}
                </strong>
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
                <strong>{user.experience ?? "-"}</strong>
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

      {/* My Tournament Details */}
      <div className={styles.profileCard}>
        <div className={styles.profileTitle}>
          <h2>Tournament Details</h2>
        </div>

        {loadingMyTournaments ? (
          <div className={styles.loading}>Loading tournament details...</div>
        ) : myTournamentRegistrations.length === 0 ? (
          <div className={styles.emptyState}>
            <p>You have not participated in any tournament yet.</p>
          </div>
        ) : (
          <div>
            {myTournamentRegistrations.map((registration) => {
              const tournament = registration.tournament;

              return (
                <div
                  key={registration._id}
                  className={styles.tournamentDetails}
                >
                  <h3>{tournament?.name || "Tournament"}</h3>

                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <span>Start Date</span>
                      <strong>
                        {tournament?.startDate
                          ? new Date(tournament.startDate).toLocaleDateString()
                          : "-"}
                      </strong>
                    </div>

                    <div className={styles.detailItem}>
                      <span>End Date</span>
                      <strong>
                        {tournament?.endDate
                          ? new Date(tournament.endDate).toLocaleDateString()
                          : "-"}
                      </strong>
                    </div>
                  </div>

                  {/* Events */}
                  <h4>Events</h4>

                  {registration.events?.length > 0 ? (
                    <div className={styles.eventsList}>
                      {registration.events.map((event) => (
                        <div key={event.teamId} className={styles.eventCard}>
                          <div className={styles.detailItem}>
                            <span>Event</span>
                            <strong>{event.eventName || "-"}</strong>
                          </div>

                          <div className={styles.detailItem}>
                            <span>Event Date</span>
                            <strong>
                              {event.eventDate
                                ? new Date(event.eventDate).toLocaleDateString()
                                : "-"}
                            </strong>
                          </div>

                          <div className={styles.detailItem}>
                            <span>Partner / Team</span>
                            <strong>
                              {event.partner?.name || "No Partner"}
                            </strong>
                          </div>

                          <div className={styles.detailItem}>
                            <span>Showing</span>
                            <strong>{event.eventShowing ? "Yes" : "No"}</strong>
                          </div>

                          <div className={styles.detailItem}>
                            <span>Rules</span>
                            <strong>
                              {event.eventRules?.length > 0
                                ? event.eventRules.join(", ")
                                : "No rules specified"}
                            </strong>
                          </div>

                          {registration.registrationFields?.foodPreference && (
                            <div className={styles.detailItem}>
                              <span>Food Preference</span>
                              <strong>{registration.foodPref || "-"}</strong>
                            </div>
                          )}

                          {registration.registrationFields?.shirtSize && (
                            <div className={styles.detailItem}>
                              <span>Shirt Size</span>
                              <strong>{registration.shirtSize || "-"}</strong>
                            </div>
                          )}

                          {registration.registrationFields?.accommodation && (
                            <div className={styles.detailItem}>
                              <span>Accommodation</span>
                              <strong>
                                {registration.accommodation === true
                                  ? "Yes"
                                  : registration.accommodation === false
                                    ? "No"
                                    : "-"}
                              </strong>
                            </div>
                          )}

                          {registration.registrationFields?.feePaid && (
                            <div className={styles.detailItem}>
                              <span>Fee Paid</span>
                              <strong>
                                {registration.feePaid === true
                                  ? "Yes"
                                  : registration.feePaid === false
                                    ? "No"
                                    : "-"}
                              </strong>
                            </div>
                          )}

                          {registration.registrationFields
                            ?.transactionDetails && (
                            <div className={styles.detailItem}>
                              <span>Transaction Details</span>
                              <strong>
                                {registration.transactionDetails || "-"}
                              </strong>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No event information available.</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
          onClick={() => {
            const nextState = !showTournaments;
            setShowTournaments(nextState);

            if (nextState) {
              fetchTournaments();
            }
          }}
        >
          {showTournaments ? "Hide Tournaments" : "Participate in Tournament"}
        </button>
      </div>

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
              <div key={tournament._id} className={styles.tournamentItem}>
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
                    navigate(
                      `/tournaments/register?tournamentId=${tournament._id}`,
                    );
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

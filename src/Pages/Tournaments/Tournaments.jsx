import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Tournaments.module.css";
import Footer from "../../Components/Footer/Footer";

export default function Tournaments() {
  const navigate = useNavigate();

  // ============================
  // STATES
  // ============================
  const [tournaments, setTournaments] = useState([]);
  const [mainEvents, setMainEvents] = useState([]);
  const [venue, setVenue] = useState([]);

  const [selectedTournament, setSelectedTournament] = useState(null);

  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [selectedAction, setSelectedAction] = useState("");

  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

  // ============================
  // FETCH TOURNAMENTS
  // ============================
  const getTournaments = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/tournaments/`);

      if (res.data.success) {
        console.log("ALL TOURNAMENTS:", res.data.data);
        setTournaments(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      setTournaments([]);
    }
  };

  // ============================
  // FETCH MAIN EVENTS
  // ============================
  const getMainEvents = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/main-events`);

      console.log("MAIN EVENTS RESPONSE:", res.data);

      if (res.data.success) {
        setMainEvents(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching main events:", error);
      setMainEvents([]);
    }
  };

  // ============================
  // FETCH VENUE
  // ============================
  const getVenue = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/venue/`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        setVenue(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching venue:", error);
      setVenue([]);
    }
  };

  // ============================
  // INITIAL FETCH
  // ============================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([getTournaments(), getMainEvents(), getVenue()]);

      setLoading(false);
    };

    loadData();

    window.scrollTo(0, 0);
  }, []);

  // ============================
  // MERGE ALL
  // NORMAL + DISPLAY + MAIN EVENTS
  // ============================
  const allTournaments = [
    ...tournaments.map((item) => ({
      ...item,
      itemType: "tournament",
    })),

    ...mainEvents.map((item) => ({
      ...item,
      itemType: "mainEvent",
      type: "main",
    })),
  ];

  // ============================
  // OPEN TOURNAMENT DETAILS
  // ============================
  const handleTournamentClick = (tournament) => {
    setSelectedTournament(tournament);

    setTimeout(() => {
      const element = document.getElementById("tournamentDetails");

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  // ============================
  // OPEN ACTION SELECTOR
  // ============================
  const openTournamentSelector = (action) => {
    setSelectedAction(action);
    setSelectedTournamentId("");
    setShowTournamentModal(true);
  };

  // ============================
  // CONTINUE ACTION
  // ============================
  const continueToTournament = () => {
    if (!selectedTournamentId) {
      alert("Please select a tournament.");
      return;
    }

    const routes = {
      players: "/tournaments/registered-players",
      teams: "/tournaments/registered-teams",
      draws: "/tournaments/draws",
      results: "/tournaments/results",
      viewresults: "/tournaments/viewresults",
      orderOfPlay: "/tournaments/view-order-play",
    };

    const route = routes[selectedAction];

    if (!route) {
      return;
    }

    setShowTournamentModal(false);

    navigate(`${route}?tournamentId=${selectedTournamentId}`);
  };

  // ============================
  // FORMAT DATE
  // ============================
  const formatDate = (date) => {
    if (!date) return "Date not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date not available";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================
  // GET DATE
  // ============================
  const getTournamentDate = (item) => {
    if (item.itemType === "mainEvent") {
      return item.date;
    }

    if (item.startDate) {
      return item.startDate;
    }

    if (item.date) {
      return item.date;
    }

    return null;
  };

  // ============================
  // GET LOCATION
  // ============================
  const getLocation = (item) => {
    return item.location || "Dehradun";
  };

  // ============================
  // VENUE CONTENT
  // ============================
  const renderVenue = (item) => {
    const venueName = item.venue || item.name;
    const address = item.address;

    return (
      <div key={item._id} className={styles.venueCard}>
        {venueName && <h3 className={styles.venueTitle}>{venueName}</h3>}

        {address && <p className={styles.venueAddress}>{address}</p>}

        {/* OLD VENUE API */}
        {item.mapLink && (
          <div className={styles.mapContainer}>
            <iframe
              src={item.mapLink}
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={styles.mapFrame}
              title={venueName || "Tournament Venue"}
            />
          </div>
        )}

        {/* NEW VENUE SCHEMA */}
        {!item.venue && !item.address && item.value && (
          <div
            className={styles.venueContent}
            dangerouslySetInnerHTML={{
              __html: item.value,
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className={styles.rootContainer}>
      {/* =====================================================
          HEADER REMOVED
          Header already comes from Layout/main.jsx
      ====================================================== */}

      <main className={styles.mainContentWrapper}>
        <div className={styles.contentContainer}>
          {/* =====================================================
              ALL TOURNAMENTS
          ====================================================== */}
          <section className={styles.upcomingTournaments} id="tournamentList">
            <h1 className={styles.sectionTitle}>All Tournaments</h1>

            {loading ? (
              <div className={styles.noResults}>Loading tournaments...</div>
            ) : allTournaments.length === 0 ? (
              <div className={styles.noResults}>No tournaments available.</div>
            ) : (
              <div className={styles.tournamentGrid}>
                {allTournaments.map((tournament) => (
                  <div
                    key={`${tournament.itemType}-${tournament._id}`}
                    className={styles.tournamentCard}
                    onClick={() => handleTournamentClick(tournament)}
                  >
                    {/* TOURNAMENT NAME */}
                    <div className={styles.tournamentNameWrapper}>
                      <h3 className={styles.tournamentName}>
                        {tournament.name}
                      </h3>

                      {tournament.itemType === "mainEvent" && (
                        <span className={styles.eventBadge}>Main Event</span>
                      )}

                      {tournament.itemType === "tournament" &&
                        tournament.type === "display" && (
                          <span className={styles.eventBadge}>Display</span>
                        )}
                    </div>

                    {/* DATE + LOCATION */}
                    <div className={styles.tournamentInfo}>
                      <p>
                        <strong>Date:</strong>{" "}
                        <span>{formatDate(getTournamentDate(tournament))}</span>
                      </p>

                      <p>
                        <strong>Location:</strong>{" "}
                        <span>{getLocation(tournament)}</span>
                      </p>
                    </div>

                    {/* VIEW DETAILS */}
                    <button
                      type="button"
                      className={styles.viewDetailsButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTournamentClick(tournament);
                      }}
                    >
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* =====================================================
              TOURNAMENT ACTIONS
              OLD FLOW PRESERVED
          ====================================================== */}
          <section className={styles.actionSection}>
            <h2 className={styles.actionHeading}>Tournament Information</h2>

            <p className={styles.actionDescription}>
              Select an option below to view tournament information.
            </p>

            <div className={styles.actionButtons}>
              {/* REGISTERED PLAYERS */}
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => openTournamentSelector("players")}
              >
                View Registered Players
              </button>

              {/* REGISTERED TEAMS */}
              <button
                type="button"
                className={styles.actionButtonGrey}
                onClick={() => openTournamentSelector("teams")}
              >
                View Registered Teams
              </button>

              {/* DRAWS */}
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => openTournamentSelector("draws")}
              >
                View Draws
              </button>

              {/* RESULTS */}
              <button
                type="button"
                className={styles.actionButtonGrey}
                onClick={() => openTournamentSelector("results")}
              >
                View Results
              </button>

              {/* RESULTS 2 */}
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => openTournamentSelector("viewresults")}
              >
                View Results 2
              </button>

              {/* ORDER OF PLAY */}
              <button
                type="button"
                className={styles.actionButtonGrey}
                onClick={() => openTournamentSelector("orderOfPlay")}
              >
                Order Of Play
              </button>
            </div>
          </section>

          {/* =====================================================
              SELECTED TOURNAMENT DETAILS
              ONLY SHOW AFTER CLICK
          ====================================================== */}
          {selectedTournament && (
            <section className={styles.detailsSection} id="tournamentDetails">
              <h2 className={styles.detailsHeading}>Tournament Details</h2>

              <div className={styles.detailsCard}>
                {/* NAME */}
                <div className={styles.detailsNameBox}>
                  <h2 className={styles.detailsTitle}>
                    {selectedTournament.name}
                  </h2>

                  {selectedTournament.itemType === "mainEvent" && (
                    <span className={styles.detailsBadge}>Main Event</span>
                  )}

                  {selectedTournament.itemType === "tournament" &&
                    selectedTournament.type === "display" && (
                      <span className={styles.detailsBadge}>
                        Display Tournament
                      </span>
                    )}
                </div>

                {/* DETAILS GRID */}
                <div className={styles.detailsGrid}>
                  <div>
                    <strong>Date</strong>
                    <p>{formatDate(getTournamentDate(selectedTournament))}</p>
                  </div>

                  <div>
                    <strong>Location</strong>
                    <p>{getLocation(selectedTournament)}</p>
                  </div>

                  {selectedTournament.organizer && (
                    <div>
                      <strong>Organizer</strong>
                      <p>{selectedTournament.organizer}</p>
                    </div>
                  )}

                  {selectedTournament.director && (
                    <div>
                      <strong>Tournament Director</strong>
                      <p>{selectedTournament.director}</p>
                    </div>
                  )}

                  {selectedTournament.directorPhone && (
                    <div>
                      <strong>Contact</strong>
                      <p>{selectedTournament.directorPhone}</p>
                    </div>
                  )}
                </div>

                {/* DESCRIPTION */}
                {selectedTournament.description && (
                  <div className={styles.descriptionBlock}>
                    <h3>Description</h3>

                    <p>{selectedTournament.description}</p>
                  </div>
                )}

                {/* RULES */}
                {selectedTournament.rules && (
                  <div className={styles.descriptionBlock}>
                    <h3>Rules</h3>

                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedTournament.rules,
                      }}
                    />
                  </div>
                )}

                {/* REGISTER */}
                {selectedTournament.itemType === "tournament" && (
                  <div className={styles.registerWrapper}>
                    <Link
                      to={`/tournaments/register?tournamentId=${selectedTournament._id}`}
                      className={styles.registerButton}
                    >
                      Register Now
                    </Link>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* =====================================================
              VENUE
              ALWAYS VISIBLE
          ====================================================== */}
          <section className={styles.venueSection}>
            <h2 className={styles.venueSectionTitle}>Venue Information</h2>

            {venue.length === 0 ? (
              <div className={styles.noResults}>
                Venue information not available.
              </div>
            ) : (
              <div className={styles.venueGrid}>
                {venue.map((item) =>
                  item.showing !== false ? renderVenue(item) : null,
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* =====================================================
          TOURNAMENT SELECT MODAL
          OLD FLOW PRESERVED
      ====================================================== */}
      {showTournamentModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowTournamentModal(false)}
        >
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2>Select Tournament</h2>

            <p>Select the tournament you want to view.</p>

            <select
              value={selectedTournamentId}
              onChange={(e) => setSelectedTournamentId(e.target.value)}
              className={styles.tournamentSelect}
            >
              <option value="">Select Tournament</option>

              {allTournaments.map((tournament) => (
                <option
                  key={`select-${tournament.itemType}-${tournament._id}`}
                  value={tournament._id}
                >
                  {tournament.name}

                  {tournament.itemType === "mainEvent"
                    ? " (Main Event)"
                    : tournament.type === "display"
                      ? " (Display)"
                      : ""}
                </option>
              ))}
            </select>

            <div className={styles.modalButtons}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowTournamentModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className={styles.continueButton}
                onClick={continueToTournament}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Tournaments.module.css";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

export default function Tournaments() {
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState([]);
  const [mainEvents, setMainEvents] = useState([]);
  const [venue, setVenue] = useState([]);

  // Selected tournament for detail modal
  const [selectedTournament, setSelectedTournament] = useState(null);

  // Existing action modal
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [selectedAction, setSelectedAction] = useState("");

  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

  /* =========================================================
     FETCH TOURNAMENTS
  ========================================================= */

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

  /* =========================================================
     FETCH MAIN EVENTS
  ========================================================= */

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

  /* =========================================================
     FETCH VENUE
  ========================================================= */

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

  /* =========================================================
     INITIAL FETCH
  ========================================================= */

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([getTournaments(), getMainEvents(), getVenue()]);

      setLoading(false);
    };

    loadData();
    window.scrollTo(0, 0);
  }, []);

  /* =========================================================
     MERGE TOURNAMENTS + MAIN EVENTS
  ========================================================= */

  const allTournaments = [
    ...tournaments.map((item) => ({
      ...item,
      itemType: "tournament",
    })),

    ...mainEvents.map((item) => ({
      ...item,
      itemType: "mainEvent",
    })),
  ];

  /* =========================================================
     OPEN DETAIL MODAL
  ========================================================= */

  const handleTournamentClick = (tournament) => {
    setSelectedTournament(tournament);
    document.body.style.overflow = "hidden";
  };

  /* =========================================================
     CLOSE DETAIL MODAL
  ========================================================= */

  const closeTournamentDetails = () => {
    setSelectedTournament(null);
    document.body.style.overflow = "";
  };

  /* =========================================================
     ESC KEY
  ========================================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeTournamentDetails();
      }
    };

    if (selectedTournament) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedTournament]);

  /* =========================================================
     ACTION SELECTOR
  ========================================================= */

  const openTournamentSelector = (action) => {
    setSelectedAction(action);
    setSelectedTournamentId("");
    setShowTournamentModal(true);
  };

  /* =========================================================
     CONTINUE ACTION
  ========================================================= */

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

    if (!route) return;

    setShowTournamentModal(false);

    navigate(`${route}?tournamentId=${selectedTournamentId}`);
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

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

  /* =========================================================
     GET DATE
  ========================================================= */

  const getTournamentDate = (item) => {
    if (item.startDate) {
      return item.startDate;
    }

    if (item.date) {
      return item.date;
    }

    return null;
  };

  /* =========================================================
     LOCATION
  ========================================================= */

  const getLocation = (item) => {
    return item.location || item.venue || item.city || "Dehradun";
  };

  /* =========================================================
     CHECK VALUE
  ========================================================= */

  const hasValue = (value) => {
    if (value === undefined || value === null) {
      return false;
    }

    if (typeof value === "string" && value.trim() === "") {
      return false;
    }

    if (Array.isArray(value) && value.length === 0) {
      return false;
    }

    return true;
  };

  /* =========================================================
     DISPLAY VALUE
  ========================================================= */

  const displayValue = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (typeof item === "object" && item !== null) {
            return (
              item.name ||
              item.title ||
              item.category ||
              item.event ||
              JSON.stringify(item)
            );
          }

          return item;
        })
        .join(", ");
    }

    if (typeof value === "object" && value !== null) {
      return value.name || value.title || value.value || JSON.stringify(value);
    }

    return value;
  };

  /* =========================================================
     CATEGORY
  ========================================================= */

  const getCategory = (item) => {
    return (
      item.category ||
      item.categories ||
      item.ageCategory ||
      item.categoryName ||
      item.eventCategory
    );
  };

  /* =========================================================
     EVENTS
  ========================================================= */

  const getEvents = (item) => {
    return (
      item.events ||
      item.event ||
      item.eventName ||
      item.eventCategories ||
      item.eventList
    );
  };

  /* =========================================================
     PRIZE
  ========================================================= */

  const getPrize = (item) => {
    return (
      item.prize ||
      item.prizeMoney ||
      item.prizePool ||
      item.totalPrize ||
      item.prizeAmount
    );
  };

  /* =========================================================
     VENUE
  ========================================================= */

  const renderVenue = (item) => {
    const venueName = item.venue || item.name;
    const address = item.address;

    return (
      <div key={item._id} className={styles.venueCard}>
        {venueName && <h3 className={styles.venueTitle}>{venueName}</h3>}

        {address && <p className={styles.venueAddress}>{address}</p>}

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
      <Header />

      <main className={styles.mainContentWrapper}>
        <div className={styles.contentContainer}>
          {/* =================================================
              ALL TOURNAMENTS
          ================================================= */}

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
                  >
                    <h3 className={styles.tournamentName}>{tournament.name}</h3>

                    <div className={styles.tournamentUnderline} />

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

                    <button
                      type="button"
                      className={styles.viewDetailsButton}
                      onClick={() => handleTournamentClick(tournament)}
                    >
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* =================================================
              TOURNAMENT ACTIONS
          ================================================= */}

          <section className={styles.actionSection}>
            <h2 className={styles.sectionTitle}>Tournament Information</h2>

            <p className={styles.actionDescription}>
              Select an option below to view tournament information.
            </p>

            <div className={styles.actionButtons}>
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => openTournamentSelector("players")}
              >
                View Registered Players
              </button>

              <button
                type="button"
                className={styles.actionButtonGrey}
                onClick={() => openTournamentSelector("teams")}
              >
                View Registered Teams
              </button>

              <button
                type="button"
                className={styles.actionButton}
                onClick={() => openTournamentSelector("draws")}
              >
                View Draws
              </button>

              <button
                type="button"
                className={styles.actionButtonGrey}
                onClick={() => openTournamentSelector("results")}
              >
                View Results
              </button>

              <button
                type="button"
                className={styles.actionButton}
                onClick={() => openTournamentSelector("viewresults")}
              >
                View Results 2
              </button>

              <button
                type="button"
                className={styles.actionButtonGrey}
                onClick={() => openTournamentSelector("orderOfPlay")}
              >
                Order Of Play
              </button>
            </div>
          </section>

          {/* =================================================
              VENUE
          ================================================= */}

          <section className={styles.venueSection}>
            <h2 className={styles.sectionTitle}>
              Venue & Important Information
            </h2>

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
          TOURNAMENT DETAIL MODAL
      ===================================================== */}

      {selectedTournament && (
        <div
          className={styles.detailModalOverlay}
          onClick={closeTournamentDetails}
        >
          <div
            className={styles.detailModal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}

            <div className={styles.detailModalHeader}>
              <div>
                <div className={styles.detailModalLabel}>
                  TOURNAMENT DETAILS
                </div>

                <h2 className={styles.detailModalTitle}>
                  {selectedTournament.name}
                </h2>

                <div className={styles.modalBlueLine} />
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={closeTournamentDetails}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* MAIN INFO */}

            <div className={styles.modalMainInfo}>
              <div className={styles.modalInfoBox}>
                <span>DATE</span>
                <strong>
                  {formatDate(getTournamentDate(selectedTournament))}
                </strong>
              </div>

              <div className={styles.modalInfoBox}>
                <span>LOCATION</span>
                <strong>{getLocation(selectedTournament)}</strong>
              </div>

              {selectedTournament.status && (
                <div className={styles.modalInfoBox}>
                  <span>STATUS</span>
                  <strong className={styles.blueText}>
                    {selectedTournament.status}
                  </strong>
                </div>
              )}
            </div>

            {/* DETAILS GRID */}

            <div className={styles.modalDetailsGrid}>
              {hasValue(getCategory(selectedTournament)) && (
                <div className={styles.modalDetailItem}>
                  <span>Category</span>
                  <strong>
                    {displayValue(getCategory(selectedTournament))}
                  </strong>
                </div>
              )}

              {hasValue(getEvents(selectedTournament)) && (
                <div className={styles.modalDetailItem}>
                  <span>Events</span>
                  <strong>{displayValue(getEvents(selectedTournament))}</strong>
                </div>
              )}

              {hasValue(getPrize(selectedTournament)) && (
                <div className={styles.modalDetailItem}>
                  <span>Prize Money</span>
                  <strong className={styles.blueText}>
                    {displayValue(getPrize(selectedTournament))}
                  </strong>
                </div>
              )}

              {selectedTournament.startDate && (
                <div className={styles.modalDetailItem}>
                  <span>Start Date</span>
                  <strong>{formatDate(selectedTournament.startDate)}</strong>
                </div>
              )}

              {selectedTournament.endDate && (
                <div className={styles.modalDetailItem}>
                  <span>End Date</span>
                  <strong>{formatDate(selectedTournament.endDate)}</strong>
                </div>
              )}

              {hasValue(selectedTournament.organizer) && (
                <div className={styles.modalDetailItem}>
                  <span>Organizer</span>
                  <strong>{selectedTournament.organizer}</strong>
                </div>
              )}

              {hasValue(selectedTournament.director) && (
                <div className={styles.modalDetailItem}>
                  <span>Tournament Director</span>
                  <strong>{selectedTournament.director}</strong>
                </div>
              )}

              {hasValue(selectedTournament.directorPhone) && (
                <div className={styles.modalDetailItem}>
                  <span>Contact</span>
                  <strong>{selectedTournament.directorPhone}</strong>
                </div>
              )}
            </div>

            {/* DESCRIPTION */}

            {hasValue(selectedTournament.description) && (
              <div className={styles.modalDescription}>
                <h3>Description</h3>

                <p>{selectedTournament.description}</p>
              </div>
            )}

            {/* RULES */}

            {hasValue(selectedTournament.rules) && (
              <div className={styles.modalDescription}>
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
              <div className={styles.modalRegisterArea}>
                <Link
                  to={`/tournaments/register?tournamentId=${selectedTournament._id}`}
                  className={styles.registerButton}
                  onClick={closeTournamentDetails}
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          OLD TOURNAMENT SELECT MODAL
      ===================================================== */}

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

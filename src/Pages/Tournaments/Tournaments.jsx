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

  const [selectedTournament, setSelectedTournament] = useState(null);

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
     INITIAL LOAD
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
      type: "main",
    })),
  ];

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
    if (item.itemType === "mainEvent") {
      return item.date;
    }

    return item.startDate || item.date || null;
  };

  /* =========================================================
     GET LOCATION
  ========================================================= */

  const getLocation = (item) => {
    return item.location || item.venue || "Dehradun";
  };

  /* =========================================================
     OPEN DETAILS MODAL
  ========================================================= */

  const handleTournamentClick = (tournament) => {
    console.log("SELECTED TOURNAMENT:", tournament);

    setSelectedTournament(tournament);
  };

  /* =========================================================
     CLOSE DETAILS MODAL
  ========================================================= */

  const closeDetailsModal = () => {
    setSelectedTournament(null);
  };

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
              allowFullScreen
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

  /* =========================================================
     DISPLAY ARRAY / OBJECT VALUES
  ========================================================= */

  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return null;
    }

    if (Array.isArray(value)) {
      return (
        <div className={styles.detailList}>
          {value.map((item, index) => (
            <div key={index} className={styles.detailListItem}>
              {typeof item === "object"
                ? Object.values(item).join(" - ")
                : item}
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === "object") {
      return (
        <div className={styles.objectValue}>
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className={styles.objectRow}>
              <span>{formatLabel(key)}</span>

              <strong>
                {typeof val === "object" ? JSON.stringify(val) : String(val)}
              </strong>
            </div>
          ))}
        </div>
      );
    }

    return String(value);
  };

  /* =========================================================
     LABEL FORMATTER
  ========================================================= */

  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^./, (str) => str.toUpperCase());
  };

  /* =========================================================
     DETAILS FIELD HELPER
  ========================================================= */

  const getFirstValue = (item, keys) => {
    for (const key of keys) {
      if (item[key] !== undefined && item[key] !== null && item[key] !== "") {
        return item[key];
      }
    }

    return null;
  };

  return (
    <div className={styles.rootContainer}>
      <Header />

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
                  >
                    <div className={styles.cardTop}>
                      <div>
                        <h3 className={styles.tournamentName}>
                          {tournament.name}
                        </h3>

                        <div className={styles.titleUnderline} />
                      </div>
                    </div>

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

          {/* =====================================================
              TOURNAMENT ACTIONS
          ====================================================== */}

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

          {/* =====================================================
              VENUE
          ====================================================== */}

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

      {/* =========================================================
          TOURNAMENT DETAILS MODAL
      ========================================================= */}

      {selectedTournament && (
        <div className={styles.detailsModalOverlay} onClick={closeDetailsModal}>
          <div
            className={styles.detailsModal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE */}

            <button
              type="button"
              className={styles.closeDetailsButton}
              onClick={closeDetailsModal}
            >
              ×
            </button>

            {/* HEADER */}

            <div className={styles.modalHeader}>
              <div className={styles.modalSmallTitle}>TOURNAMENT DETAILS</div>

              <h2 className={styles.modalTournamentName}>
                {selectedTournament.name}
              </h2>

              <div className={styles.modalTitleUnderline} />
            </div>

            {/* BASIC INFORMATION */}

            <div className={styles.basicInfoGrid}>
              <div className={styles.infoBox}>
                <span>DATE</span>
                <strong>
                  {formatDate(getTournamentDate(selectedTournament))}
                </strong>
              </div>

              <div className={styles.infoBox}>
                <span>LOCATION</span>
                <strong>{getLocation(selectedTournament)}</strong>
              </div>
            </div>

            {/* =================================================
                CATEGORY
            ================================================= */}

            {getFirstValue(selectedTournament, [
              "category",
              "categories",
              "ageCategory",
              "eventCategory",
            ]) && (
              <div className={styles.modalDetailSection}>
                <div className={styles.modalDetailLabel}>Category</div>

                <div className={styles.modalDetailValue}>
                  {renderValue(
                    getFirstValue(selectedTournament, [
                      "category",
                      "categories",
                      "ageCategory",
                      "eventCategory",
                    ]),
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                EVENTS
            ================================================= */}

            {getFirstValue(selectedTournament, [
              "events",
              "event",
              "eventName",
              "eventCategories",
            ]) && (
              <div className={styles.modalDetailSection}>
                <div className={styles.modalDetailLabel}>Events</div>

                <div className={styles.modalDetailValue}>
                  {renderValue(
                    getFirstValue(selectedTournament, [
                      "events",
                      "event",
                      "eventName",
                      "eventCategories",
                    ]),
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                PRIZE
            ================================================= */}

            {getFirstValue(selectedTournament, [
              "prize",
              "prizes",
              "prizeMoney",
              "prizeAmount",
              "winningPrize",
            ]) && (
              <div className={styles.modalDetailSection}>
                <div className={styles.modalDetailLabel}>Prize</div>

                <div className={styles.prizeValue}>
                  {renderValue(
                    getFirstValue(selectedTournament, [
                      "prize",
                      "prizes",
                      "prizeMoney",
                      "prizeAmount",
                      "winningPrize",
                    ]),
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            {selectedTournament.description && (
              <div className={styles.modalDetailSection}>
                <div className={styles.modalDetailLabel}>Description</div>

                <div className={styles.descriptionText}>
                  {selectedTournament.description}
                </div>
              </div>
            )}

            {/* =================================================
                ORGANIZER
            ================================================= */}

            {selectedTournament.organizer && (
              <div className={styles.modalDetailSection}>
                <div className={styles.modalDetailLabel}>Organizer</div>

                <div className={styles.modalDetailValue}>
                  {selectedTournament.organizer}
                </div>
              </div>
            )}

            {/* =================================================
                DIRECTOR
            ================================================= */}

            {selectedTournament.director && (
              <div className={styles.modalDetailSection}>
                <div className={styles.modalDetailLabel}>
                  Tournament Director
                </div>

                <div className={styles.modalDetailValue}>
                  {selectedTournament.director}
                </div>
              </div>
            )}

            {/* =================================================
                CONTACT
            ================================================= */}

            {selectedTournament.directorPhone && (
              <div className={styles.modalDetailSection}>
                <div className={styles.modalDetailLabel}>Contact</div>

                <div className={styles.modalDetailValue}>
                  {selectedTournament.directorPhone}
                </div>
              </div>
            )}

            {/* =================================================
                STATUS
            ================================================= */}

            {selectedTournament.status && (
              <div className={styles.modalDetailSection}>
                <div className={styles.modalDetailLabel}>Status</div>

                <div className={styles.statusBadge}>
                  {selectedTournament.status}
                </div>
              </div>
            )}

            {/* =================================================
                REGISTER
            ================================================= */}

            {selectedTournament.itemType === "tournament" && (
              <div className={styles.modalRegisterWrapper}>
                <Link
                  to={`/tournaments/register?tournamentId=${selectedTournament._id}`}
                  className={styles.registerButton}
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          SELECT TOURNAMENT MODAL
      ========================================================= */}

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

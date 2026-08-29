import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Tournaments.module.css";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

export default function Tournaments() {
  const navigate = useNavigate();

  // =========================================================
  // STATES
  // =========================================================

  const [tournaments, setTournaments] = useState([]);
  const [mainEvents, setMainEvents] = useState([]);
  const [venue, setVenue] = useState([]);

  // Only stores which card is opened
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);

  // Tournament action modal
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [actionTournamentId, setActionTournamentId] = useState("");
  const [selectedAction, setSelectedAction] = useState("");

  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

  // =========================================================
  // FETCH TOURNAMENTS
  // =========================================================

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

  // =========================================================
  // FETCH MAIN EVENTS
  // =========================================================

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

  // =========================================================
  // FETCH VENUE
  // =========================================================

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

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([getTournaments(), getMainEvents(), getVenue()]);

      setLoading(false);
    };

    loadData();

    window.scrollTo(0, 0);
  }, []);

  // =========================================================
  // MERGE TOURNAMENTS + MAIN EVENTS
  // USER KO SAB TOURNAMENTS ME HI DIKHENGE
  // =========================================================

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

  // =========================================================
  // FORMAT DATE
  // =========================================================

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

  // =========================================================
  // GET DATE
  // =========================================================

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

  // =========================================================
  // GET LOCATION
  // =========================================================

  const getLocation = (item) => {
    return item.location || "Dehradun";
  };

  // =========================================================
  // VIEW DETAILS
  // SAME CARD ME OPEN/CLOSE
  // =========================================================

  const handleTournamentClick = (tournament) => {
    if (selectedTournamentId === tournament._id) {
      setSelectedTournamentId(null);
    } else {
      setSelectedTournamentId(tournament._id);
    }
  };

  // =========================================================
  // ACTION SELECTOR
  // =========================================================

  const openTournamentSelector = (action) => {
    setSelectedAction(action);
    setActionTournamentId("");
    setShowTournamentModal(true);
  };

  // =========================================================
  // CONTINUE ACTION
  // OLD FLOW PRESERVED
  // =========================================================

  const continueToTournament = () => {
    if (!actionTournamentId) {
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

    navigate(`${route}?tournamentId=${actionTournamentId}`);
  };

  // =========================================================
  // RENDER ARRAY / LIST DATA
  // =========================================================

  const renderArrayData = (data) => {
    if (!data) return null;

    if (Array.isArray(data)) {
      if (data.length === 0) return null;

      return (
        <ul className={styles.detailList}>
          {data.map((item, index) => {
            if (typeof item === "object") {
              return (
                <li key={index}>
                  {item.name ||
                    item.title ||
                    item.category ||
                    item.event ||
                    JSON.stringify(item)}
                </li>
              );
            }

            return <li key={index}>{item}</li>;
          })}
        </ul>
      );
    }

    if (typeof data === "object") {
      return (
        <ul className={styles.detailList}>
          {Object.entries(data).map(([key, value]) => (
            <li key={key}>
              <strong>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                :
              </strong>{" "}
              {Array.isArray(value) ? value.join(", ") : String(value)}
            </li>
          ))}
        </ul>
      );
    }

    return <p className={styles.detailValue}>{data}</p>;
  };

  // =========================================================
  // TOURNAMENT DETAILS INSIDE CARD
  // =========================================================

  const renderTournamentDetails = (tournament) => {
    return (
      <div
        className={styles.inlineDetails}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.inlineDetailsDivider} />

        <h4 className={styles.inlineDetailsHeading}>Tournament Details</h4>

        {/* BASIC INFORMATION */}

        <div className={styles.inlineInfoGrid}>
          <div className={styles.inlineInfoItem}>
            <strong>Date</strong>
            <span>{formatDate(getTournamentDate(tournament))}</span>
          </div>

          <div className={styles.inlineInfoItem}>
            <strong>Location</strong>
            <span>{getLocation(tournament)}</span>
          </div>

          {tournament.organizer && (
            <div className={styles.inlineInfoItem}>
              <strong>Organizer</strong>
              <span>{tournament.organizer}</span>
            </div>
          )}

          {tournament.director && (
            <div className={styles.inlineInfoItem}>
              <strong>Tournament Director</strong>
              <span>{tournament.director}</span>
            </div>
          )}

          {tournament.directorPhone && (
            <div className={styles.inlineInfoItem}>
              <strong>Contact</strong>
              <span>{tournament.directorPhone}</span>
            </div>
          )}

          {tournament.registrationFee && (
            <div className={styles.inlineInfoItem}>
              <strong>Registration Fee</strong>
              <span>{tournament.registrationFee}</span>
            </div>
          )}

          {tournament.fee && (
            <div className={styles.inlineInfoItem}>
              <strong>Fee</strong>
              <span>{tournament.fee}</span>
            </div>
          )}
        </div>

        {/* =================================================
            CATEGORY
        ================================================= */}

        {tournament.category && (
          <div className={styles.inlineDetailBlock}>
            <h5>Category</h5>
            {renderArrayData(tournament.category)}
          </div>
        )}

        {tournament.categories && (
          <div className={styles.inlineDetailBlock}>
            <h5>Categories</h5>
            {renderArrayData(tournament.categories)}
          </div>
        )}

        {/* =================================================
            EVENTS
        ================================================= */}

        {tournament.events && (
          <div className={styles.inlineDetailBlock}>
            <h5>Events</h5>
            {renderArrayData(tournament.events)}
          </div>
        )}

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        {tournament.description && (
          <div className={styles.inlineDetailBlock}>
            <h5>Description</h5>
            <p>{tournament.description}</p>
          </div>
        )}

        {/* =================================================
            PRIZE
        ================================================= */}

        {tournament.prize && (
          <div className={styles.inlineDetailBlock}>
            <h5>Prize</h5>
            {renderArrayData(tournament.prize)}
          </div>
        )}

        {tournament.prizes && (
          <div className={styles.inlineDetailBlock}>
            <h5>Prizes</h5>
            {renderArrayData(tournament.prizes)}
          </div>
        )}

        {tournament.prizeMoney && (
          <div className={styles.inlineDetailBlock}>
            <h5>Prize Money</h5>
            {renderArrayData(tournament.prizeMoney)}
          </div>
        )}

        {/* =================================================
            ELIGIBILITY
        ================================================= */}

        {tournament.eligibility && (
          <div className={styles.inlineDetailBlock}>
            <h5>Eligibility</h5>
            {renderArrayData(tournament.eligibility)}
          </div>
        )}

        {/* =================================================
            RULES
        ================================================= */}

        {tournament.rules && (
          <div className={styles.inlineDetailBlock}>
            <h5>Rules</h5>

            <div
              className={styles.rulesContent}
              dangerouslySetInnerHTML={{
                __html: tournament.rules,
              }}
            />
          </div>
        )}

        {/* =================================================
            REGISTER BUTTON
        ================================================= */}

        {tournament.itemType === "tournament" && (
          <div className={styles.inlineRegisterWrapper}>
            <Link
              to={`/tournaments/register?tournamentId=${tournament._id}`}
              className={styles.registerButton}
              onClick={(e) => e.stopPropagation()}
            >
              Register Now
            </Link>
          </div>
        )}

        {/* CLOSE */}

        <button
          type="button"
          className={styles.closeDetailsButton}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTournamentId(null);
          }}
        >
          Close Details ↑
        </button>
      </div>
    );
  };

  // =========================================================
  // VENUE
  // =========================================================

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

  // =========================================================
  // RETURN
  // =========================================================

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
                {allTournaments.map((tournament) => {
                  const isSelected = selectedTournamentId === tournament._id;

                  return (
                    <div
                      key={`${tournament.itemType}-${tournament._id}`}
                      className={`${styles.tournamentCard} ${
                        isSelected ? styles.tournamentCardSelected : ""
                      }`}
                    >
                      {/* CARD BASIC CONTENT */}

                      <div
                        className={styles.tournamentCardMain}
                        onClick={() => handleTournamentClick(tournament)}
                      >
                        <div className={styles.tournamentCardTop}>
                          <h3 className={styles.tournamentName}>
                            {tournament.name}
                          </h3>

                          {tournament.type === "display" && (
                            <span className={styles.tournamentBadge}>
                              Tournament
                            </span>
                          )}
                        </div>

                        <div className={styles.tournamentInfo}>
                          <p>
                            <strong>Date:</strong>{" "}
                            <span>
                              {formatDate(getTournamentDate(tournament))}
                            </span>
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
                          {isSelected ? "Hide Details ↑" : "View Details →"}
                        </button>
                      </div>

                      {/* =================================================
                          DETAILS OPEN INSIDE SAME CARD
                      ================================================= */}

                      {isSelected && renderTournamentDetails(tournament)}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* =================================================
              TOURNAMENT ACTIONS
              OLD FLOW PRESERVED
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
              ALWAYS VISIBLE
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
          SELECT TOURNAMENT MODAL
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
              value={actionTournamentId}
              onChange={(e) => setActionTournamentId(e.target.value)}
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

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

  const [selectedTournament, setSelectedTournament] = useState(null);

  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
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
  // INITIAL FETCH
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
  // USER KO SAB EK HI TOURNAMENT LIST ME DIKHENGE
  // =========================================================

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
  // GET TOURNAMENT DATE
  // =========================================================

  const getTournamentDate = (item) => {
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
    return item.location || item.venue || item.city || "Dehradun";
  };

  // =========================================================
  // OPEN DETAILS MODAL
  // =========================================================

  const handleTournamentClick = (tournament) => {
    setSelectedTournament(tournament);

    // prevent background scrolling
    document.body.style.overflow = "hidden";
  };

  // =========================================================
  // CLOSE DETAILS MODAL
  // =========================================================

  const closeDetailsModal = () => {
    setSelectedTournament(null);

    document.body.style.overflow = "auto";
  };

  // =========================================================
  // ESC KEY FOR DETAILS MODAL
  // =========================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeDetailsModal();
      }
    };

    if (selectedTournament) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedTournament]);

  // =========================================================
  // TOURNAMENT ACTION SELECTOR
  // OLD FLOW PRESERVED
  // =========================================================

  const openTournamentSelector = (action) => {
    setSelectedAction(action);
    setSelectedTournamentId("");
    setShowTournamentModal(true);
  };

  // =========================================================
  // CONTINUE ACTION
  // =========================================================

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
  // SHOW VALUE
  // Handles strings / arrays / objects
  // =========================================================

  const renderValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return null;

      return (
        <div className={styles.arrayValue}>
          {value.map((item, index) => (
            <span key={index} className={styles.infoTag}>
              {typeof item === "object" ? JSON.stringify(item) : String(item)}
            </span>
          ))}
        </div>
      );
    }

    if (typeof value === "object") {
      return (
        <div className={styles.objectValue}>
          {Object.entries(value).map(([key, val]) => {
            if (val === null || val === undefined || val === "") {
              return null;
            }

            return (
              <div key={key} className={styles.objectRow}>
                <strong>{formatLabel(key)}</strong>

                <span>
                  {typeof val === "object" ? JSON.stringify(val) : String(val)}
                </span>
              </div>
            );
          })}
        </div>
      );
    }

    return String(value);
  };

  // =========================================================
  // FORMAT FIELD LABEL
  // =========================================================

  const formatLabel = (key) => {
    if (!key) return "";

    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // =========================================================
  // GET FIELD FROM POSSIBLE NAMES
  // =========================================================

  const getFirstValue = (item, keys) => {
    for (const key of keys) {
      if (
        item?.[key] !== undefined &&
        item?.[key] !== null &&
        item?.[key] !== ""
      ) {
        return item[key];
      }
    }

    return null;
  };

  // =========================================================
  // DETAILS MODAL
  // =========================================================

  const renderDetailsModal = () => {
    if (!selectedTournament) {
      return null;
    }

    const item = selectedTournament;

    const category = getFirstValue(item, [
      "category",
      "categories",
      "ageCategory",
      "ageGroup",
      "eventCategory",
    ]);

    const events = getFirstValue(item, [
      "events",
      "event",
      "eventName",
      "eventNames",
      "tournamentEvents",
    ]);

    const prize = getFirstValue(item, [
      "prize",
      "prizeMoney",
      "prizes",
      "prizePool",
      "reward",
      "rewards",
    ]);

    const description = getFirstValue(item, [
      "description",
      "details",
      "about",
    ]);

    const rules = getFirstValue(item, ["rules", "rule", "regulations"]);

    const organizer = getFirstValue(item, [
      "organizer",
      "organisedBy",
      "organizedBy",
    ]);

    const director = getFirstValue(item, ["director", "tournamentDirector"]);

    const directorPhone = getFirstValue(item, [
      "directorPhone",
      "contactNumber",
      "phone",
      "mobile",
    ]);

    const registrationFee = getFirstValue(item, [
      "registrationFee",
      "entryFee",
      "fee",
    ]);

    return (
      <div className={styles.detailsModalOverlay} onClick={closeDetailsModal}>
        <div
          className={styles.detailsModal}
          onClick={(e) => e.stopPropagation()}
        >
          {/* =================================================
              CLOSE
          ================================================== */}

          <button
            type="button"
            className={styles.closeDetailsButton}
            onClick={closeDetailsModal}
            aria-label="Close"
          >
            ×
          </button>

          {/* =================================================
              HEADER
          ================================================== */}

          <div className={styles.detailsModalHeader}>
            <span className={styles.detailsSmallLabel}>TOURNAMENT DETAILS</span>

            <h2 className={styles.modalTournamentName}>{item.name}</h2>

            <div className={styles.titleLine}></div>
          </div>

          {/* =================================================
              BASIC INFORMATION
          ================================================== */}

          <div className={styles.modalInfoGrid}>
            <div className={styles.modalInfoBox}>
              <span className={styles.infoLabel}>DATE</span>

              <strong>{formatDate(getTournamentDate(item))}</strong>
            </div>

            <div className={styles.modalInfoBox}>
              <span className={styles.infoLabel}>LOCATION</span>

              <strong>{getLocation(item)}</strong>
            </div>

            {category && (
              <div className={styles.modalInfoBox}>
                <span className={styles.infoLabel}>CATEGORY</span>

                <div className={styles.infoValue}>{renderValue(category)}</div>
              </div>
            )}

            {events && (
              <div className={styles.modalInfoBox}>
                <span className={styles.infoLabel}>EVENTS</span>

                <div className={styles.infoValue}>{renderValue(events)}</div>
              </div>
            )}

            {prize && (
              <div className={styles.modalInfoBox}>
                <span className={styles.infoLabel}>PRIZE</span>

                <div className={styles.infoValue}>{renderValue(prize)}</div>
              </div>
            )}

            {registrationFee && (
              <div className={styles.modalInfoBox}>
                <span className={styles.infoLabel}>REGISTRATION FEE</span>

                <strong>{renderValue(registrationFee)}</strong>
              </div>
            )}

            {organizer && (
              <div className={styles.modalInfoBox}>
                <span className={styles.infoLabel}>ORGANIZER</span>

                <strong>{renderValue(organizer)}</strong>
              </div>
            )}

            {director && (
              <div className={styles.modalInfoBox}>
                <span className={styles.infoLabel}>TOURNAMENT DIRECTOR</span>

                <strong>{renderValue(director)}</strong>
              </div>
            )}

            {directorPhone && (
              <div className={styles.modalInfoBox}>
                <span className={styles.infoLabel}>CONTACT</span>

                <strong>{renderValue(directorPhone)}</strong>
              </div>
            )}
          </div>

          {/* =================================================
              DESCRIPTION
          ================================================== */}

          {description && (
            <div className={styles.modalContentBlock}>
              <h3>Description</h3>

              <div className={styles.modalContentText}>
                {typeof description === "string" &&
                description.includes("<") ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: description,
                    }}
                  />
                ) : (
                  renderValue(description)
                )}
              </div>
            </div>
          )}

          {/* =================================================
              RULES
          ================================================== */}

          {rules && (
            <div className={styles.modalContentBlock}>
              <h3>Rules & Regulations</h3>

              <div className={styles.modalContentText}>
                {typeof rules === "string" && rules.includes("<") ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: rules,
                    }}
                  />
                ) : (
                  renderValue(rules)
                )}
              </div>
            </div>
          )}

          {/* =================================================
              OTHER DETAILS
              Automatically show useful extra fields
          ================================================== */}

          <div className={styles.extraDetails}>
            {Object.entries(item).map(([key, value]) => {
              const hiddenFields = [
                "_id",
                "__v",
                "name",
                "date",
                "startDate",
                "endDate",
                "location",
                "venue",
                "description",
                "details",
                "about",
                "category",
                "categories",
                "ageCategory",
                "ageGroup",
                "eventCategory",
                "events",
                "event",
                "eventName",
                "eventNames",
                "tournamentEvents",
                "prize",
                "prizeMoney",
                "prizes",
                "prizePool",
                "reward",
                "rewards",
                "rules",
                "rule",
                "regulations",
                "organizer",
                "organisedBy",
                "organizedBy",
                "director",
                "tournamentDirector",
                "directorPhone",
                "contactNumber",
                "phone",
                "mobile",
                "registrationFee",
                "entryFee",
                "fee",
                "itemType",
                "type",
                "createdAt",
                "updatedAt",
              ];

              if (
                hiddenFields.includes(key) ||
                value === null ||
                value === undefined ||
                value === ""
              ) {
                return null;
              }

              return (
                <div key={key} className={styles.extraDetailRow}>
                  <span>{formatLabel(key)}</span>

                  <div>{renderValue(value)}</div>
                </div>
              );
            })}
          </div>

          {/* =================================================
              REGISTER
          ================================================== */}

          {item.itemType === "tournament" && (
            <div className={styles.modalRegisterArea}>
              <Link
                to={`/tournaments/register?tournamentId=${item._id}`}
                className={styles.modalRegisterButton}
                onClick={closeDetailsModal}
              >
                Register Now
              </Link>
            </div>
          )}
        </div>
      </div>
    );
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
                    {/* Tournament name */}

                    <h3 className={styles.tournamentName}>{tournament.name}</h3>

                    {/* Small blue underline */}

                    <div className={styles.cardTitleLine}></div>

                    {/* Date + Location */}

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

                    {/* View details */}

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

      {/* =====================================================
          TOURNAMENT SELECT MODAL
          PLAYERS / TEAMS / DRAWS / RESULTS
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

      {/* =====================================================
          DETAILS MODAL
      ====================================================== */}

      {renderDetailsModal()}

      <Footer />
    </div>
  );
}

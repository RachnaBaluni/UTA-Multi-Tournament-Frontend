import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Tournaments.module.css";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [mainEvents, setMainEvents] = useState([]);
  const [venue, setVenue] = useState([]);

  // Extra tournament information
  const [tournamentDetails, setTournamentDetails] = useState([]);
  const [pricesBenefits, setPricesBenefits] = useState([]);

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
  // FETCH TOURNAMENT DETAILS
  // =========================================================

  const getTournamentDetails = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/tournament-details/`);

      console.log("TOURNAMENT DETAILS:", res.data);

      if (res.data.success) {
        setTournamentDetails(res.data.data || []);
      } else {
        setTournamentDetails([]);
      }
    } catch (error) {
      console.error("Error fetching tournament details:", error);
      setTournamentDetails([]);
    }
  };

  // =========================================================
  // FETCH PRIZES & BENEFITS
  // =========================================================

  const getPricesBenefits = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/prices-benifit/`);

      console.log("PRICES & BENEFITS:", res.data);

      if (res.data.success) {
        setPricesBenefits(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching prices & benefits:", error);
      setPricesBenefits([]);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        getTournaments(),
        getMainEvents(),
        getVenue(),
        getTournamentDetails(),
        getPricesBenefits(),
      ]);

      setLoading(false);
    };

    loadData();

    window.scrollTo(0, 0);
  }, []);

  // =========================================================
  // MERGE TOURNAMENTS + MAIN EVENTS
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
  // DATE
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

  const getTournamentDate = (item) => {
    if (item.itemType === "mainEvent") {
      return item.date || item.startDate;
    }

    return item.startDate || item.date;
  };

  // =========================================================
  // LOCATION
  // =========================================================

  const getLocation = (item) => {
    return item.location || item.venue || "Dehradun";
  };

  // =========================================================
  // GET DETAILS FOR SELECTED TOURNAMENT
  // =========================================================

  const getExtraDetails = (tournament) => {
    if (!tournament) return [];

    const tournamentId = tournament._id?.toString();

    if (!tournamentId) {
      console.log("No tournament ID found:", tournament);
      return [];
    }

    const foundDetails = tournamentDetails.filter((detail) => {
      const detailTournamentId =
        detail.tournamentId?._id?.toString() || detail.tournamentId?.toString();

      return (
        detailTournamentId &&
        detailTournamentId === tournamentId &&
        detail.showing !== false
      );
    });

    console.log("SELECTED TOURNAMENT:", tournament);
    console.log("SELECTED TOURNAMENT ID:", tournamentId);
    console.log("ALL TOURNAMENT DETAILS:", tournamentDetails);
    console.log("MATCHED EXTRA DETAILS:", foundDetails);

    return foundDetails;
  };

  // =========================================================
  // GET PRIZE / BENEFIT DETAILS
  // =========================================================

  const getPrizeDetails = (tournament) => {
    if (!tournament) return null;

    const tournamentId = tournament._id?.toString();

    const found = pricesBenefits.find((item) => {
      const itemTournamentId =
        item.tournamentId?._id?.toString() ||
        item.tournamentId?.toString() ||
        item.tournament?._id?.toString() ||
        item.tournament?.toString();

      return (
        itemTournamentId && tournamentId && itemTournamentId === tournamentId
      );
    });

    if (found) return found;

    if (pricesBenefits.length === 1) {
      return pricesBenefits[0];
    }

    return null;
  };

  // =========================================================
  // OPEN DETAILS MODAL
  // =========================================================

  const handleTournamentClick = async (tournament) => {
    try {
      setSelectedTournament(tournament);

      const tournamentId = tournament._id;

      console.log("CLICKED TOURNAMENT:", tournament);
      console.log("CLICKED TOURNAMENT ID:", tournamentId);

      // If details are already loaded, use them.
      const alreadyLoadedDetails = tournamentDetails.filter((detail) => {
        const detailTournamentId =
          detail.tournamentId?._id?.toString() ||
          detail.tournamentId?.toString();

        return (
          detailTournamentId && detailTournamentId === tournamentId?.toString()
        );
      });

      console.log(
        "ALREADY LOADED DETAILS FOR TOURNAMENT:",
        alreadyLoadedDetails,
      );

      // If already available, no need to call API again.
      if (alreadyLoadedDetails.length > 0) {
        return;
      }

      // Otherwise fetch selected tournament details.
      const res = await axios.get(
        `${BACKEND_URL}/api/tournament-details?tournamentId=${tournamentId}`,
      );

      console.log("SELECTED TOURNAMENT DETAILS API:", res.data);

      if (res.data.success) {
        setTournamentDetails(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching selected tournament details:", error);
    }
  };

  // =========================================================
  // CLOSE DETAILS MODAL
  // =========================================================

  const closeDetails = () => {
    setSelectedTournament(null);
  };

  // =========================================================
  // ACTION SELECTOR
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

    if (!route) return;

    setShowTournamentModal(false);

    window.location.href = `${route}?tournamentId=${selectedTournamentId}`;
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

  // =========================================================
  // HELPER TO RENDER HTML
  // =========================================================

  const renderHTML = (value) => {
    if (!value) return null;

    if (typeof value === "string") {
      return (
        <div
          className={styles.modalRichText}
          dangerouslySetInnerHTML={{
            __html: value,
          }}
        />
      );
    }

    return null;
  };

  // =========================================================
  // SELECTED TOURNAMENT DETAILS
  // =========================================================

  const extraDetails = selectedTournament
    ? getExtraDetails(selectedTournament)
    : [];

  const prizeDetails = selectedTournament
    ? getPrizeDetails(selectedTournament)
    : null;

  // =========================================================
  // RENDER
  // =========================================================

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
                    className={`${styles.tournamentCard} ${
                      selectedTournament?._id === tournament._id
                        ? styles.selectedCard
                        : ""
                    }`}
                  >
                    <div className={styles.cardTitleRow}>
                      <div>
                        <h3 className={styles.tournamentName}>
                          {tournament.name}
                        </h3>

                        <div className={styles.titleUnderline}></div>
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
        <div className={styles.detailsOverlay} onClick={closeDetails}>
          <div
            className={styles.detailsModal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE */}

            <button
              type="button"
              className={styles.closeDetailsButton}
              onClick={closeDetails}
              aria-label="Close"
            >
              ×
            </button>

            {/* HEADER */}

            <div className={styles.modalHeader}>
              <span className={styles.modalEyebrow}>TOURNAMENT DETAILS</span>

              <h2 className={styles.modalTitle}>{selectedTournament.name}</h2>

              <div className={styles.modalTitleLine}></div>
            </div>

            {/* BASIC INFORMATION */}

            <div className={styles.modalBasicGrid}>
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

              {selectedTournament.organizer && (
                <div className={styles.modalInfoBox}>
                  <span>ORGANIZER</span>

                  <strong>{selectedTournament.organizer}</strong>
                </div>
              )}

              {selectedTournament.director && (
                <div className={styles.modalInfoBox}>
                  <span>TOURNAMENT DIRECTOR</span>

                  <strong>{selectedTournament.director}</strong>
                </div>
              )}

              {selectedTournament.directorPhone && (
                <div className={styles.modalInfoBox}>
                  <span>DIRECTOR PHONE</span>

                  <strong>{selectedTournament.directorPhone}</strong>
                </div>
              )}
            </div>

            {/* =====================================================
                TOURNAMENT DETAILS FROM TournamentDetail MODEL
            ====================================================== */}

            {extraDetails.length > 0 && (
              <div className={styles.modalSection}>
                <h3>Tournament Details</h3>

                {extraDetails.map((item) => (
                  <div key={item._id} className={styles.detailBlock}>
                    {/* KEY */}

                    {item.key && <h4>{item.key}</h4>}

                    {/* VALUE */}

                    {item.value && (
                      <div
                        className={styles.modalRichText}
                        dangerouslySetInnerHTML={{
                          __html: item.value,
                        }}
                      />
                    )}

                    {/* RULES */}

                    {Array.isArray(item.rules) && item.rules.length > 0 && (
                      <ul className={styles.detailList}>
                        {item.rules.map((rule, index) => (
                          <li key={index}>{rule}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* =====================================================
                NO EXTRA DETAILS
            ====================================================== */}

            {extraDetails.length === 0 && (
              <div className={styles.modalSection}>
                <h3>Tournament Details</h3>

                <p className={styles.modalParagraph}>
                  No additional tournament details available.
                </p>
              </div>
            )}

            {/* =====================================================
                DESCRIPTION
            ====================================================== */}

            {selectedTournament.description && (
              <div className={styles.modalSection}>
                <h3>Description</h3>

                <p className={styles.modalParagraph}>
                  {selectedTournament.description}
                </p>
              </div>
            )}

            {/* =====================================================
                RULES FROM TOURNAMENT
            ====================================================== */}

            {selectedTournament.rules && (
              <div className={styles.modalSection}>
                <h3>Rules</h3>

                {Array.isArray(selectedTournament.rules) ? (
                  <ul className={styles.detailList}>
                    {selectedTournament.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                ) : (
                  renderHTML(selectedTournament.rules)
                )}
              </div>
            )}

            {/* =====================================================
                PRIZES & BENEFITS
            ====================================================== */}

            {(prizeDetails ||
              selectedTournament.prize ||
              selectedTournament.prizes ||
              selectedTournament.benefits ||
              selectedTournament.prizeMoney) && (
              <div className={styles.modalSection}>
                <h3>Prizes & Benefits</h3>

                {prizeDetails?.prizeMoney &&
                  renderHTML(prizeDetails.prizeMoney)}

                {prizeDetails?.prizes && renderHTML(prizeDetails.prizes)}

                {prizeDetails?.benefits && renderHTML(prizeDetails.benefits)}

                {selectedTournament.prizeMoney &&
                  renderHTML(selectedTournament.prizeMoney)}

                {selectedTournament.prizes &&
                  renderHTML(selectedTournament.prizes)}

                {selectedTournament.benefits &&
                  renderHTML(selectedTournament.benefits)}
              </div>
            )}

            {/* =====================================================
                STATUS
            ====================================================== */}

            {selectedTournament.status && (
              <div className={styles.modalStatus}>
                <span>Status</span>

                <strong>{selectedTournament.status}</strong>
              </div>
            )}

            {/* =====================================================
                REGISTER
            ====================================================== */}

            {selectedTournament.itemType === "tournament" && (
              <div className={styles.modalRegister}>
                <Link
                  to={`/tournaments/register?tournamentId=${selectedTournament._id}`}
                  className={styles.registerButton}
                  onClick={closeDetails}
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          ACTION SELECT MODAL
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

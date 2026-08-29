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

  // Tournament extra details
  const [tournamentDetails, setTournamentDetails] = useState([]);
  const [pricesBenefits, setPricesBenefits] = useState([]);

  // Selected tournament for DETAILS modal
  const [selectedTournament, setSelectedTournament] = useState(null);

  // Selected tournament for INFORMATION modal
  const [informationTournament, setInformationTournament] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

  // =========================================================
  // FETCH TOURNAMENTS
  // =========================================================

  const getTournaments = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/tournaments/`);

      console.log("TOURNAMENTS:", res.data);

      if (res.data.success) {
        setTournaments(res.data.data || []);
      } else {
        setTournaments([]);
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

      console.log("MAIN EVENTS:", res.data);

      if (res.data.success) {
        setMainEvents(res.data.data || []);
      } else {
        setMainEvents([]);
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

      console.log("VENUE:", res.data);

      if (res.data.success) {
        setVenue(res.data.data || []);
      } else {
        setVenue([]);
      }
    } catch (error) {
      console.error("Error fetching venue:", error);
      setVenue([]);
    }
  };

  // =========================================================
  // FETCH TOURNAMENT DETAILS
  // =========================================================

  const getTournamentDetails = async (tournamentId) => {
    try {
      setDetailsLoading(true);
      setTournamentDetails([]);

      const res = await axios.get(
        `${BACKEND_URL}/api/tournament-details?tournamentId=${tournamentId}`,
      );

      console.log("TOURNAMENT DETAILS:", res.data);

      if (res.data.success) {
        setTournamentDetails(res.data.data || []);
      } else {
        setTournamentDetails([]);
      }
    } catch (error) {
      console.error("Error fetching tournament details:", error);
      setTournamentDetails([]);
    } finally {
      setDetailsLoading(false);
    }
  };

  // =========================================================
  // FETCH PRIZES & BENEFITS
  // =========================================================

  const getPricesBenefits = async (tournamentId) => {
    try {
      setPricesBenefits([]);

      const res = await axios.get(`${BACKEND_URL}/api/prices-benifit/`);

      console.log("PRIZES & BENEFITS:", res.data);

      if (res.data.success) {
        const data = res.data.data || [];

        const filtered = data.filter((item) => {
          const itemTournamentId =
            item.tournamentId?._id?.toString() ||
            item.tournamentId?.toString() ||
            item.tournament?._id?.toString() ||
            item.tournament?.toString();

          return (
            itemTournamentId &&
            tournamentId &&
            itemTournamentId === tournamentId.toString()
          );
        });

        setPricesBenefits(filtered);
      } else {
        setPricesBenefits([]);
      }
    } catch (error) {
      console.error("Error fetching prizes & benefits:", error);
      setPricesBenefits([]);
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
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

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
    if (!item) {
      return null;
    }

    if (item.itemType === "mainEvent") {
      return item.date || item.startDate || item.endDate;
    }

    return item.startDate || item.date || item.endDate;
  };

  // =========================================================
  // LOCATION
  // =========================================================

  const getLocation = (item) => {
    if (!item) {
      return "Dehradun";
    }

    return item.location || item.venue || "Dehradun";
  };

  // =========================================================
  // OPEN TOURNAMENT DETAILS
  // =========================================================

  const handleTournamentClick = async (tournament) => {
    console.log("CLICKED TOURNAMENT DETAILS:", tournament);
    console.log("TOURNAMENT ID:", tournament._id);

    // Close information modal if open
    setInformationTournament(null);

    // Open details modal
    setSelectedTournament(tournament);

    // Fetch details only for selected tournament
    if (tournament._id) {
      await Promise.all([
        getTournamentDetails(tournament._id),
        getPricesBenefits(tournament._id),
      ]);
    }
  };

  // =========================================================
  // OPEN TOURNAMENT INFORMATION
  // =========================================================

  const handleInformationClick = (tournament) => {
    console.log("CLICKED TOURNAMENT INFORMATION:", tournament);
    console.log("TOURNAMENT ID:", tournament._id);

    // Close details modal if open
    setSelectedTournament(null);

    // Open information modal
    setInformationTournament(tournament);
  };

  // =========================================================
  // CLOSE DETAILS MODAL
  // =========================================================

  const closeDetails = () => {
    setSelectedTournament(null);
    setTournamentDetails([]);
    setPricesBenefits([]);
  };

  // =========================================================
  // CLOSE INFORMATION MODAL
  // =========================================================

  const closeInformation = () => {
    setInformationTournament(null);
  };

  // =========================================================
  // RENDER VENUE
  // =========================================================

  const renderVenue = (item) => {
    if (!item || item.showing === false) {
      return null;
    }

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
  // RENDER HTML
  // =========================================================

  const renderHTML = (value) => {
    if (!value) {
      return null;
    }

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
  // RENDER
  // =========================================================

  return (
    <div className={styles.rootContainer}>
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
                    {/* CARD TITLE */}

                    <div className={styles.cardTitleRow}>
                      <div>
                        <h3 className={styles.tournamentName}>
                          {tournament.name}
                        </h3>

                        <div className={styles.titleUnderline}></div>
                      </div>
                    </div>

                    {/* CARD INFORMATION */}

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

                    <div className={styles.cardActions}>
                      <button
                        type="button"
                        className={styles.viewDetailsButton}
                        onClick={() => handleTournamentClick(tournament)}
                      >
                        View Details →
                      </button>
                      {tournament.itemType === "tournament" &&
                        tournament.type !== "display" && (
                          <button
                            type="button"
                            className={styles.viewInformationButton}
                            onClick={() => handleInformationClick(tournament)}
                          >
                            View Information →
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                {venue.map((item) => renderVenue(item))}
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

            {/* LOADING */}

            {detailsLoading ? (
              <div className={styles.modalLoading}>
                Loading tournament details...
              </div>
            ) : (
              <>
                {/* =================================================
                    TOURNAMENT DETAILS
                ================================================== */}

                {tournamentDetails.length > 0 ? (
                  <div className={styles.modalSection}>
                    <h3>Tournament Details</h3>

                    {tournamentDetails.map((item) => (
                      <div key={item._id} className={styles.detailBlock}>
                        {item.title && <h4>{item.title}</h4>}

                        {item.value && (
                          <div
                            className={styles.modalRichText}
                            dangerouslySetInnerHTML={{
                              __html: item.value,
                            }}
                          />
                        )}

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
                ) : (
                  <div className={styles.modalSection}>
                    <h3>Tournament Details</h3>

                    <p className={styles.modalParagraph}>
                      No additional tournament details available.
                    </p>
                  </div>
                )}

                {/* =================================================
                    DESCRIPTION
                ================================================== */}

                {selectedTournament.description && (
                  <div className={styles.modalSection}>
                    <h3>Description</h3>

                    <p className={styles.modalParagraph}>
                      {selectedTournament.description}
                    </p>
                  </div>
                )}

                {/* =================================================
                    RULES
                ================================================== */}

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

                {/* =================================================
                    PRIZES & BENEFITS
                ================================================== */}

                {(pricesBenefits.length > 0 ||
                  selectedTournament.prize ||
                  selectedTournament.prizes ||
                  selectedTournament.benefits ||
                  selectedTournament.prizeMoney) && (
                  <div className={styles.modalSection}>
                    <h3>Prizes & Benefits</h3>

                    {pricesBenefits.map((item) => (
                      <div key={item._id} className={styles.detailBlock}>
                        {item.title && <h4>{item.title}</h4>}

                        {item.prizeMoney && renderHTML(item.prizeMoney)}

                        {item.prizes && renderHTML(item.prizes)}

                        {item.benefits && renderHTML(item.benefits)}

                        {item.value && renderHTML(item.value)}
                      </div>
                    ))}

                    {selectedTournament.prizeMoney &&
                      renderHTML(selectedTournament.prizeMoney)}

                    {selectedTournament.prizes &&
                      renderHTML(selectedTournament.prizes)}

                    {selectedTournament.benefits &&
                      renderHTML(selectedTournament.benefits)}
                  </div>
                )}

                {/* =================================================
                    STATUS
                ================================================== */}

                {selectedTournament.status && (
                  <div className={styles.modalStatus}>
                    <span>Status</span>

                    <strong>{selectedTournament.status}</strong>
                  </div>
                )}

                {/* =================================================
                    REGISTER + LOGIN
                ================================================== */}

                {selectedTournament.itemType === "tournament" &&
                  selectedTournament.type !== "display" && (
                    <div className={styles.modalRegister}>
                      <Link
                        to={`/tournaments/register?tournamentId=${selectedTournament._id}`}
                        className={styles.registerButton}
                        onClick={closeDetails}
                      >
                        Register Now
                      </Link>

                      <Link
                        to={`/tournaments/login/${selectedTournament._id}`}
                        className={styles.loginButton}
                        onClick={closeDetails}
                      >
                        Login
                      </Link>
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          TOURNAMENT INFORMATION MODAL
      ========================================================= */}

      {informationTournament && (
        <div className={styles.modalOverlay} onClick={closeInformation}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            {/* CLOSE */}

            <button
              type="button"
              className={styles.closeDetailsButton}
              onClick={closeInformation}
              aria-label="Close"
            >
              ×
            </button>

            {/* HEADER */}

            <div className={styles.modalHeader}>
              <span className={styles.modalEyebrow}>
                TOURNAMENT INFORMATION
              </span>

              <h2 className={styles.modalTitle}>
                {informationTournament.name}
              </h2>

              <div className={styles.modalTitleLine}></div>
            </div>

            <p className={styles.actionDescription}>
              Select an option below to view tournament information.
            </p>

            {/* ACTION BUTTONS */}

            <div className={styles.actionButtons}>
              <Link
                to={`/tournaments/registered-players?tournamentId=${informationTournament._id}`}
                className={styles.actionButton}
                onClick={closeInformation}
              >
                View Registered Players
              </Link>

              <Link
                to={`/tournaments/registered-teams?tournamentId=${informationTournament._id}`}
                className={styles.actionButtonGrey}
                onClick={closeInformation}
              >
                View Registered Teams
              </Link>

              <Link
                to={`/tournaments/draws?tournamentId=${informationTournament._id}`}
                className={styles.actionButton}
                onClick={closeInformation}
              >
                View Draws
              </Link>

              <Link
                to={`/tournaments/results?tournamentId=${informationTournament._id}`}
                className={styles.actionButtonGrey}
                onClick={closeInformation}
              >
                View Results
              </Link>

              <Link
                to={`/tournaments/viewresults?tournamentId=${informationTournament._id}`}
                className={styles.actionButton}
                onClick={closeInformation}
              >
                View Results 2
              </Link>

              <Link
                to={`/tournaments/view-order-play?tournamentId=${informationTournament._id}`}
                className={styles.actionButtonGrey}
                onClick={closeInformation}
              >
                Order Of Play
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

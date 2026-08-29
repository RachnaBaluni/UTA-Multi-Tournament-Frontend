import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./TournamentDetail.module.css";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

const TournamentDetail = () => {
  const { id } = useParams();

  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

  const [tournament, setTournament] = useState(null);
  const [tournamentDetails, setTournamentDetails] = useState([]);
  const [prizesBenefits, setPrizesBenefits] = useState([]);
  const [venue, setVenue] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================================================
  // FETCH TOURNAMENT
  // =========================================================

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        setLoading(true);
        setError(null);

        // -----------------------------------------------------
        // FIRST: NORMAL TOURNAMENT
        // -----------------------------------------------------

        let tournamentData = null;

        try {
          const response = await axios.get(
            `${BACKEND_URL}/api/tournaments/${id}`,
          );

          if (response.data?.success && response.data?.data) {
            tournamentData = response.data.data;
          }
        } catch (normalTournamentError) {
          console.log("Normal tournament not found, checking main event...");
        }

        // -----------------------------------------------------
        // SECOND: MAIN EVENT
        // -----------------------------------------------------

        if (!tournamentData) {
          try {
            const response = await axios.get(
              `${BACKEND_URL}/api/main-events/${id}`,
            );

            if (response.data?.success && response.data?.data) {
              tournamentData = {
                ...response.data.data,
                itemType: "mainEvent",
              };
            }
          } catch (mainEventError) {
            console.error("Main event fetch error:", mainEventError);
          }
        }

        if (!tournamentData) {
          throw new Error("Tournament not found");
        }

        console.log("SELECTED TOURNAMENT:", tournamentData);

        setTournament(tournamentData);

        // -----------------------------------------------------
        // FETCH EXTRA TOURNAMENT DETAILS
        // -----------------------------------------------------

        try {
          const detailsResponse = await axios.get(
            `${BACKEND_URL}/api/tournament-details?tournamentId=${id}`,
          );

          console.log("SELECTED TOURNAMENT DETAILS:", detailsResponse.data);

          if (detailsResponse.data?.success) {
            setTournamentDetails(detailsResponse.data.data || []);
          }
        } catch (detailsError) {
          console.error("Error fetching tournament details:", detailsError);

          setTournamentDetails([]);
        }

        // -----------------------------------------------------
        // FETCH PRIZES & BENEFITS
        // -----------------------------------------------------

        try {
          const prizeResponse = await axios.get(
            `${BACKEND_URL}/api/prices-benifit/`,
          );

          console.log("ALL PRIZES & BENEFITS:", prizeResponse.data);

          if (prizeResponse.data?.success) {
            setPrizesBenefits(prizeResponse.data.data || []);
          }
        } catch (prizeError) {
          console.error("Error fetching prizes & benefits:", prizeError);

          setPrizesBenefits([]);
        }

        // -----------------------------------------------------
        // FETCH VENUE
        // -----------------------------------------------------

        try {
          const venueResponse = await axios.get(`${BACKEND_URL}/api/venue/`, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });

          if (venueResponse.data?.success) {
            setVenue(venueResponse.data.data || []);
          }
        } catch (venueError) {
          console.error("Error fetching venue:", venueError);
          setVenue([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching tournament:", err);

        setError(err);
        setLoading(false);
      }
    };

    fetchTournamentData();

    window.scrollTo(0, 0);
  }, [id, BACKEND_URL]);

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

  // =========================================================
  // TOURNAMENT DATE
  // =========================================================

  const getTournamentDate = () => {
    if (!tournament) return null;

    return tournament.startDate || tournament.date || tournament.endDate;
  };

  // =========================================================
  // LOCATION
  // =========================================================

  const getLocation = () => {
    if (!tournament) return "Dehradun";

    return tournament.location || tournament.venue || "Dehradun";
  };

  // =========================================================
  // PRIZE DETAILS
  // =========================================================

  const getPrizeDetails = () => {
    if (!tournament) return null;

    const tournamentId = tournament._id?.toString();

    const found = prizesBenefits.find((item) => {
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

    // If backend has only one prize/benefit record
    if (prizesBenefits.length === 1) {
      return prizesBenefits[0];
    }

    return null;
  };

  // =========================================================
  // HTML RENDER
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
  // VENUE
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
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <Header />

        <div className={styles.loading}>Loading tournament...</div>

        <Footer />
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !tournament) {
    return (
      <div className={styles.pageWrapper}>
        <Header />

        <div className={styles.error}>
          <h2>Tournament not found.</h2>

          <Link to="/tournaments">← Back to Tournaments</Link>
        </div>

        <Footer />
      </div>
    );
  }

  const prizeDetails = getPrizeDetails();

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* =====================================================
              TOURNAMENT HEADER
          ====================================================== */}

          <div className={styles.banner}>
            <span className={styles.eyebrow}>TOURNAMENT DETAILS</span>

            <h1>{tournament.name}</h1>

            <div className={styles.bannerLine}></div>
          </div>

          {/* =====================================================
              BASIC INFORMATION
          ====================================================== */}

          <section className={styles.basicInfoSection}>
            <div className={styles.basicInfoGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>DATE</span>

                <strong>{formatDate(getTournamentDate())}</strong>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>LOCATION</span>

                <strong>{getLocation()}</strong>
              </div>

              {tournament.organizer && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>ORGANIZER</span>

                  <strong>{tournament.organizer}</strong>
                </div>
              )}

              {tournament.director && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    TOURNAMENT DIRECTOR
                  </span>

                  <strong>{tournament.director}</strong>
                </div>
              )}

              {tournament.directorPhone && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>DIRECTOR PHONE</span>

                  <strong>{tournament.directorPhone}</strong>
                </div>
              )}
            </div>
          </section>

          {/* =====================================================
              DESCRIPTION
          ====================================================== */}

          {tournament.description && (
            <section className={styles.contentSection}>
              <h2>Description</h2>

              <p className={styles.paragraph}>{tournament.description}</p>
            </section>
          )}

          {/* =====================================================
              EXTRA TOURNAMENT DETAILS
          ====================================================== */}

          {tournamentDetails.length > 0 ? (
            <section className={styles.contentSection}>
              <h2>Tournament Details</h2>

              {tournamentDetails.map((item) => (
                <div key={item._id} className={styles.detailBlock}>
                  {item.title && <h3>{item.title}</h3>}

                  {item.value && (
                    <div
                      className={styles.richText}
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
            </section>
          ) : (
            <section className={styles.contentSection}>
              <h2>Tournament Details</h2>

              <p className={styles.paragraph}>
                No additional tournament details available.
              </p>
            </section>
          )}

          {/* =====================================================
              RULES
          ====================================================== */}

          {tournament.rules && (
            <section className={styles.contentSection}>
              <h2>Rules</h2>

              {Array.isArray(tournament.rules) ? (
                <ul className={styles.detailList}>
                  {tournament.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              ) : (
                renderHTML(tournament.rules)
              )}
            </section>
          )}

          {/* =====================================================
              PRIZES & BENEFITS
          ====================================================== */}

          {(prizeDetails ||
            tournament.prize ||
            tournament.prizes ||
            tournament.benefits ||
            tournament.prizeMoney) && (
            <section className={styles.contentSection}>
              <h2>Prizes & Benefits</h2>

              {prizeDetails?.prizeMoney && renderHTML(prizeDetails.prizeMoney)}

              {prizeDetails?.prizes && renderHTML(prizeDetails.prizes)}

              {prizeDetails?.benefits && renderHTML(prizeDetails.benefits)}

              {tournament.prizeMoney && renderHTML(tournament.prizeMoney)}

              {tournament.prizes && renderHTML(tournament.prizes)}

              {tournament.benefits && renderHTML(tournament.benefits)}
            </section>
          )}

          {/* =====================================================
              STATUS
          ====================================================== */}

          {tournament.status && (
            <div className={styles.statusBox}>
              <span>Status</span>

              <strong>{tournament.status}</strong>
            </div>
          )}

          {/* =====================================================
              REGISTER + PLAYER LOGIN
          ====================================================== */}

          {tournament.itemType !== "mainEvent" && (
            <section className={styles.registerSection}>
              <Link
                to={`/tournaments/register?tournamentId=${tournament._id}`}
                className={styles.registerButton}
              >
                Register Now
              </Link>

              <Link
                to={`/tournaments/login/${tournament._id}`}
                className={styles.loginButton}
              >
                Player Login
              </Link>
            </section>
          )}

          {/* =====================================================
              TOURNAMENT INFORMATION
              THESE BELONG TO THIS TOURNAMENT ONLY
          ====================================================== */}

          <section
            className={styles.actionSection}
            style={{
              display: "block",
              visibility: "visible",
              opacity: 1,
              background: "yellow",
              padding: "30px",
              marginTop: "30px",
            }}
          >
            {" "}
            <h2 style={{ color: "red", fontSize: "30px" }}>
              Tournament Information
            </h2>{" "}
            <p className={styles.actionDescription}>
              Select an option below to view tournament information.
            </p>
            <div className={styles.actionButtons}>
              <Link
                to={`/tournaments/registered-players?tournamentId=${tournament._id}`}
                className={styles.actionButton}
              >
                View Registered Players
              </Link>

              <Link
                to={`/tournaments/registered-teams?tournamentId=${tournament._id}`}
                className={styles.actionButtonGrey}
              >
                View Registered Teams
              </Link>

              <Link
                to={`/tournaments/draws?tournamentId=${tournament._id}`}
                className={styles.actionButton}
              >
                View Draws
              </Link>

              <Link
                to={`/tournaments/results?tournamentId=${tournament._id}`}
                className={styles.actionButtonGrey}
              >
                View Results
              </Link>

              <Link
                to={`/tournaments/viewresults?tournamentId=${tournament._id}`}
                className={styles.actionButton}
              >
                View Results 2
              </Link>

              <Link
                to={`/tournaments/view-order-play?tournamentId=${tournament._id}`}
                className={styles.actionButtonGrey}
              >
                Order Of Play
              </Link>
            </div>
          </section>

          {/* =====================================================
              VENUE
          ====================================================== */}

          <section className={styles.venueSection}>
            <h2>Venue & Important Information</h2>

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

          {/* =====================================================
              BACK BUTTON
          ====================================================== */}

          <div className={styles.backButtonContainer}>
            <Link to="/tournaments" className={styles.backButton}>
              ← Back to All Tournaments
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TournamentDetail;

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
  const [events, setEvents] = useState([]);
  const [prizesBenefits, setPrizesBenefits] = useState([]);
  const [venue, setVenue] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================================================
  // FETCH ALL TOURNAMENT DATA
  // =========================================================

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        setLoading(true);
        setError(null);

        let tournamentData = null;

        // =====================================================
        // 1. NORMAL / DISPLAY TOURNAMENT
        // =====================================================

        try {
          const response = await axios.get(
            `${BACKEND_URL}/api/tournaments/${id}`,
          );

          if (response.data?.success && response.data?.data) {
            tournamentData = response.data.data;
          }
        } catch (normalTournamentError) {
          console.log("Tournament not found, checking main event...");
        }

        // =====================================================
        // 2. MAIN EVENT
        // =====================================================

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

        // =====================================================
        // TOURNAMENT NOT FOUND
        // =====================================================

        if (!tournamentData) {
          throw new Error("Tournament not found");
        }

        console.log("SELECTED TOURNAMENT:", tournamentData);

        setTournament(tournamentData);

        // =====================================================
        // 3. TOURNAMENT DETAILS
        // =====================================================

        try {
          const detailsResponse = await axios.get(
            `${BACKEND_URL}/api/tournament-details?tournamentId=${id}`,
          );

          console.log("TOURNAMENT DETAILS API:", detailsResponse.data);

          if (detailsResponse.data?.success) {
            setTournamentDetails(detailsResponse.data.data || []);
          } else {
            setTournamentDetails([]);
          }
        } catch (detailsError) {
          console.error("Error fetching tournament details:", detailsError);

          setTournamentDetails([]);
        }

        // =====================================================
        // 4. EVENTS / CATEGORIES
        // =====================================================

        try {
          const eventsResponse = await axios.get(
            `${BACKEND_URL}/api/events?tournamentId=${id}`,
          );

          console.log("SELECTED TOURNAMENT EVENTS:", eventsResponse.data);

          if (eventsResponse.data?.success) {
            setEvents(eventsResponse.data.data || []);
          } else {
            setEvents([]);
          }
        } catch (eventsError) {
          console.error("Error fetching tournament events:", eventsError);

          setEvents([]);
        }

        // =====================================================
        // 5. PRIZES & BENEFITS
        // =====================================================

        try {
          const prizeResponse = await axios.get(
            `${BACKEND_URL}/api/prices-benifit?tournamentId=${id}`,
          );

          console.log("SELECTED PRIZES & BENEFITS:", prizeResponse.data);

          if (prizeResponse.data?.success) {
            setPrizesBenefits(prizeResponse.data.data || []);
          } else {
            setPrizesBenefits([]);
          }
        } catch (prizeError) {
          console.error("Error fetching prizes & benefits:", prizeError);

          setPrizesBenefits([]);
        }

        // =====================================================
        // 6. VENUE
        // =====================================================

        try {
          const venueResponse = await axios.get(`${BACKEND_URL}/api/venue/`, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });

          console.log("VENUE:", venueResponse.data);

          if (venueResponse.data?.success) {
            setVenue(venueResponse.data.data || []);
          } else {
            setVenue([]);
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

    if (id) {
      fetchTournamentData();
    }

    window.scrollTo(0, 0);
  }, [id, BACKEND_URL]);

  // =========================================================
  // FORMAT DATE
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
  // TOURNAMENT TYPE
  // =========================================================

  const getTournamentType = () => {
    if (!tournament) {
      return "Tournament";
    }

    if (tournament.type === "display") {
      return "Display Tournament";
    }

    if (tournament.type === "normal") {
      return "Normal Tournament";
    }

    return "Tournament";
  };

  // =========================================================
  // LOCATION
  // =========================================================

  const getLocation = () => {
    if (!tournament) {
      return "Dehradun";
    }

    return tournament.location || tournament.venue || "Dehradun";
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
  // HTML RENDER
  // =========================================================

  const renderHTML = (value) => {
    if (!value) {
      return null;
    }

    return (
      <div
        className={styles.modalRichText}
        dangerouslySetInnerHTML={{
          __html: value,
        }}
      />
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

  // =========================================================
  // VISIBLE EVENTS
  // =========================================================

  const visibleEvents = events.filter((event) => event.showing !== false);

  // =========================================================
  // ENTRY & PARTICIPATION DETAILS
  // ONLY ENTRY RELATED DETAILS
  // =========================================================

  const visibleEntryDetails = tournamentDetails.filter((item) => {
    if (item.showing === false) {
      return false;
    }

    const key = String(item.key || "").toLowerCase();
    const title = String(item.title || "").toLowerCase();

    return (
      key.includes("entry") ||
      key.includes("participation") ||
      title.includes("entry") ||
      title.includes("participation")
    );
  });

  // =========================================================
  // VISIBLE PRIZES & BENEFITS
  // =========================================================

  const visiblePrizesBenefits = prizesBenefits.filter(
    (prize) => prize.showing !== false,
  );

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
              {tournament.type && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>TOURNAMENT TYPE</span>

                  <strong>{getTournamentType()}</strong>
                </div>
              )}

              {/* DISPLAY TOURNAMENT DATE ONLY */}

              {tournament.type === "display" && tournament.date && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>DATE</span>

                  <strong>{formatDate(tournament.date)}</strong>
                </div>
              )}

              {/* MASTER TOURNAMENT START DATE */}

              {tournament.type === "normal" && tournament.startDate && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>START DATE</span>

                  <strong>{formatDate(tournament.startDate)}</strong>
                </div>
              )}

              {/* MASTER TOURNAMENT END DATE */}

              {tournament.type === "normal" && tournament.endDate && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>END DATE</span>

                  <strong>{formatDate(tournament.endDate)}</strong>
                </div>
              )}

              {getLocation() && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>LOCATION</span>

                  <strong>{getLocation()}</strong>
                </div>
              )}

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

              {tournament.status && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>STATUS</span>

                  <strong>{tournament.status}</strong>
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
              ENTRY & PARTICIPATION
          ====================================================== */}

          {tournament.type === "normal" && (
            <section className={styles.contentSection}>
              <h2>Entry & Participation</h2>

              {/* =================================================
                  REGISTRATION DATES
                  FROM CREATE TOURNAMENT
              ================================================= */}

              {(tournament.registrationStartDate ||
                tournament.registrationEndDate) && (
                <div className={styles.detailBlock}>
                  <h3>Registration Period</h3>

                  {tournament.registrationStartDate && (
                    <p className={styles.paragraph}>
                      <strong>Registration Starts:</strong>{" "}
                      {formatDate(tournament.registrationStartDate)}
                    </p>
                  )}

                  {tournament.registrationEndDate && (
                    <p className={styles.paragraph}>
                      <strong>Registration Ends:</strong>{" "}
                      {formatDate(tournament.registrationEndDate)}
                    </p>
                  )}
                </div>
              )}

              {/* =================================================
                  ENTRY RULES
                  FROM TOURNAMENT DETAILS API
              ================================================= */}

              {visibleEntryDetails.length > 0 && (
                <div className={styles.detailBlock}>
                  <h3>Entry Rules</h3>

                  {visibleEntryDetails.map((item) => (
                    <div key={item._id} className={styles.detailBlock}>
                      {item.value && (
                        <div
                          className={styles.richText}
                          dangerouslySetInnerHTML={{
                            __html: item.value.replace(/\n/g, "<br />"),
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
              )}
            </section>
          )}

          {/* =====================================================
              TOURNAMENT CATEGORIES
          ====================================================== */}

          {visibleEvents.length > 0 && (
            <section className={styles.contentSection}>
              <h2>Tournament Categories</h2>

              <div className={styles.detailBlock}>
                <h3>Categories And Format</h3>

                <ul className={styles.detailList}>
                  {visibleEvents.map((event) => (
                    <li key={event._id}>{event.name}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* =====================================================
              PRIZES & BENEFITS
              FROM SEPARATE API
          ====================================================== */}

          {visiblePrizesBenefits.length > 0 && (
            <section className={styles.contentSection}>
              <h2>Prizes & Benefits</h2>

              <div className={styles.prizeBenefitsGrid}>
                {visiblePrizesBenefits.map((prize) => (
                  <div key={prize._id} className={styles.prizeBenefitCard}>
                    {/* KEY / TITLE */}

                    {prize.key && (
                      <h3>
                        {prize.key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </h3>
                    )}

                    {/* VALUE */}

                    {prize.value && (
                      <div className={styles.richText}>
                        {prize.value.split(/\r?\n/).map((line, index) => {
                          const text = line.replace(/^[-•]\s*/, "").trim();

                          if (!text) {
                            return null;
                          }

                          return (
                            <div key={index} className={styles.prizeBullet}>
                              • {text}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* RULES / BENEFITS */}

                    {Array.isArray(prize.rules) && prize.rules.length > 0 && (
                      <ul className={styles.detailList}>
                        {prize.rules.map((rule, index) => (
                          <li key={index}>{rule}</li>
                        ))}
                      </ul>
                    )}

                    {/* DATE */}

                    {prize.date && (
                      <p className={styles.prizeDate}>
                        {formatDate(prize.date)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* =====================================================
              OLD RULES
              FALLBACK ONLY
          ====================================================== */}

          {tournament.rules && visibleEntryDetails.length === 0 && (
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
              STATUS
          ====================================================== */}

          {tournament.status && (
            <div className={styles.statusBox}>
              <span>Status</span>

              <strong>{tournament.status}</strong>
            </div>
          )}

          {/* =====================================================
              REGISTER + LOGIN
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
          ====================================================== */}

          <section className={styles.actionSection}>
            <h2>Tournament Information</h2>

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
              BACK
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

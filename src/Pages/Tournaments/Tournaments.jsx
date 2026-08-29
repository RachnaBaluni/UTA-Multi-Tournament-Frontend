import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Tournaments.module.css";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [mainEvents, setMainEvents] = useState([]);
  const [venue, setVenue] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH ALL DATA
  // =========================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const backendURL = import.meta.env.VITE_APP_BACKEND_URL;

        // Fetch normal + display tournaments
        const tournamentsResponse = await axios.get(
          `${backendURL}/api/tournaments/`,
        );

        // Fetch main events
        const mainEventsResponse = await axios.get(
          `${backendURL}/api/main-events`,
        );

        // Fetch venue
        const venueResponse = await axios.get(`${backendURL}/api/venue/`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        console.log("🔥 ALL TOURNAMENTS:", tournamentsResponse.data);

        console.log("🔥 MAIN EVENTS:", mainEventsResponse.data);

        console.log("🔥 VENUE:", venueResponse.data);

        // Normal + Display tournaments
        setTournaments(tournamentsResponse.data?.data || []);

        // Main Events
        setMainEvents(mainEventsResponse.data?.data || []);

        // Venue
        setVenue(venueResponse.data?.data || []);
      } catch (err) {
        console.error("Error fetching tournament data:", err);

        setError("Unable to load tournaments.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    window.scrollTo(0, 0);
  }, []);

  // =========================================================
  // COMBINE ALL TOURNAMENTS
  // =========================================================

  const allTournaments = [...tournaments, ...mainEvents];

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className={styles.rootContainer}>
        <div className={styles.mainContentWrapper}>
          <div className={styles.contentContainer}>
            <h1 className={styles.sectionTitle}>Loading tournaments...</h1>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className={styles.rootContainer}>
        <div className={styles.mainContentWrapper}>
          <div className={styles.contentContainer}>
            <h1 className={styles.sectionTitle}>{error}</h1>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className={styles.rootContainer}>
      <div className={styles.mainContentWrapper}>
        <div className={styles.contentContainer}>
          {/* =====================================================
              HERO / BANNER
          ===================================================== */}

          <section className={styles.tournamentsHeroSection}>
            <h1 className={styles.tournamentsHeroHeading}>Tournaments</h1>

            <p className={styles.tournamentsHeroParagraph}>
              Explore all upcoming and ongoing tennis tournaments organized by
              the Uttaranchal Tennis Association.
            </p>

            <a href="#all-tournaments" className={styles.exploreButton}>
              Explore Tournaments
            </a>
          </section>

          {/* =====================================================
              ALL TOURNAMENTS
          ===================================================== */}

          <section id="all-tournaments" className={styles.upcomingTournaments}>
            <h2 className={styles.sectionTitle}>All Tournaments</h2>

            {allTournaments.length === 0 ? (
              <p className={styles.noResults}>No tournaments available.</p>
            ) : (
              <div className={styles.tournamentList}>
                {allTournaments.map((tournament) => (
                  <Link
                    key={tournament._id}
                    to={`/tournaments/${tournament._id}`}
                    className={styles.tournamentCard}
                  >
                    <div className={styles.tournamentInfo}>
                      <h2>{tournament.name}</h2>

                      {/* Date */}
                      {(tournament.date || tournament.startDate) && (
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(
                            tournament.date || tournament.startDate,
                          ).toLocaleDateString()}
                        </p>
                      )}

                      {/* End Date for normal tournament */}
                      {tournament.endDate && (
                        <p>
                          <strong>End Date:</strong>{" "}
                          {new Date(tournament.endDate).toLocaleDateString()}
                        </p>
                      )}

                      {/* Location */}
                      {tournament.location && (
                        <p>
                          <strong>Location:</strong> {tournament.location}
                        </p>
                      )}
                    </div>

                    <span className={styles.viewDetails}>View Details →</span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* =====================================================
              TOURNAMENT ACTIONS
          ===================================================== */}

          <section className={styles.actionSection}>
            <h2 className={styles.sectionTitle}>Tournament Information</h2>

            <div className={styles.actionButtons}>
              <Link
                to="/tournaments/registered-players"
                className={styles.actionButton}
              >
                View Registered Players
              </Link>

              <Link
                to="/tournaments/registered-teams"
                className={styles.actionButton}
              >
                View Registered Teams
              </Link>

              <Link to="/tournaments/draws" className={styles.actionButton}>
                View Draws
              </Link>

              <Link to="/tournaments/results" className={styles.actionButton}>
                View Results
              </Link>

              <Link
                to="/tournaments/viewresults"
                className={styles.actionButton}
              >
                View Results 2
              </Link>

              <Link
                to="/tournaments/view-order-play"
                className={styles.actionButton}
              >
                Order Of Play
              </Link>
            </div>
          </section>

          {/* =====================================================
              VENUE
          ===================================================== */}

          <section className={styles.venueSection}>
            <h2 className={styles.sectionTitle}>
              Venue & Important Information
            </h2>

            {venue.length === 0 ? (
              <p className={styles.noResults}>
                Venue information not available.
              </p>
            ) : (
              <div className={styles.venueGrid}>
                {venue.map((item) => (
                  <div key={item._id} className={styles.venueCard}>
                    <h3>{item.title || item.venue || "Tournament Venue"}</h3>

                    {item.venue && <h2>{item.venue}</h2>}

                    {item.address && <p>{item.address}</p>}

                    {item.mapLink && (
                      <div className={styles.mapContainer}>
                        <iframe
                          src={item.mapLink}
                          width="600"
                          height="450"
                          style={{
                            border: 0,
                          }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className={styles.mapFrame}
                          title={item.title || "Tournament Venue"}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Tournaments;

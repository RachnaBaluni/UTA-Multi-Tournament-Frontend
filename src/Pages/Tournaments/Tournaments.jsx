import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Tournaments.module.css";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [venue, setVenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError("");

        const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

        // -----------------------------------------
        // 1. NORMAL + DISPLAY TOURNAMENTS
        // -----------------------------------------
        const tournamentsResponse = await axios.get(
          `${backendUrl}/api/tournaments/`,
        );

        // -----------------------------------------
        // 2. MAIN EVENTS
        // -----------------------------------------
        const mainEventsResponse = await axios.get(
          `${backendUrl}/api/main-events`,
        );

        // -----------------------------------------
        // 3. VENUE
        // -----------------------------------------
        const venueResponse = await axios.get(`${backendUrl}/api/venue/`);

        console.log("ALL TOURNAMENTS:", tournamentsResponse.data);

        console.log("MAIN EVENTS:", mainEventsResponse.data);

        console.log("VENUE:", venueResponse.data);

        const normalAndDisplay = tournamentsResponse.data?.data || [];

        const mainEvents = mainEventsResponse.data?.data || [];

        const venueData = venueResponse.data?.data || [];

        // -----------------------------------------
        // NORMAL + DISPLAY TOURNAMENTS
        // -----------------------------------------
        const formattedTournaments = normalAndDisplay.map((tournament) => ({
          ...tournament,
          source: "tournament",
        }));

        // -----------------------------------------
        // MAIN EVENTS
        // -----------------------------------------
        const formattedMainEvents = mainEvents.map((event) => ({
          ...event,

          // Main event ko internally identify karenge
          source: "mainEvent",

          // Detail page ke liye same id
          _id: event._id,

          // MainEvent ka date/location already same fields me hain
          name: event.name,
          date: event.date,
          location: event.location,
        }));

        // -----------------------------------------
        // SABKO EK HI ARRAY ME MERGE KARO
        // -----------------------------------------
        const allTournaments = [
          ...formattedTournaments,
          ...formattedMainEvents,
        ];

        // Latest date first
        allTournaments.sort((a, b) => {
          const dateA = new Date(a.date || a.startDate || 0).getTime();

          const dateB = new Date(b.date || b.startDate || 0).getTime();

          return dateB - dateA;
        });

        setTournaments(allTournaments);
        setVenue(venueData);
      } catch (err) {
        console.error("Error fetching tournament data:", err);

        setError("Unable to load tournaments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // -----------------------------------------
  // LOADING
  // -----------------------------------------
  if (loading) {
    return (
      <div className={styles.rootContainer}>
        <div className={styles.mainContentWrapper}>
          <div className={styles.contentContainer}>
            <div className={styles.upcomingTournaments}>
              <h2 className={styles.sectionTitle}>Loading tournaments...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // ERROR
  // -----------------------------------------
  if (error) {
    return (
      <div className={styles.rootContainer}>
        <div className={styles.mainContentWrapper}>
          <div className={styles.contentContainer}>
            <div className={styles.upcomingTournaments}>
              <h2 className={styles.sectionTitle}>{error}</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.rootContainer}>
      <div className={styles.mainContentWrapper}>
        <div className={styles.contentContainer}>
          {/* -------------------------------- */}
          {/* HERO */}
          {/* -------------------------------- */}

          <section className={styles.tournamentsHeroSection}>
            <h1 className={styles.tournamentsHeroHeading}>Tournaments</h1>

            <p className={styles.tournamentsHeroParagraph}>
              Explore all upcoming and ongoing tennis tournaments and events.
            </p>

            <a href="#tournamentList" className={styles.exploreButton}>
              Explore Tournaments
            </a>
          </section>

          {/* -------------------------------- */}
          {/* TOURNAMENT LIST */}
          {/* -------------------------------- */}

          <section className={styles.upcomingTournaments} id="tournamentList">
            <h2 className={styles.sectionTitle}>All Tournaments</h2>

            {tournaments.length === 0 ? (
              <p className={styles.noResults}>No tournaments available.</p>
            ) : (
              <div className={styles.tournamentGrid}>
                {tournaments.map((tournament) => {
                  const tournamentDate =
                    tournament.date || tournament.startDate;

                  return (
                    <Link
                      key={`${tournament.source}-${tournament._id}`}
                      to={`/tournaments/${tournament._id}`}
                      state={{
                        tournament,
                        source: tournament.source,
                      }}
                      className={styles.tournamentCard}
                    >
                      <div className={styles.tournamentCardContent}>
                        <h3 className={styles.tournamentName}>
                          {tournament.name}
                        </h3>

                        {tournamentDate && (
                          <p className={styles.tournamentInfo}>
                            <strong>Date:</strong>{" "}
                            {new Date(tournamentDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        )}

                        {tournament.location && (
                          <p className={styles.tournamentInfo}>
                            <strong>Location:</strong> {tournament.location}
                          </p>
                        )}

                        <span className={styles.viewDetails}>
                          View Details →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* -------------------------------- */}
          {/* VENUE ONLY */}
          {/* -------------------------------- */}

          <section className={styles.venueSection}>
            <h2 className={styles.sectionTitle}>Venue Information</h2>

            <div className={styles.venueGrid}>
              {venue.length === 0 ? (
                <p className={styles.noResults}>
                  Venue information not available.
                </p>
              ) : (
                venue.map((item) => {
                  if (!item.showing) return null;

                  return (
                    <div key={item._id} className={styles.venueCard}>
                      <h3 className={styles.venueTitle}>
                        {item.title || "Tournament Venue"}
                      </h3>

                      {item.venue && (
                        <h4 className={styles.venueName}>{item.venue}</h4>
                      )}

                      {item.address && (
                        <p className={styles.venueAddress}>{item.address}</p>
                      )}

                      {item.mapLink && (
                        <div className={styles.mapContainer}>
                          <iframe
                            src={item.mapLink}
                            width="600"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className={styles.mapFrame}
                            title={item.title || "Tournament Venue Map"}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Tournaments;

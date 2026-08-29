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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backend = import.meta.env.VITE_APP_BACKEND_URL;

        const [tournamentsResponse, mainEventsResponse, venueResponse] =
          await Promise.all([
            axios.get(`${backend}/api/tournaments/`),
            axios.get(`${backend}/api/main-events`),
            axios.get(`${backend}/api/venue/`),
          ]);

        console.log("🔥 TOURNAMENTS:", tournamentsResponse.data);
        console.log("🔥 MAIN EVENTS:", mainEventsResponse.data);
        console.log("🔥 VENUE:", venueResponse.data);

        setTournaments(tournamentsResponse.data.data || []);
        setMainEvents(mainEventsResponse.data.data || []);
        setVenue(venueResponse.data.data || []);
      } catch (err) {
        console.error("Error fetching tournaments:", err);
        setError("Unable to load tournaments.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <div style={{ padding: "50px" }}>
        <h1>Loading tournaments...</h1>
      </div>
    );
  }

  // ============================
  // ERROR
  // ============================

  if (error) {
    return (
      <div style={{ padding: "50px" }}>
        <h1>{error}</h1>
      </div>
    );
  }

  // =====================================================
  // COMBINE NORMAL + DISPLAY TOURNAMENTS + MAIN EVENTS
  // =====================================================

  const allTournaments = [
    ...tournaments.map((tournament) => ({
      ...tournament,
      sourceType: "tournament",
    })),

    ...mainEvents.map((event) => ({
      ...event,
      sourceType: "mainEvent",
    })),
  ];

  return (
    <div className={styles.rootContainer}>
      <div className={styles.mainContentWrapper}>
        <div className={styles.contentContainer}>
          {/* ========================================= */}
          {/* TOURNAMENTS */}
          {/* ========================================= */}

          <section className={styles.upcomingTournaments}>
            <h1 className={styles.sectionTitle}>Tournaments</h1>

            {allTournaments.length === 0 ? (
              <p className={styles.noResults}>No tournaments available.</p>
            ) : (
              <div>
                {allTournaments.map((item) => {
                  // -----------------------------------
                  // NORMAL / DISPLAY TOURNAMENT
                  // -----------------------------------

                  if (item.sourceType === "tournament") {
                    return (
                      <Link
                        key={`tournament-${item._id}`}
                        to={`/tournaments/${item._id}`}
                        style={{
                          display: "block",
                          padding: "20px",
                          marginBottom: "15px",
                          border: "1px solid #ccc",
                          borderRadius: "12px",
                          textDecoration: "none",
                          color: "black",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <h2>{item.name}</h2>

                        {/* Date */}

                        {item.date && (
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                        )}

                        {item.startDate && (
                          <p>
                            <strong>Start Date:</strong>{" "}
                            {new Date(item.startDate).toLocaleDateString()}
                          </p>
                        )}

                        {item.endDate && (
                          <p>
                            <strong>End Date:</strong>{" "}
                            {new Date(item.endDate).toLocaleDateString()}
                          </p>
                        )}

                        {/* Location */}

                        {item.location && (
                          <p>
                            <strong>Location:</strong> {item.location}
                          </p>
                        )}

                        <strong>View Details →</strong>
                      </Link>
                    );
                  }

                  // -----------------------------------
                  // MAIN EVENT
                  // -----------------------------------

                  return (
                    <Link
                      key={`main-event-${item._id}`}
                      to={`/tournaments/main-event/${item._id}`}
                      style={{
                        display: "block",
                        padding: "20px",
                        marginBottom: "15px",
                        border: "1px solid #ccc",
                        borderRadius: "12px",
                        textDecoration: "none",
                        color: "black",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <h2>{item.name}</h2>

                      {item.date && (
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      )}

                      {item.location && (
                        <p>
                          <strong>Location:</strong> {item.location}
                        </p>
                      )}

                      <strong>View Details →</strong>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* ========================================= */}
          {/* VENUE ONLY */}
          {/* ========================================= */}

          <section className={styles.section} id="venue">
            <h2 className={styles.sectionTitle}>Venue</h2>

            <div className={styles.gridContainerMaps}>
              {venue.length === 0 ? (
                <p className={styles.noResults}>
                  No venue information available.
                </p>
              ) : (
                venue
                  .filter((item) => item.showing)
                  .map((item) => (
                    <div className={styles.tile} key={item._id}>
                      {item.title && (
                        <h3 className={styles.tileTitle}>{item.title}</h3>
                      )}

                      {item.venue && <h2>{item.venue}</h2>}

                      {item.address && (
                        <p className={styles.tileParagraph}>{item.address}</p>
                      )}

                      {/* In case venue data is stored in value */}

                      {item.value && !item.venue && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.value,
                          }}
                        />
                      )}

                      {/* Google Map */}

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
                  ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Tournaments;

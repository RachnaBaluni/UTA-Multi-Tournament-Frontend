import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Tournaments.module.css";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [mainEvents, setMainEvents] = useState([]);
  const [tournamentDetail, setTournamentDetail] = useState([]);
  const [pricesBenefit, setPricesBenefit] = useState([]);
  const [venue, setVenue] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const backend = import.meta.env.VITE_APP_BACKEND_URL;

        const [
          tournamentsResponse,
          mainEventsResponse,
          tournamentDetailsResponse,
          pricesBenefitResponse,
          venueResponse,
        ] = await Promise.all([
          axios.get(`${backend}/api/tournaments/`),
          axios.get(`${backend}/api/main-events`),
          axios.get(`${backend}/api/tournament-details/`),
          axios.get(`${backend}/api/prices-benifit/`),
          axios.get(`${backend}/api/venue/`),
        ]);

        console.log("🔥 ALL TOURNAMENTS:", tournamentsResponse.data);
        console.log("🔥 MAIN EVENTS:", mainEventsResponse.data);
        console.log("🔥 TOURNAMENT DETAILS:", tournamentDetailsResponse.data);
        console.log("🔥 PRICES BENEFIT:", pricesBenefitResponse.data);
        console.log("🔥 VENUE:", venueResponse.data);

        setTournaments(tournamentsResponse.data.data || []);
        setMainEvents(mainEventsResponse.data.data || []);
        setTournamentDetail(tournamentDetailsResponse.data.data || []);
        setPricesBenefit(pricesBenefitResponse.data.data || []);
        setVenue(venueResponse.data.data || []);
      } catch (err) {
        console.error("Error fetching tournament page data:", err);
        setError("Unable to load tournament information.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
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

  // ============================
  // FILTER TOURNAMENTS
  // ============================
  const normalTournaments = tournaments.filter(
    (tournament) => tournament.type === "normal",
  );

  const displayTournaments = tournaments.filter(
    (tournament) => tournament.type === "display",
  );

  return (
    <div className={styles.rootContainer}>
      <div className={styles.mainContentWrapper}>
        <div className={styles.contentContainer}>
          {/* ========================================= */}
          {/* PAGE TITLE */}
          {/* ========================================= */}

          <h1 className={styles.sectionTitle}>Tournaments</h1>

          {/* ========================================= */}
          {/* NORMAL TOURNAMENTS */}
          {/* ========================================= */}

          <section className={styles.upcomingTournaments}>
            <h2 className={styles.monthlyHeader}>Normal Tournaments</h2>

            {normalTournaments.length === 0 ? (
              <p className={styles.noResults}>
                No normal tournaments available.
              </p>
            ) : (
              <div>
                {normalTournaments.map((tournament) => (
                  <Link
                    key={tournament._id}
                    to={`/tournaments/${tournament._id}`}
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
                    <h2>{tournament.name}</h2>

                    {tournament.startDate && (
                      <p>
                        <strong>Start Date:</strong>{" "}
                        {new Date(tournament.startDate).toLocaleDateString()}
                      </p>
                    )}

                    {tournament.endDate && (
                      <p>
                        <strong>End Date:</strong>{" "}
                        {new Date(tournament.endDate).toLocaleDateString()}
                      </p>
                    )}

                    {tournament.location && (
                      <p>
                        <strong>Location:</strong> {tournament.location}
                      </p>
                    )}

                    {tournament.director && (
                      <p>
                        <strong>Director:</strong> {tournament.director}
                      </p>
                    )}

                    {tournament.status && (
                      <p>
                        <strong>Status:</strong> {tournament.status}
                      </p>
                    )}

                    <strong>View Details →</strong>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* ========================================= */}
          {/* DISPLAY TOURNAMENTS */}
          {/* ========================================= */}

          <section className={styles.upcomingTournaments}>
            <h2 className={styles.monthlyHeader}>Display Tournaments</h2>

            {displayTournaments.length === 0 ? (
              <p className={styles.noResults}>
                No display tournaments available.
              </p>
            ) : (
              <div>
                {displayTournaments.map((tournament) => (
                  <Link
                    key={tournament._id}
                    to={`/tournaments/${tournament._id}`}
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
                    <h2>{tournament.name}</h2>

                    {tournament.description && <p>{tournament.description}</p>}

                    {tournament.date && (
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(tournament.date).toLocaleDateString()}
                      </p>
                    )}

                    {tournament.location && (
                      <p>
                        <strong>Location:</strong> {tournament.location}
                      </p>
                    )}

                    {tournament.organizer && (
                      <p>
                        <strong>Organizer:</strong> {tournament.organizer}
                      </p>
                    )}

                    <strong>View Details →</strong>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* ========================================= */}
          {/* MAIN EVENTS */}
          {/* ========================================= */}

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Main Events</h2>

            <div className={styles.gridContainer}>
              {mainEvents.length === 0 ? (
                <p className={styles.noResults}>No main events available.</p>
              ) : (
                mainEvents.map((event) => (
                  <div className={styles.tile} key={event._id}>
                    <h3 className={styles.tileTitle}>{event.name}</h3>

                    {event.description && (
                      <p className={styles.tileParagraph}>
                        {event.description}
                      </p>
                    )}

                    {event.date && (
                      <p className={styles.tileParagraph}>
                        <strong>Date:</strong>{" "}
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    )}

                    {event.location && (
                      <p className={styles.tileParagraph}>
                        <strong>Location:</strong> {event.location}
                      </p>
                    )}

                    {event.organizer && (
                      <p className={styles.tileParagraph}>
                        <strong>Organizer:</strong> {event.organizer}
                      </p>
                    )}

                    {event.rules && (
                      <div>
                        <h4>Rules</h4>

                        <div
                          dangerouslySetInnerHTML={{
                            __html: event.rules,
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* ========================================= */}
          {/* TOURNAMENT DETAILS */}
          {/* ========================================= */}

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Tournament Details</h2>

            <div className={styles.gridContainer}>
              {tournamentDetail.length === 0 ? (
                <p className={styles.noResults}>
                  No tournament details available.
                </p>
              ) : (
                tournamentDetail
                  .filter((item) => item.showing)
                  .map((item) => (
                    <div className={styles.tile} key={item._id}>
                      {item.title && (
                        <h3 className={styles.tileTitle}>{item.title}</h3>
                      )}

                      {item.value && (
                        <div
                          className="db-content"
                          dangerouslySetInnerHTML={{
                            __html: item.value,
                          }}
                        />
                      )}
                    </div>
                  ))
              )}
            </div>
          </section>

          {/* ========================================= */}
          {/* PRIZES & BENEFITS */}
          {/* ========================================= */}

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Prizes & Benefits</h2>

            <div className={styles.gridContainer}>
              {pricesBenefit.length === 0 ? (
                <p className={styles.noResults}>
                  No prizes or benefits available.
                </p>
              ) : (
                pricesBenefit
                  .filter((item) => item.showing)
                  .map((item) => (
                    <div className={styles.tile} key={item._id}>
                      {item.title && (
                        <h3 className={styles.tileTitle}>{item.title}</h3>
                      )}

                      {item.value && (
                        <div
                          className="db-content"
                          dangerouslySetInnerHTML={{
                            __html: item.value,
                          }}
                        />
                      )}
                    </div>
                  ))
              )}
            </div>
          </section>

          {/* ========================================= */}
          {/* VENUE */}
          {/* ========================================= */}

          <section className={styles.section} id="contactInfo">
            <h2 className={styles.sectionTitle}>
              Venue & Important Information
            </h2>

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

                      {item.value && (
                        <div
                          className="db-content"
                          dangerouslySetInnerHTML={{
                            __html: item.value,
                          }}
                        />
                      )}

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
                          ></iframe>
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

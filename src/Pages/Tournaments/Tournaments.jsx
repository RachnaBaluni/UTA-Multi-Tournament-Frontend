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

  const [loading, setLoading] = useState(true);

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

                    <Link
                      to={`/tournaments/${tournament._id}`}
                      className={styles.viewDetailsButton}
                    >
                      View Details →
                    </Link>
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

      <Footer />
    </div>
  );
}

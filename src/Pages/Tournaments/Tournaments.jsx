import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./TournamentDetail.module.css";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

const TournamentDetail = () => {
  const { id } = useParams();

  const [tournament, setTournament] = useState(null);
  const [tournamentDetails, setTournamentDetails] = useState([]);
  const [pricesBenefits, setPricesBenefits] = useState([]);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

  // =========================================================
  // FETCH TOURNAMENT
  // =========================================================

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        setError(null);

        let tournamentData = null;

        // -----------------------------------------------------
        // FIRST TRY MAIN EVENT
        // -----------------------------------------------------

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
          console.log("Main event not found, checking tournament...");
        }

        // -----------------------------------------------------
        // IF NOT MAIN EVENT, TRY NORMAL TOURNAMENT
        // -----------------------------------------------------

        if (!tournamentData) {
          const response = await axios.get(
            `${BACKEND_URL}/api/tournaments/${id}`,
          );

          if (response.data?.success && response.data?.data) {
            tournamentData = {
              ...response.data.data,
              itemType: "tournament",
            };
          }
        }

        if (!tournamentData) {
          throw new Error("Tournament not found");
        }

        console.log("SELECTED TOURNAMENT:", tournamentData);

        setTournament(tournamentData);

        // Fetch extra information
        await Promise.all([
          fetchTournamentDetails(id),
          fetchPricesBenefits(id),
        ]);
      } catch (err) {
        console.error("Error fetching tournament:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTournament();
    }
  }, [id]);

  // =========================================================
  // FETCH TOURNAMENT DETAILS
  // =========================================================

  const fetchTournamentDetails = async (tournamentId) => {
    try {
      setDetailsLoading(true);

      const response = await axios.get(
        `${BACKEND_URL}/api/tournament-details?tournamentId=${tournamentId}`,
      );

      console.log("TOURNAMENT DETAILS:", response.data);

      if (response.data?.success) {
        setTournamentDetails(response.data.data || []);
      } else {
        setTournamentDetails([]);
      }
    } catch (err) {
      console.error("Error fetching tournament details:", err);
      setTournamentDetails([]);
    } finally {
      setDetailsLoading(false);
    }
  };

  // =========================================================
  // FETCH PRIZES & BENEFITS
  // =========================================================

  const fetchPricesBenefits = async (tournamentId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/prices-benifit/`);

      console.log("PRIZES & BENEFITS:", response.data);

      if (response.data?.success) {
        const data = response.data.data || [];

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
    } catch (err) {
      console.error("Error fetching prizes & benefits:", err);
      setPricesBenefits([]);
    }
  };

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
  // TOURNAMENT DATE
  // =========================================================

  const getTournamentDate = () => {
    if (!tournament) {
      return null;
    }

    return tournament.date || tournament.startDate || tournament.endDate;
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
  // RENDER HTML
  // =========================================================

  const renderHTML = (value) => {
    if (!value) {
      return null;
    }

    if (typeof value === "string") {
      return (
        <div
          className={styles.richText}
          dangerouslySetInnerHTML={{
            __html: value,
          }}
        />
      );
    }

    return null;
  };

  // =========================================================
  // ACTION ROUTES
  // =========================================================

  const tournamentId = id;

  const actionRoutes = {
    players: `/tournaments/registered-players?tournamentId=${tournamentId}`,
    teams: `/tournaments/registered-teams?tournamentId=${tournamentId}`,
    draws: `/tournaments/draws?tournamentId=${tournamentId}`,
    results: `/tournaments/results?tournamentId=${tournamentId}`,
    viewresults: `/tournaments/viewresults?tournamentId=${tournamentId}`,
    orderOfPlay: `/tournaments/view-order-play?tournamentId=${tournamentId}`,
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className={styles.rootContainer}>
        <Header />

        <main className={styles.mainContentWrapper}>
          <div className={styles.loading}>Loading tournament details...</div>
        </main>

        <Footer />
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !tournament) {
    return (
      <div className={styles.rootContainer}>
        <Header />

        <main className={styles.mainContentWrapper}>
          <div className={styles.error}>
            <h2>Tournament not found.</h2>

            <Link to="/tournaments" className={styles.backButton}>
              ← Back to Tournaments
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className={styles.rootContainer}>
      <Header />

      <main className={styles.mainContentWrapper}>
        <div className={styles.contentContainer}>
          {/* =====================================================
              TOURNAMENT HEADER
          ====================================================== */}

          <section className={styles.detailHero}>
            <div className={styles.heroOverlay}>
              <span className={styles.heroEyebrow}>TOURNAMENT DETAILS</span>

              <h1 className={styles.heroTitle}>{tournament.name}</h1>

              <div className={styles.heroUnderline}></div>
            </div>
          </section>

          {/* =====================================================
              BASIC INFORMATION
          ====================================================== */}

          <section className={styles.infoSection}>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <span className={styles.infoLabel}>DATE</span>

                <strong className={styles.infoValue}>
                  {formatDate(getTournamentDate())}
                </strong>
              </div>

              <div className={styles.infoCard}>
                <span className={styles.infoLabel}>LOCATION</span>

                <strong className={styles.infoValue}>{getLocation()}</strong>
              </div>

              {tournament.organizer && (
                <div className={styles.infoCard}>
                  <span className={styles.infoLabel}>ORGANIZER</span>

                  <strong className={styles.infoValue}>
                    {tournament.organizer}
                  </strong>
                </div>
              )}

              {tournament.director && (
                <div className={styles.infoCard}>
                  <span className={styles.infoLabel}>TOURNAMENT DIRECTOR</span>

                  <strong className={styles.infoValue}>
                    {tournament.director}
                  </strong>
                </div>
              )}

              {tournament.directorPhone && (
                <div className={styles.infoCard}>
                  <span className={styles.infoLabel}>DIRECTOR PHONE</span>

                  <strong className={styles.infoValue}>
                    {tournament.directorPhone}
                  </strong>
                </div>
              )}

              {tournament.status && (
                <div className={styles.infoCard}>
                  <span className={styles.infoLabel}>STATUS</span>

                  <strong className={styles.statusValue}>
                    {tournament.status}
                  </strong>
                </div>
              )}
            </div>
          </section>

          {/* =====================================================
              TOURNAMENT INFORMATION BUTTONS
          ====================================================== */}

          <section className={styles.actionSection}>
            <h2 className={styles.sectionTitle}>Tournament Information</h2>

            <p className={styles.actionDescription}>
              Select an option below to view tournament information.
            </p>

            <div className={styles.actionButtons}>
              <Link to={actionRoutes.players} className={styles.actionButton}>
                View Registered Players
              </Link>

              <Link to={actionRoutes.teams} className={styles.actionButtonGrey}>
                View Registered Teams
              </Link>

              <Link to={actionRoutes.draws} className={styles.actionButton}>
                View Draws
              </Link>

              <Link
                to={actionRoutes.results}
                className={styles.actionButtonGrey}
              >
                View Results
              </Link>

              <Link
                to={actionRoutes.viewresults}
                className={styles.actionButton}
              >
                View Results 2
              </Link>

              <Link
                to={actionRoutes.orderOfPlay}
                className={styles.actionButtonGrey}
              >
                Order Of Play
              </Link>
            </div>
          </section>

          {/* =====================================================
              TOURNAMENT DETAILS
          ====================================================== */}

          {detailsLoading ? (
            <section className={styles.detailSection}>
              <div className={styles.loading}>
                Loading tournament information...
              </div>
            </section>
          ) : (
            <section className={styles.detailSection}>
              <h2 className={styles.sectionTitle}>Tournament Details</h2>

              {tournamentDetails.length > 0 ? (
                tournamentDetails.map((item) => (
                  <div key={item._id} className={styles.detailBlock}>
                    {item.title && (
                      <h3 className={styles.detailTitle}>{item.title}</h3>
                    )}

                    {item.value && renderHTML(item.value)}

                    {Array.isArray(item.rules) && item.rules.length > 0 && (
                      <ul className={styles.detailList}>
                        {item.rules.map((rule, index) => (
                          <li key={index}>{rule}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <p className={styles.noResults}>
                  No additional tournament details available.
                </p>
              )}
            </section>
          )}

          {/* =====================================================
              DESCRIPTION
          ====================================================== */}

          {tournament.description && (
            <section className={styles.detailSection}>
              <h2 className={styles.sectionTitle}>Description</h2>

              <p className={styles.paragraph}>{tournament.description}</p>
            </section>
          )}

          {/* =====================================================
              RULES
          ====================================================== */}

          {tournament.rules && (
            <section className={styles.detailSection}>
              <h2 className={styles.sectionTitle}>Rules</h2>

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

          {(pricesBenefits.length > 0 ||
            tournament.prizeMoney ||
            tournament.prizes ||
            tournament.benefits) && (
            <section className={styles.detailSection}>
              <h2 className={styles.sectionTitle}>Prizes & Benefits</h2>

              {pricesBenefits.map((item) => (
                <div key={item._id} className={styles.detailBlock}>
                  {item.title && (
                    <h3 className={styles.detailTitle}>{item.title}</h3>
                  )}

                  {item.prizeMoney && renderHTML(item.prizeMoney)}

                  {item.prizes && renderHTML(item.prizes)}

                  {item.benefits && renderHTML(item.benefits)}

                  {item.value && renderHTML(item.value)}
                </div>
              ))}

              {tournament.prizeMoney && renderHTML(tournament.prizeMoney)}

              {tournament.prizes && renderHTML(tournament.prizes)}

              {tournament.benefits && renderHTML(tournament.benefits)}
            </section>
          )}

          {/* =====================================================
              REGISTER / LOGIN
          ====================================================== */}

          {tournament.itemType === "tournament" && (
            <section className={styles.registerSection}>
              <h2 className={styles.sectionTitle}>Registration</h2>

              <p className={styles.actionDescription}>
                Register for this tournament or login to continue.
              </p>

              <div className={styles.registerButtons}>
                <Link
                  to={`/tournaments/register?tournamentId=${tournamentId}`}
                  className={styles.registerButton}
                >
                  Register Now
                </Link>

                <Link
                  to={`/tournaments/login/${tournamentId}`}
                  className={styles.loginButton}
                >
                  Login
                </Link>
              </div>
            </section>
          )}

          {/* =====================================================
              BACK
          ====================================================== */}

          <div className={styles.backContainer}>
            <Link to="/tournaments" className={styles.backButton}>
              ← Back to Tournaments
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TournamentDetail;

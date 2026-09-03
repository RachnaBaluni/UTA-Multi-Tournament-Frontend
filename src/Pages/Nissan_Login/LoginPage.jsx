import React, { useEffect, useState } from "react";
import styles from "./Nissan_Login.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useLocation } from "react-router-dom";
import LoginPage1 from "./LoginPage1/LoginPage1";
import LoginPage2 from "./LoginPage2/LoginPage2";
import LoginPage3 from "./LoginPage3/LoginPage3";
import LoginPageTournament from "./LoginPageTournament/LoginPageTournament";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

const LoginPage = () => {
  const [events, setEvents] = useState([]);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [currentPlayerTeam, setCurrentPlayerTeam] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isTournamentAllowed, setIsTournamentAllowed] = useState(true);
  const params = useParams();
  const location = useLocation();

  const tournamentId = new URLSearchParams(location.search).get("tournamentId");
  console.log("EDIT TOURNAMENT ID:", tournamentId);
  const getEvents = async (tournamentId) => {
    try {
      if (!tournamentId) return;

      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/events/?tournamentId=${tournamentId}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching events:", error);
    }
  };

  const getPlayers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/player/`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        setPlayers(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching events:", error);
    }
  };

  const getMyTournamentRegistrations = async () => {
    try {
      if (!params.id || !tournamentId) return;

      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/player/tournament-registrations/${params.id}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        const registrations = res.data.data || [];

        const isRegistered = registrations.some(
          (registration) =>
            registration.tournament?._id?.toString() ===
            tournamentId?.toString(),
        );

        if (!isRegistered) {
          setIsTournamentAllowed(false);
          toast.error("This player is not registered in this tournament.");
        }
      }
    } catch (error) {
      console.log("Error fetching tournament registrations:", error);
    }
  };

  const getLoggedInPlayer = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/player/${params.id}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        setCurrentPlayer(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching events:", error);
    }
  };

  const getLoggedInPlayerTeam = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/team/${params.id}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        const teams = res.data.data;

        setCurrentPlayerTeam(teams);

        const uniqueTournaments = [
          ...new Map(
            teams
              .filter((team) => team.eventId?.tournamentId)
              .map((team) => [
                team.eventId.tournamentId._id,
                team.eventId.tournamentId,
              ]),
          ).values(),
        ];

        setTournaments(uniqueTournaments);

        // Automatically select the tournament if there's only one unique tournament
        if (uniqueTournaments.length === 1) {
          setSelectedTournament(uniqueTournaments[0]._id);
        }
      }
    } catch (error) {
      console.log("Error fetching player teams:", error);
    }
  };

  useEffect(() => {
    getPlayers();
    getLoggedInPlayer();
    getLoggedInPlayerTeam();
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (selectedTournament) {
      getEvents(selectedTournament);
    }
  }, [selectedTournament]);
  const handleNext = () => {
    if (currentStep !== 4) {
      setCurrentStep((currentStep) => currentStep + 1);
    }
  };

  const selectedTournamentEvents = events.filter(
    (event) => event.tournamentId?._id === selectedTournament,
  );
  const handleBack = () => {
    if (currentStep !== 1) setCurrentStep((currentStep) => currentStep - 1);
  };
  return (
    <div>
      {/* <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logoWrapper}>
            <img src="/logo.png" alt="UTA LOGO" />
          </div>
          <h1 className={styles.title}>Uttranchal Tennis Association</h1>
        </div>
        <div className={styles.headerRight}>
          <Link to="/tournaments">Back to Home</Link>
        </div>
      </header> */}
      <Header />
      {isTournamentAllowed && (
        <section className={styles.formContainer}>
          {" "}
          <div className={styles.stepIndicator}>
            <div
              className={`${styles.step} ${
                currentStep >= 1 ? styles.activeStep : ""
              }`}
            >
              1. Personal Details
            </div>

            <div
              className={`${styles.stepLine} ${
                currentStep >= 2 ? styles.activeLine : ""
              }`}
            ></div>

            <div
              className={`${styles.step} ${
                currentStep >= 2 ? styles.activeStep : ""
              }`}
            >
              2. Tournament
            </div>

            <div
              className={`${styles.stepLine} ${
                currentStep >= 3 ? styles.activeLine : ""
              }`}
            ></div>

            <div
              className={`${styles.step} ${
                currentStep >= 3 ? styles.activeStep : ""
              }`}
            >
              3. Event Selection
            </div>

            <div
              className={`${styles.stepLine} ${
                currentStep >= 4 ? styles.activeLine : ""
              }`}
            ></div>

            <div
              className={`${styles.step} ${
                currentStep >= 4 ? styles.activeStep : ""
              }`}
            >
              4. Confirmation
            </div>
          </div>
          <section>
            {currentStep === 1 && (
              <LoginPage1
                player={currentPlayer}
                handleNext={handleNext}
                id={params.id}
                setPlayer={setCurrentPlayer}
                tournamentId={tournamentId}
              />
            )}
          </section>
          <section>
            {currentStep === 2 && (
              <LoginPageTournament
                tournaments={tournaments}
                selectedTournament={selectedTournament}
                setSelectedTournament={setSelectedTournament}
                handleNext={handleNext}
                handleBack={handleBack}
              />
            )}
          </section>
          <section>
            {currentStep === 3 && (
              <LoginPage2
                player={currentPlayer}
                events={events}
                players={players}
                handleNext={handleNext}
                handleBack={handleBack}
                playerTeam={currentPlayerTeam}
                selectedTournament={selectedTournament}
              />
            )}
          </section>
          <section>{currentStep === 4 && <LoginPage3 />}</section>{" "}
        </section>
      )}
      <Footer />
    </div>
  );
};

export default LoginPage;

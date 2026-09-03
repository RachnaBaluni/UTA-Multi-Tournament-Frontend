import React, { useEffect, useState } from "react";
import styles from "./Register.module.css";
import { Link, useSearchParams } from "react-router-dom";
import RegisterPage1 from "./RegisterPage1/RegisterPage1";
import axios from "axios";
import RegisterPage2 from "./RegisterPage2/RegisterPage2";
import RegisterPageTournament from "./RegisterPageTournament/RegisterPageTournament";
import RegisterPage3 from "./RegisterPage3/RegisterPage3";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import { useSelector } from "react-redux";

const Register = () => {
  console.log("REGISTER COMPONENT RENDERED");
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get("tournamentId");
  console.log("🔥 REGISTER TOURNAMENT ID:", tournamentId);
  const reduxUser = useSelector((state) => state.user.user);
  const user = reduxUser?.user || reduxUser;
  const [events, setEvents] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [players, setPlayers] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [registrationFields, setRegistrationFields] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    whatsappNumber: "",
    dob: "",
    email: "",
    city: "",
    shirtSize: "",
    shortSize: "M",
    foodPref: "Veg",
    stay: false,
    feePaid: false,
    transactionDetails: "",
    tournamentId: tournamentId || null,
    playerId: null,

    event1: null,
    partner1: null,
    event2: null,
    partner2: null,

    password: "",
    confirmPassword: "",
  });

  const getEvents = async (tournamentId) => {
    if (!tournamentId) {
      setEvents([]);
      return;
    }

    try {
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
      setEvents([]);
    }
  };
  const getTournaments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/tournaments/`,
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        setTournaments(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching tournaments:", error);
    }
  };

  const getRegistrationFields = async (tournamentId) => {
    if (!tournamentId) {
      setRegistrationFields({});
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/tournaments/${tournamentId}`,
        {
          withCredentials: true,
        },
      );

      console.log("TOURNAMENT REGISTRATION FIELDS:", res.data);

      if (res.data.success) {
        setRegistrationFields(res.data.data.registrationFields || {});
      }
    } catch (error) {
      console.log("Error fetching tournament registration fields:", error);
      setRegistrationFields({});
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

  useEffect(() => {
    console.log("CSS MODULE STYLES: ", styles);

    getTournaments();
    getPlayers();
    window.scrollTo(0, 0);

    if (user?._id) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        whatsappNumber: user.whatsappNumber || user.number || "",
        dob: user.dob ? user.dob.split("T")[0] : "",
        email: user.email || user.emailAddress || "",
        city: user.city || "",
        tournamentId: tournamentId || null,
        playerId: user._id,
      }));
    } else if (tournamentId) {
      setFormData((prev) => ({
        ...prev,
        tournamentId,
      }));
    }
  }, [user?._id, tournamentId]);

  const handleNext = () => {
    const handleNext = () => {
      // If tournament is already selected from the URL,
      // skip the Tournament page and go directly to Event Selection.
      if (currentStep === 1 && tournamentId) {
        getEvents(tournamentId);
        getRegistrationFields(tournamentId);
        setCurrentStep(3);
        return;
      }

      if (currentStep === 2) {
        getEvents(formData.tournamentId);
        getRegistrationFields(formData.tournamentId);
      }

      if (currentStep !== 4) {
        setCurrentStep((currentStep) => currentStep + 1);
      }
    };
    const handleBack = () => {
      if (currentStep !== 1) setCurrentStep((currentStep) => currentStep - 1);
    };
    console.log("REGISTER CURRENT STEP:", currentStep);
    console.log("REGISTER TOURNAMENT ID:", tournamentId);
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
        <section className={styles.formContainer}>
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
              <RegisterPage1
                formData={formData}
                handleNext={handleNext}
                setFormData={setFormData}
                isLoggedIn={!!user?._id}
              />
            )}
          </section>
          <section>
            {currentStep === 2 && (
              <RegisterPageTournament
                formData={formData}
                handleNext={handleNext}
                setFormData={setFormData}
                handleBack={handleBack}
                tournaments={tournaments}
                tournamentId={tournamentId}
              />
            )}
          </section>
          <section>
            {currentStep === 3 && (
              <RegisterPage2
                formData={formData}
                handleNext={handleNext}
                handleBack={handleBack}
                setFormData={setFormData}
                events={events}
                players={players}
                registrationFields={registrationFields}
              />
            )}
          </section>
          <section>
            {currentStep === 4 && (
              <RegisterPage3
                formData={formData}
                handleBack={handleBack}
                setFormData={setFormData}
              />
            )}
          </section>
        </section>
        <Footer />
      </div>
    );
  };
};
export default Register;

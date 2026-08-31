import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import styles from "./Nissan_Login.module.css";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

const Nissan_Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tournamentId = new URLSearchParams(location.search).get("tournamentId");
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!login.email || !login.password) {
      return toast.error("Please enter your email and password.");
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/player/login`,
        login,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        console.log("LOGIN RESPONSE ", res.data);
        console.log("PLAYER DATA ", res.data.data);

        const token = res.data.token || res.data.data?.token;

        // Check whether player is registered in this tournament
        const teamRes = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/team/${res.data.data.id}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          },
        );

        const teams = teamRes.data.data || [];

        const isRegisteredInTournament = teams.some(
          (team) =>
            team.eventId?.tournamentId?._id?.toString() ===
            tournamentId?.toString(),
        );

        // Player is NOT registered in selected tournament
        if (!isRegisteredInTournament) {
          toast.error("This player is not registered in this tournament.");
          return;
        }

        // Player is registered → continue
        localStorage.setItem("token", token);

        navigate(
          `/tournaments/login/${res.data.data.id}?tournamentId=${tournamentId}`,
        );

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Incorrect Credentials");
      console.log(error);
    }
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
      <section className={styles.formContainer}>
        <form className={styles.loginForm} onSubmit={loginHandler}>
          <h2 className={styles.formTitle}>Player Login</h2>
          <p className={styles.formSubtitle}>
            Access your player dashboard to manage your events.
          </p>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>

            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="Enter your email"
              value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>

            <input
              type="password"
              id="password"
              className={styles.input}
              placeholder="Enter your password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className={styles.loginButton}>
            Login
          </button>

          <p className={styles.registerPrompt}>
            Don't have an account?{" "}
            <Link to="/tournaments/register" className={styles.registerLink}>
              Register here
            </Link>
          </p>
        </form>
      </section>
      <Footer />
    </div>
  );
};

export default Nissan_Login;

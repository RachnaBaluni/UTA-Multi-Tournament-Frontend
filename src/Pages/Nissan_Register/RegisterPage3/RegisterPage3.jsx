import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./RegisterPage3.module.css";

const RegisterPage3 = ({ formData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const registerPlayer = async () => {
    setIsLoading(true);
    setSuccess(null);
    setErrorMessage("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/player/register/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        setSuccess(true);
      } else {
        setSuccess(false);
        setErrorMessage(res.data.message || "Registration failed.");
      }
    } catch (error) {
      console.log("REGISTER ERROR RESPONSE:", error.response?.data);
      console.log("REGISTER ERROR STATUS:", error.response?.status);
      console.log("REGISTER ERROR:", error);

      setSuccess(false);

      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred during registration.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // Page 3 par aate hi registration automatically submit hoga
    registerPlayer();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.messageCard}>
        {/* Loading */}
        {isLoading && (
          <>
            <div className={styles.loadingSpinner}></div>

            <h2 className={styles.title}>Registering Player...</h2>

            <p className={styles.message}>
              Please wait while we process your registration.
            </p>
          </>
        )}

        {/* Success */}
        {!isLoading && success && (
          <>
            <span className={styles.successIcon}>&#10003;</span>

            <h2 className={styles.title}>Registration Successful!</h2>

            <p className={styles.message}>
              Your account has been successfully created. You can now log in.
            </p>

            <button
              className={styles.button}
              onClick={() => (window.location.href = "/tournaments/login")}
            >
              Go to Login
            </button>
          </>
        )}

        {/* Failed */}
        {!isLoading && success === false && (
          <>
            <span className={styles.errorIcon}>&#10006;</span>

            <h2 className={styles.title}>Registration Failed</h2>

            <p className={styles.message}>
              {errorMessage ||
                "There was an issue with your registration. Please try again."}
            </p>

            <button
              className={styles.button}
              onClick={() => window.location.reload()}
            >
              Retry Registration
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage3;

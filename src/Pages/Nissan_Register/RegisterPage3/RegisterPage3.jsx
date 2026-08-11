import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./RegisterPage3.module.css"; // Import the CSS module

const RegisterPage3 = ({ formData }) => {
  // Destructure formData directly
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(null); // Use null initially to distinguish from true/false
  const [errorMessage, setErrorMessage] = useState(""); // State to store error messages

  const registerPlayer = async () => {
    try {
      const res = await axios.post(
        // Await the axios call directly
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/player/register/`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setSuccess(true);
      } else {
        setSuccess(false);
        setErrorMessage(res.data.message || "Registration failed."); // Handle specific error messages if backend provides
      }
    } catch (error) {
      console.log(error);
      setSuccess(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
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
    registerPlayer();
  }, []); // Add formData to dependency array if it changes and should trigger re-registration

  return (
    <div className={styles.container}>
      <div className={styles.messageCard}>
        {isLoading && (
          <>
            <div className={styles.loadingSpinner}></div>
            <h2 className={styles.title}>Registering Player...</h2>
            <p className={styles.message}>
              Please wait while we process your registration.
            </p>
          </>
        )}

        {!isLoading && success && (
          <>
            <span className={styles.successIcon}>&#10003;</span>{" "}
            {/* Checkmark icon */}
            <h2 className={styles.title}>Registration Successful!</h2>
            <p className={styles.message}>
              Your account has been successfully created. You can now log in.
            </p>
            {/* You might want a button to navigate to the login page */}
            <button
              className={styles.button}
              onClick={() => (window.location.href = "/tournaments/login")}
            >
              Go to Login
            </button>
          </>
        )}

        {!isLoading && success === false && (
          <>
            <span className={styles.errorIcon}>&#10006;</span> {/* X icon */}
            <h2 className={styles.title}>Registration Failed</h2>
            <p className={styles.message}>
              {errorMessage ||
                "There was an issue with your registration. Please try again."}
            </p>
            {/* You might want a button to go back or retry */}
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

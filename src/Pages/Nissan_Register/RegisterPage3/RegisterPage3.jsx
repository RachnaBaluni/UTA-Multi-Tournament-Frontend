import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./RegisterPage3.module.css"; // Import the CSS module

const RegisterPage3 = ({ formData, setFormData }) => {
  // Destructure formData directly
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null); // Use null initially to distinguish from true/false
  const [errorMessage, setErrorMessage] = useState(""); // State to store error messages

  const registerPlayer = async () => {
    if (!formData.password) {
      setErrorMessage("Please create a password.");
      return;
    }
    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }
    if (
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[@$!%*?&]/.test(formData.password)
    ) {
      setErrorMessage(
        "Password must include uppercase, lowercase, number and special character.",
      );
      return;
    }
    if (!formData.confirmPassword) {
      setErrorMessage("Please confirm your password.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    setIsLoading(true);

    try {
      const res = await axios.post(
        // Await the axios call directly
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/player/register/`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        setSuccess(true);
      } else {
        setSuccess(false);
        setErrorMessage(res.data.message || "Registration failed."); // Handle specific error messages if backend provides
      }
    } catch (error) {
      console.log("REGISTER ERROR RESPONSE:", error.response?.data);
      console.log("REGISTER ERROR STATUS:", error.response?.status);
      console.log("REGISTER ERROR:", error);

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
  }, []); // Add formData to dependency array if it changes and should trigger re-registration

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Create Your Password</h2>

        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => {
              setFormData({
                ...formData,
                password: e.target.value,
              });
              setErrorMessage("");
            }}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({
                ...formData,
                confirmPassword: e.target.value,
              });
              setErrorMessage("");
            }}
          />
        </div>

        {errorMessage && !success && (
          <p className={styles.errorMessage}>{errorMessage}</p>
        )}

        <button
          className={styles.button}
          onClick={registerPlayer}
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Create Account"}
        </button>
      </div>
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

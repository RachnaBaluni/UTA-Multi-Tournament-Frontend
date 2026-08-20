import React, { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import { toast } from "sonner"; // Import toast from sonner
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/user.slice";

const LOGIN_API_ENDPOINT = `${
  import.meta.env.VITE_APP_BACKEND_URL
}/api/player/login`;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to manage the active login type (Player, Coach, Academy, District)
  const [loginType, setLoginType] = useState("Player"); // Default to Player login

  // State for form data
  const [loginForm, setLoginForm] = useState({
    identifier: "", // phone number
    dob: "",
  });

  // State for loading status to disable button during API call
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles changes to form input fields.
   * Updates the loginForm state.
   * @param {Object} e - The event object from the input change.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles the login button click.
   * Integrates the API call for user login.
   */
  const handleLogin = async () => {
    if (!loginForm.identifier || !loginForm.dob) {
      toast.warning("Please enter your WhatsApp number and date of birth.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(LOGIN_API_ENDPOINT, {
        whatsappNumber: loginForm.identifier.trim(),
        dob: loginForm.dob.trim(),
      });

      // 🔥 SAVE TOKEN
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAuthenticated", "true");

      dispatch(setUser({ ...res.data.user, type: loginType }));

      toast.success(res.data.message || "Login successful");

      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.rootContainer}>
      <div className={styles.layoutContainer}>
        <div className={styles.mainContentWrapper}>
          <div className={styles.contentContainer}>
            <h2 className={styles.loginTitle}>Login to Your Account</h2>

            {/* Login Type Selection Buttons */}
            <div className={styles.typeButtonsContainer}>
              <button
                className={`${styles.typeButton} ${
                  loginType === "Player" ? styles.activeTypeButton : ""
                }`}
                onClick={() => setLoginType("Player")}
                disabled={isLoading} // Disable buttons during loading
              >
                Player Login
              </button>
              <button
                className={`${styles.typeButton} ${
                  loginType === "Coach" ? styles.activeTypeButton : ""
                }`}
                onClick={() => setLoginType("Coach")}
                disabled={isLoading}
              >
                Coach Login
              </button>
              <button
                className={`${styles.typeButton} ${
                  loginType === "Academy" ? styles.activeTypeButton : ""
                }`}
                onClick={() => setLoginType("Academy")}
                disabled={isLoading}
              >
                Academy Login
              </button>
              <button
                className={`${styles.typeButton} ${
                  loginType === "District" ? styles.activeTypeButton : ""
                }`}
                onClick={() => setLoginType("District")}
                disabled={isLoading}
              >
                District Login
              </button>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formField}>
                <p className={styles.fieldLabel}>WhatsApp Number</p>{" "}
                <input
                  name="identifier"
                  placeholder="Enter your WhatsApp number"
                  className={styles.formInput}
                  type="text"
                  value={loginForm.identifier}
                  onChange={handleChange}
                  disabled={isLoading} // Disable input during loading
                />
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formField}>
                <p className={styles.fieldLabel}>Date of Birth</p>
                <input
                  name="dob"
                  placeholder="DD/MM/YYYY"
                  className={styles.formInput}
                  type="text"
                  value={loginForm.dob}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </label>
            </div>
            <div className={styles.submitButtonContainer}>
              <button
                className={styles.submitButton}
                onClick={handleLogin}
                disabled={isLoading} // Disable submit button during loading
              >
                <span className={styles.submitButtonText}>
                  {isLoading ? "Logging in..." : "Login"}
                </span>
              </button>
            </div>
            <p className={styles.forgotPasswordText}>Forgot Password?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

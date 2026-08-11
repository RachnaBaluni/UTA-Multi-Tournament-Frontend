import React, { useState } from "react";
import axios from "axios";
import styles from "./JoinUs.module.css";
import { toast } from "sonner"; // Assuming 'sonner' is installed and configured

const PlayerForm = () => {
  // State for form data
  const [playerForm, setPlayerForm] = useState({
    type: "Player",
    name: "",
    dob: "",
    gender: "",
    number: "",
    email: "",
    address: "",
    experience: "", // Corrected typo from 'experince' to 'experience'
    academy: "",
    password: "",
    confirmPassword: "",
  });

  // State to manage validation errors for each field
  const [errors, setErrors] = useState({});

  // State to manage loading status of the form submission
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles changes to form input fields.
   * Updates the playerForm state and clears any existing error for that field.
   * @param {Object} e - The event object from the input change.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayerForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error message for the specific field as the user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /**
   * Performs client-side validation of all form fields.
   * Updates the 'errors' state with validation messages.
   * @returns {boolean} True if all fields are valid, false otherwise.
   */
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Name validation
    if (!playerForm.name.trim()) {
      newErrors.name = "Full Name is required.";
      isValid = false;
    } else if (playerForm.name.trim().length < 3) {
      newErrors.name = "Full Name must be at least 3 characters long.";
      isValid = false;
    }

    // Date of Birth validation (basic DD/MM/YYYY format)
    if (!playerForm.dob.trim()) {
      newErrors.dob = "Date of Birth is required.";
      isValid = false;
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(playerForm.dob)) {
      newErrors.dob = "Date of Birth must be in DD/MM/YYYY format.";
      isValid = false;
    }

    // Gender validation
    if (!playerForm.gender) {
      newErrors.gender = "Gender is required.";
      isValid = false;
    }

    // Contact Number validation (basic 10-digit number)
    if (!playerForm.number.trim()) {
      newErrors.number = "Contact Number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(playerForm.number)) {
      newErrors.number = "Contact Number must be 10 digits.";
      isValid = false;
    }

    // Email Address validation
    if (!playerForm.email.trim()) {
      newErrors.email = "Email Address is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(playerForm.email)) {
      newErrors.email = "Email Address is invalid.";
      isValid = false;
    }

    // Address validation
    if (!playerForm.address.trim()) {
      newErrors.address = "Address is required.";
      isValid = false;
    } else if (playerForm.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters long.";
      isValid = false;
    }

    // Playing Experience validation
    if (!playerForm.experience) {
      newErrors.experience = "Playing Experience is required.";
      isValid = false;
    }

    // Academy Affiliation (optional, but if provided, validate min length)
    if (playerForm.academy.trim() && playerForm.academy.trim().length < 3) {
      newErrors.academy = "Academy name must be at least 3 characters.";
      isValid = false;
    }

    // Password validation (min 8 chars, at least one digit, one special char, one letter)
    if (!playerForm.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (playerForm.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
      isValid = false;
    } else if (
      !/(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}/.test(playerForm.password)
    ) {
      newErrors.password =
        "Password must contain at least one number, one special character, and one letter.";
      isValid = false;
    }

    // Confirm Password validation
    if (!playerForm.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
      isValid = false;
    } else if (playerForm.password !== playerForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors); // Update the errors state with all found errors
    return isValid;
  };

  /**
   * Handles the form submission event.
   * Performs client-side validation and then sends data to the backend.
   * Provides user feedback using toast notifications.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading state

    // Run client-side validation
    if (!validateForm()) {
      toast.warning("⚠️ Please correct the errors in the form.");
      setIsLoading(false); // Stop loading if validation fails
      return;
    }
    // Prepare a promise for toast.promise to track
    const submitPromise = axios.post(
      `${import.meta.env.VITE_APP_BACKEND_URL}/api/member/register`,
      playerForm, // Send all form data
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    // Use toast.promise for integrated loading, success, and error messages
    toast.promise(submitPromise, {
      loading: "Registering player...",
      success: (res) => {
        // Reset form on success
        setPlayerForm({
          type: "Player",
          name: "",
          dob: "",
          gender: "",
          number: "",
          email: "",
          address: "",
          experience: "",
          academy: "",
          password: "",
          confirmPassword: "",
        });
        return res.data.message || "Player registered successfully!";
      },
      error: (err) => {
        // Extract error message from response or provide a default
        return (
          err.response?.data?.message || "Failed to register player. Try again."
        );
      },
    });

    // Always stop loading, regardless of success or failure (toast.promise handles the UI feedback)
    submitPromise.finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <>
      <h3 className={styles.formSectionTitle}>Player Membership</h3>
      {/* noValidate attribute prevents default browser HTML5 validation */}
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Full Name <span className={styles.required}>*</span>
            </p>
            <input
              name="name"
              value={playerForm.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`${styles.formInput} ${
                errors.name ? styles.inputError : ""
              }`}
              type="text"
              required
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby="name-error"
            />
            {errors.name && (
              <p id="name-error" className={styles.errorMessage}>
                {errors.name}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Date of Birth <span className={styles.required}>*</span>
            </p>
            <input
              name="dob"
              value={playerForm.dob}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
              className={`${styles.formInput} ${
                errors.dob ? styles.inputError : ""
              }`}
              type="text"
              required
              aria-invalid={errors.dob ? "true" : "false"}
              aria-describedby="dob-error"
            />
            {errors.dob && (
              <p id="dob-error" className={styles.errorMessage}>
                {errors.dob}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Gender <span className={styles.required}>*</span>
            </p>
            <select
              name="gender"
              value={playerForm.gender}
              onChange={handleChange}
              className={`${styles.formSelect} ${
                errors.gender ? styles.inputError : ""
              }`}
              required
              aria-invalid={errors.gender ? "true" : "false"}
              aria-describedby="gender-error"
            >
              <option value="">Select your gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p id="gender-error" className={styles.errorMessage}>
                {errors.gender}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Contact Number <span className={styles.required}>*</span>
            </p>
            <input
              name="number"
              value={playerForm.number}
              onChange={handleChange}
              placeholder="Enter your contact number"
              className={`${styles.formInput} ${
                errors.number ? styles.inputError : ""
              }`}
              type="tel"
              required
              aria-invalid={errors.number ? "true" : "false"}
              aria-describedby="number-error"
            />
            {errors.number && (
              <p id="number-error" className={styles.errorMessage}>
                {errors.number}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Email Address <span className={styles.required}>*</span>
            </p>
            <input
              name="email"
              value={playerForm.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className={`${styles.formInput} ${
                errors.email ? styles.inputError : ""
              }`}
              type="email"
              required
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby="email-error"
            />
            {errors.email && (
              <p id="email-error" className={styles.errorMessage}>
                {errors.email}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Address <span className={styles.required}>*</span>
            </p>
            <input
              name="address"
              value={playerForm.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className={`${styles.formInput} ${
                errors.address ? styles.inputError : ""
              }`}
              type="text"
              required
              aria-invalid={errors.address ? "true" : "false"}
              aria-describedby="address-error"
            />
            {errors.address && (
              <p id="address-error" className={styles.errorMessage}>
                {errors.address}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Playing Experience <span className={styles.required}>*</span>
            </p>
            <select
              name="experience" // Corrected name
              value={playerForm.experience}
              onChange={handleChange}
              className={`${styles.formSelect} ${
                errors.experience ? styles.inputError : ""
              }`}
              required
              aria-invalid={errors.experience ? "true" : "false"}
              aria-describedby="experience-error"
            >
              <option value="">Select experience level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            {errors.experience && (
              <p id="experience-error" className={styles.errorMessage}>
                {errors.experience}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Academy Affiliation (if applicable)
            </p>
            <input
              name="academy"
              value={playerForm.academy}
              onChange={handleChange}
              placeholder="Enter academy name"
              className={`${styles.formInput} ${
                errors.academy ? styles.inputError : ""
              }`}
              type="text"
              aria-invalid={errors.academy ? "true" : "false"}
              aria-describedby="academy-error"
            />
            {errors.academy && (
              <p id="academy-error" className={styles.errorMessage}>
                {errors.academy}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Password <span className={styles.required}>*</span>
            </p>
            <input
              name="password"
              value={playerForm.password}
              onChange={handleChange}
              placeholder="Create a password"
              className={`${styles.formInput} ${
                errors.password ? styles.inputError : ""
              }`}
              type="password"
              required
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby="password-error"
            />
            {errors.password && (
              <p id="password-error" className={styles.errorMessage}>
                {errors.password}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Retype Password <span className={styles.required}>*</span>
            </p>
            <input
              name="confirmPassword"
              value={playerForm.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`${styles.formInput} ${
                errors.confirmPassword ? styles.inputError : ""
              }`}
              type="password"
              required
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby="confirm-password-error"
            />
            {errors.confirmPassword && (
              <p id="confirm-password-error" className={styles.errorMessage}>
                {errors.confirmPassword}
              </p>
            )}
          </label>
        </div>

        <div className={styles.submitButtonContainer}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading} // Disable button during submission
          >
            <span className={styles.submitButtonText}>
              {isLoading ? "Submitting..." : "Submit"}
            </span>
          </button>
        </div>
      </form>
    </>
  );
};

export default PlayerForm;

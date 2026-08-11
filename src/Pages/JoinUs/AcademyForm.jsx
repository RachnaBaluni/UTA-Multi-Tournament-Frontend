import React, { useState } from "react";
import axios from "axios";
import styles from "./JoinUs.module.css";
import { toast } from "sonner"; // Assuming 'sonner' is installed and configured

const AcademyForm = () => {
  // State for form data
  const [academyForm, setAcademyForm] = useState({
    type: "Academy",
    academyName: "",
    academyAddress: "",
    contactNumber: "",
    emailAddress: "",
    website: "",
    numberOfCoaches: "",
    numberOfPlayers: "",
    registrationNumber: "",
    // alternativeEmailAddress removed
    password: "",
    confirmPassword: "",
  });

  // State to manage validation errors for each field
  const [errors, setErrors] = useState({});

  // State to manage loading status of the form submission
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles changes to form input fields.
   * Updates the academyForm state and clears any existing error for that field.
   * @param {Object} e - The event object from the input change.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAcademyForm((prev) => ({ ...prev, [name]: value }));
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

    // Academy Name validation
    if (!academyForm.academyName.trim()) {
      newErrors.academyName = "Academy Name is required.";
      isValid = false;
    } else if (academyForm.academyName.trim().length < 3) {
      newErrors.academyName =
        "Academy Name must be at least 3 characters long.";
      isValid = false;
    }

    // Academy Address validation
    if (!academyForm.academyAddress.trim()) {
      newErrors.academyAddress = "Academy Address is required.";
      isValid = false;
    } else if (academyForm.academyAddress.trim().length < 5) {
      newErrors.academyAddress =
        "Academy Address must be at least 5 characters long.";
      isValid = false;
    }

    // Contact Number validation (basic 10-digit number)
    if (!academyForm.contactNumber.trim()) {
      newErrors.contactNumber = "Contact Number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(academyForm.contactNumber)) {
      newErrors.contactNumber = "Contact Number must be 10 digits.";
      isValid = false;
    }

    // Email Address validation
    if (!academyForm.emailAddress.trim()) {
      newErrors.emailAddress = "Email Address is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(academyForm.emailAddress)) {
      newErrors.emailAddress = "Email Address is invalid.";
      isValid = false;
    }

    // Website validation (optional, but if provided, validate format)
    if (
      academyForm.website.trim() &&
      !/^(ftp|http|https):\/\/[^ "]+$/.test(academyForm.website)
    ) {
      newErrors.website = "Website URL is invalid.";
      isValid = false;
    }

    // Number of Coaches validation
    if (academyForm.numberOfCoaches === "") {
      newErrors.numberOfCoaches = "Number of Coaches is required.";
      isValid = false;
    } else if (
      isNaN(academyForm.numberOfCoaches) ||
      parseInt(academyForm.numberOfCoaches) < 0
    ) {
      newErrors.numberOfCoaches =
        "Number of Coaches must be a non-negative number.";
      isValid = false;
    }

    // Number of Players validation
    if (academyForm.numberOfPlayers === "") {
      newErrors.numberOfPlayers = "Number of Players is required.";
      isValid = false;
    } else if (
      isNaN(academyForm.numberOfPlayers) ||
      parseInt(academyForm.numberOfPlayers) < 0
    ) {
      newErrors.numberOfPlayers =
        "Number of Players must be a non-negative number.";
      isValid = false;
    }

    // Registration Number (optional, but if provided, validate min length)
    if (
      academyForm.registrationNumber.trim() &&
      academyForm.registrationNumber.trim().length < 3
    ) {
      newErrors.registrationNumber =
        "Registration number must be at least 3 characters.";
      isValid = false;
    }

    // Password validation (min 8 chars, at least one digit, one special char, one letter)
    if (!academyForm.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (academyForm.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
      isValid = false;
    } else if (
      !/(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}/.test(academyForm.password)
    ) {
      newErrors.password =
        "Password must contain at least one number, one special character, and one letter.";
      isValid = false;
    }

    // Confirm Password validation
    if (!academyForm.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
      isValid = false;
    } else if (academyForm.password !== academyForm.confirmPassword) {
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
      academyForm, // Send all form data
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    // Use toast.promise for integrated loading, success, and error messages
    toast.promise(submitPromise, {
      loading: "Registering academy...",
      success: (res) => {
        // Reset form on success
        setAcademyForm({
          type: "Academy",
          academyName: "",
          academyAddress: "",
          contactNumber: "",
          emailAddress: "",
          website: "",
          numberOfCoaches: "",
          numberOfPlayers: "",
          registrationNumber: "",
          password: "",
          confirmPassword: "",
        });
        return res.data.message || "Academy registered successfully!";
      },
      error: (err) => {
        // Extract error message from response or provide a default
        return (
          err.response?.data?.message ||
          "Failed to register academy. Try again."
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
      <h3 className={styles.formSectionTitle}>Academy Membership</h3>
      {/* noValidate attribute prevents default browser HTML5 validation */}
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Academy Name <span className={styles.required}>*</span>
            </p>
            <input
              name="academyName"
              value={academyForm.academyName}
              onChange={handleChange}
              placeholder="Enter academy name"
              className={`${styles.formInput} ${
                errors.academyName ? styles.inputError : ""
              }`}
              type="text"
              required
              aria-invalid={errors.academyName ? "true" : "false"}
              aria-describedby="academyName-error"
            />
            {errors.academyName && (
              <p id="academyName-error" className={styles.errorMessage}>
                {errors.academyName}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Academy Address <span className={styles.required}>*</span>
            </p>
            <input
              name="academyAddress"
              value={academyForm.academyAddress}
              onChange={handleChange}
              placeholder="Enter academy address"
              className={`${styles.formInput} ${
                errors.academyAddress ? styles.inputError : ""
              }`}
              type="text"
              required
              aria-invalid={errors.academyAddress ? "true" : "false"}
              aria-describedby="academyAddress-error"
            />
            {errors.academyAddress && (
              <p id="academyAddress-error" className={styles.errorMessage}>
                {errors.academyAddress}
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
              name="contactNumber"
              value={academyForm.contactNumber}
              onChange={handleChange}
              placeholder="Enter academy contact number"
              className={`${styles.formInput} ${
                errors.contactNumber ? styles.inputError : ""
              }`}
              type="tel"
              required
              aria-invalid={errors.contactNumber ? "true" : "false"}
              aria-describedby="contactNumber-error"
            />
            {errors.contactNumber && (
              <p id="contactNumber-error" className={styles.errorMessage}>
                {errors.contactNumber}
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
              name="emailAddress"
              value={academyForm.emailAddress}
              onChange={handleChange}
              placeholder="Enter academy email address"
              className={`${styles.formInput} ${
                errors.emailAddress ? styles.inputError : ""
              }`}
              type="email"
              required
              aria-invalid={errors.emailAddress ? "true" : "false"}
              aria-describedby="emailAddress-error"
            />
            {errors.emailAddress && (
              <p id="emailAddress-error" className={styles.errorMessage}>
                {errors.emailAddress}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>Website (if applicable)</p>
            <input
              name="website"
              value={academyForm.website}
              onChange={handleChange}
              placeholder="Enter academy website URL"
              className={`${styles.formInput} ${
                errors.website ? styles.inputError : ""
              }`}
              type="text"
              aria-invalid={errors.website ? "true" : "false"}
              aria-describedby="website-error"
            />
            {errors.website && (
              <p id="website-error" className={styles.errorMessage}>
                {errors.website}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Number of Coaches <span className={styles.required}>*</span>
            </p>
            <input
              name="numberOfCoaches"
              value={academyForm.numberOfCoaches}
              onChange={handleChange}
              placeholder="Enter number of coaches"
              className={`${styles.formInput} ${
                errors.numberOfCoaches ? styles.inputError : ""
              }`}
              type="number"
              min="0"
              required
              aria-invalid={errors.numberOfCoaches ? "true" : "false"}
              aria-describedby="numberOfCoaches-error"
            />
            {errors.numberOfCoaches && (
              <p id="numberOfCoaches-error" className={styles.errorMessage}>
                {errors.numberOfCoaches}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Number of Players <span className={styles.required}>*</span>
            </p>
            <input
              name="numberOfPlayers"
              value={academyForm.numberOfPlayers}
              onChange={handleChange}
              placeholder="Enter number of players"
              className={`${styles.formInput} ${
                errors.numberOfPlayers ? styles.inputError : ""
              }`}
              type="number"
              min="0"
              required
              aria-invalid={errors.numberOfPlayers ? "true" : "false"}
              aria-describedby="numberOfPlayers-error"
            />
            {errors.numberOfPlayers && (
              <p id="numberOfPlayers-error" className={styles.errorMessage}>
                {errors.numberOfPlayers}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Registration Number (if applicable)
            </p>
            <input
              name="registrationNumber"
              value={academyForm.registrationNumber}
              onChange={handleChange}
              placeholder="Enter registration number"
              className={`${styles.formInput} ${
                errors.registrationNumber ? styles.inputError : ""
              }`}
              type="text"
              aria-invalid={errors.registrationNumber ? "true" : "false"}
              aria-describedby="registrationNumber-error"
            />
            {errors.registrationNumber && (
              <p id="registrationNumber-error" className={styles.errorMessage}>
                {errors.registrationNumber}
              </p>
            )}
          </label>
        </div>

        {/* Removed Alternative Email Address field */}

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Password <span className={styles.required}>*</span>
            </p>
            <input
              name="password"
              value={academyForm.password}
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
              value={academyForm.confirmPassword}
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

export default AcademyForm;

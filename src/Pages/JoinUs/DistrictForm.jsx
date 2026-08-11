import React, { useState } from "react";
import axios from "axios";
import styles from "./JoinUs.module.css";
import { toast } from "sonner"; // Assuming 'sonner' is installed and configured

const DistrictForm = () => {
  // List of valid districts for the dropdown and validation
  const districts = [
    "Almora",
    "Bageshwar",
    "Chamoli",
    "Champawat",
    "Dehradun",
    "Haridwar",
    "Nainital",
    "Pauri Garhwal",
    "Pithoragarh",
    "Rudraprayag",
    "Tehri Garhwal",
    "Udham Singh Nagar",
    "Uttarkashi",
  ];

  // State for form data
  const [districtForm, setDistrictForm] = useState({
    type: "District",
    districtName: "",
    presidentName: "",
    presidentEmail: "",
    presidentPhone: "",
    secretaryName: "",
    secretaryEmail: "",
    secretaryPhone: "",
    treasurerName: "",
    treasurerEmail: "",
    treasurerPhone: "",
    generalContactEmail: "",
    generalContactPhone: "",
    password: "",
    confirmPassword: "",
  });

  // State to manage validation errors for each field
  const [errors, setErrors] = useState({});

  // State to manage loading status of the form submission
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles changes to form input fields.
   * Updates the districtForm state and clears any existing error for that field.
   * @param {Object} e - The event object from the input change.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDistrictForm((prev) => ({ ...prev, [name]: value }));
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

    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^\d{10}$/; // Assuming a 10-digit phone number

    // District Name validation
    if (!districtForm.districtName) {
      newErrors.districtName = "District selection is required.";
      isValid = false;
    } else if (!districts.includes(districtForm.districtName)) {
      newErrors.districtName = "Invalid District selected.";
      isValid = false;
    }

    // President's Name validation
    if (!districtForm.presidentName.trim()) {
      newErrors.presidentName = "President's Name is required.";
      isValid = false;
    } else if (districtForm.presidentName.trim().length < 3) {
      newErrors.presidentName =
        "President's Name must be at least 3 characters long.";
      isValid = false;
    }

    // President's Email validation
    if (!districtForm.presidentEmail.trim()) {
      newErrors.presidentEmail = "President's Email is required.";
      isValid = false;
    } else if (!emailRegex.test(districtForm.presidentEmail)) {
      newErrors.presidentEmail = "President's Email is invalid.";
      isValid = false;
    }

    // President's Phone validation
    if (!districtForm.presidentPhone.trim()) {
      newErrors.presidentPhone = "President's Phone is required.";
      isValid = false;
    } else if (!phoneRegex.test(districtForm.presidentPhone)) {
      newErrors.presidentPhone = "President's Phone must be 10 digits.";
      isValid = false;
    }

    // Secretary's Name validation
    if (!districtForm.secretaryName.trim()) {
      newErrors.secretaryName = "Secretary's Name is required.";
      isValid = false;
    } else if (districtForm.secretaryName.trim().length < 3) {
      newErrors.secretaryName =
        "Secretary's Name must be at least 3 characters long.";
      isValid = false;
    }

    // Secretary's Email validation
    if (!districtForm.secretaryEmail.trim()) {
      newErrors.secretaryEmail = "Secretary's Email is required.";
      isValid = false;
    } else if (!emailRegex.test(districtForm.secretaryEmail)) {
      newErrors.secretaryEmail = "Secretary's Email is invalid.";
      isValid = false;
    }

    // Secretary's Phone validation
    if (!districtForm.secretaryPhone.trim()) {
      newErrors.secretaryPhone = "Secretary's Phone is required.";
      isValid = false;
    } else if (!phoneRegex.test(districtForm.secretaryPhone)) {
      newErrors.secretaryPhone = "Secretary's Phone must be 10 digits.";
      isValid = false;
    }

    // Treasurer's Name validation
    if (!districtForm.treasurerName.trim()) {
      newErrors.treasurerName = "Treasurer's Name is required.";
      isValid = false;
    } else if (districtForm.treasurerName.trim().length < 3) {
      newErrors.treasurerName =
        "Treasurer's Name must be at least 3 characters long.";
      isValid = false;
    }

    // Treasurer's Email validation
    if (!districtForm.treasurerEmail.trim()) {
      newErrors.treasurerEmail = "Treasurer's Email is required.";
      isValid = false;
    } else if (!emailRegex.test(districtForm.treasurerEmail)) {
      newErrors.treasurerEmail = "Treasurer's Email is invalid.";
      isValid = false;
    }

    // Treasurer's Phone validation
    if (!districtForm.treasurerPhone.trim()) {
      newErrors.treasurerPhone = "Treasurer's Phone is required.";
      isValid = false;
    } else if (!phoneRegex.test(districtForm.treasurerPhone)) {
      newErrors.treasurerPhone = "Treasurer's Phone must be 10 digits.";
      isValid = false;
    }

    // General Contact Email validation
    if (!districtForm.generalContactEmail.trim()) {
      newErrors.generalContactEmail = "General Contact Email is required.";
      isValid = false;
    } else if (!emailRegex.test(districtForm.generalContactEmail)) {
      newErrors.generalContactEmail = "General Contact Email is invalid.";
      isValid = false;
    }

    // General Contact Phone validation
    if (!districtForm.generalContactPhone.trim()) {
      newErrors.generalContactPhone = "General Contact Phone is required.";
      isValid = false;
    } else if (!phoneRegex.test(districtForm.generalContactPhone)) {
      newErrors.generalContactPhone =
        "General Contact Phone must be 10 digits.";
      isValid = false;
    }

    // Password validation (min 8 chars, at least one digit, one special char, one letter)
    if (!districtForm.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (districtForm.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
      isValid = false;
    } else if (
      !/(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}/.test(districtForm.password)
    ) {
      newErrors.password =
        "Password must contain at least one number, one special character, and one letter.";
      isValid = false;
    }

    // Confirm Password validation
    if (!districtForm.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
      isValid = false;
    } else if (districtForm.password !== districtForm.confirmPassword) {
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
      districtForm, // Send all form data
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    // Use toast.promise for integrated loading, success, and error messages
    toast.promise(submitPromise, {
      loading: "Registering district...",
      success: (res) => {
        // Reset form on success
        setDistrictForm({
          type: "District",
          districtName: "",
          presidentName: "",
          presidentEmail: "",
          presidentPhone: "",
          secretaryName: "",
          secretaryEmail: "",
          secretaryPhone: "",
          treasurerName: "",
          treasurerEmail: "",
          treasurerPhone: "",
          generalContactEmail: "",
          generalContactPhone: "",
          password: "",
          confirmPassword: "",
        });
        return res.data.message || "District registered successfully!";
      },
      error: (err) => {
        // Extract error message from response or provide a default
        return (
          err.response?.data?.message ||
          "Failed to register district. Try again."
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
      <h3 className={styles.formSectionTitle}>District Membership</h3>
      {/* noValidate attribute prevents default browser HTML5 validation */}
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Select District <span className={styles.required}>*</span>
            </p>
            <select
              name="districtName"
              value={districtForm.districtName}
              onChange={handleChange}
              className={`${styles.formSelect} ${
                errors.districtName ? styles.inputError : ""
              }`}
              required
              aria-invalid={errors.districtName ? "true" : "false"}
              aria-describedby="districtName-error"
            >
              <option value="">Select a district</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            {errors.districtName && (
              <p id="districtName-error" className={styles.errorMessage}>
                {errors.districtName}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              President's Name <span className={styles.required}>*</span>
            </p>
            <input
              name="presidentName"
              value={districtForm.presidentName}
              onChange={handleChange}
              placeholder="Enter President's full name"
              className={`${styles.formInput} ${
                errors.presidentName ? styles.inputError : ""
              }`}
              type="text"
              required
              aria-invalid={errors.presidentName ? "true" : "false"}
              aria-describedby="presidentName-error"
            />
            {errors.presidentName && (
              <p id="presidentName-error" className={styles.errorMessage}>
                {errors.presidentName}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              President's Email <span className={styles.required}>*</span>
            </p>
            <input
              name="presidentEmail"
              value={districtForm.presidentEmail}
              onChange={handleChange}
              placeholder="Enter President's email"
              className={`${styles.formInput} ${
                errors.presidentEmail ? styles.inputError : ""
              }`}
              type="email"
              required
              aria-invalid={errors.presidentEmail ? "true" : "false"}
              aria-describedby="presidentEmail-error"
            />
            {errors.presidentEmail && (
              <p id="presidentEmail-error" className={styles.errorMessage}>
                {errors.presidentEmail}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              President's Phone <span className={styles.required}>*</span>
            </p>
            <input
              name="presidentPhone"
              value={districtForm.presidentPhone}
              onChange={handleChange}
              placeholder="Enter President's phone number"
              className={`${styles.formInput} ${
                errors.presidentPhone ? styles.inputError : ""
              }`}
              type="tel"
              required
              aria-invalid={errors.presidentPhone ? "true" : "false"}
              aria-describedby="presidentPhone-error"
            />
            {errors.presidentPhone && (
              <p id="presidentPhone-error" className={styles.errorMessage}>
                {errors.presidentPhone}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Secretary's Name <span className={styles.required}>*</span>
            </p>
            <input
              name="secretaryName"
              value={districtForm.secretaryName}
              onChange={handleChange}
              placeholder="Enter Secretary's full name"
              className={`${styles.formInput} ${
                errors.secretaryName ? styles.inputError : ""
              }`}
              type="text"
              required
              aria-invalid={errors.secretaryName ? "true" : "false"}
              aria-describedby="secretaryName-error"
            />
            {errors.secretaryName && (
              <p id="secretaryName-error" className={styles.errorMessage}>
                {errors.secretaryName}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Secretary's Email <span className={styles.required}>*</span>
            </p>
            <input
              name="secretaryEmail"
              value={districtForm.secretaryEmail}
              onChange={handleChange}
              placeholder="Enter Secretary's email"
              className={`${styles.formInput} ${
                errors.secretaryEmail ? styles.inputError : ""
              }`}
              type="email"
              required
              aria-invalid={errors.secretaryEmail ? "true" : "false"}
              aria-describedby="secretaryEmail-error"
            />
            {errors.secretaryEmail && (
              <p id="secretaryEmail-error" className={styles.errorMessage}>
                {errors.secretaryEmail}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Secretary's Phone <span className={styles.required}>*</span>
            </p>
            <input
              name="secretaryPhone"
              value={districtForm.secretaryPhone}
              onChange={handleChange}
              placeholder="Enter Secretary's phone number"
              className={`${styles.formInput} ${
                errors.secretaryPhone ? styles.inputError : ""
              }`}
              type="tel"
              required
              aria-invalid={errors.secretaryPhone ? "true" : "false"}
              aria-describedby="secretaryPhone-error"
            />
            {errors.secretaryPhone && (
              <p id="secretaryPhone-error" className={styles.errorMessage}>
                {errors.secretaryPhone}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Treasurer's Name <span className={styles.required}>*</span>
            </p>
            <input
              name="treasurerName"
              value={districtForm.treasurerName}
              onChange={handleChange}
              placeholder="Enter Treasurer's full name"
              className={`${styles.formInput} ${
                errors.treasurerName ? styles.inputError : ""
              }`}
              type="text"
              required
              aria-invalid={errors.treasurerName ? "true" : "false"}
              aria-describedby="treasurerName-error"
            />
            {errors.treasurerName && (
              <p id="treasurerName-error" className={styles.errorMessage}>
                {errors.treasurerName}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Treasurer's Email <span className={styles.required}>*</span>
            </p>
            <input
              name="treasurerEmail"
              value={districtForm.treasurerEmail}
              onChange={handleChange}
              placeholder="Enter Treasurer's email"
              className={`${styles.formInput} ${
                errors.treasurerEmail ? styles.inputError : ""
              }`}
              type="email"
              required
              aria-invalid={errors.treasurerEmail ? "true" : "false"}
              aria-describedby="treasurerEmail-error"
            />
            {errors.treasurerEmail && (
              <p id="treasurerEmail-error" className={styles.errorMessage}>
                {errors.treasurerEmail}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Treasurer's Phone <span className={styles.required}>*</span>
            </p>
            <input
              name="treasurerPhone"
              value={districtForm.treasurerPhone}
              onChange={handleChange}
              placeholder="Enter Treasurer's phone number"
              className={`${styles.formInput} ${
                errors.treasurerPhone ? styles.inputError : ""
              }`}
              type="tel"
              required
              aria-invalid={errors.treasurerPhone ? "true" : "false"}
              aria-describedby="treasurerPhone-error"
            />
            {errors.treasurerPhone && (
              <p id="treasurerPhone-error" className={styles.errorMessage}>
                {errors.treasurerPhone}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              General Contact Email <span className={styles.required}>*</span>
            </p>
            <input
              name="generalContactEmail"
              value={districtForm.generalContactEmail}
              onChange={handleChange}
              placeholder="Enter general contact email"
              className={`${styles.formInput} ${
                errors.generalContactEmail ? styles.inputError : ""
              }`}
              type="email"
              required
              aria-invalid={errors.generalContactEmail ? "true" : "false"}
              aria-describedby="generalContactEmail-error"
            />
            {errors.generalContactEmail && (
              <p id="generalContactEmail-error" className={styles.errorMessage}>
                {errors.generalContactEmail}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              General Contact Phone <span className={styles.required}>*</span>
            </p>
            <input
              name="generalContactPhone"
              value={districtForm.generalContactPhone}
              onChange={handleChange}
              placeholder="Enter general contact phone number"
              className={`${styles.formInput} ${
                errors.generalContactPhone ? styles.inputError : ""
              }`}
              type="tel"
              required
              aria-invalid={errors.generalContactPhone ? "true" : "false"}
              aria-describedby="generalContactPhone-error"
            />
            {errors.generalContactPhone && (
              <p id="generalContactPhone-error" className={styles.errorMessage}>
                {errors.generalContactPhone}
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
              value={districtForm.password}
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
              value={districtForm.confirmPassword}
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

export default DistrictForm;

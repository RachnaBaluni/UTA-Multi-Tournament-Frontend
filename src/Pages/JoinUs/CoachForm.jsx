import React, { useState } from "react";
import axios from "axios";
import styles from "./JoinUs.module.css";
import { toast } from "sonner"; // Assuming 'sonner' is installed and configured

const CoachForm = () => {
  // State to hold all form data for the coach
  const [coachData, setCoachData] = useState({
    type: "Coach", // Fixed type for Coach form
    name: "",
    dob: "",
    gender: "",
    number: "",
    email: "",
    address: "",
    experience: "", // Years of Experience
    academyName: "", // Academy Affiliation Name
    academyContactPhone: "", // Academy Contact (Phone)
    academyContactEmail: "", // Academy Contact (Email)
    password: "",
    confirmPassword: "",
  });

  // State to manage validation errors for each field
  const [errors, setErrors] = useState({});

  // State to manage loading status of the form submission
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles changes to form input fields.
   * Updates the coachData state and clears any existing error for that field.
   * @param {Object} e - The event object from the input change.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoachData((prev) => ({ ...prev, [name]: value }));
    // Clear the error message for the specific field as the user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /**
   * Performs client-side validation of all form fields for the coach.
   * Updates the 'errors' state with validation messages.
   * @returns {boolean} True if all fields are valid, false otherwise.
   */
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Name validation
    if (!coachData.name.trim()) {
      newErrors.name = "Full Name is required.";
      isValid = false;
    } else if (coachData.name.trim().length < 3) {
      newErrors.name = "Full Name must be at least 3 characters long.";
      isValid = false;
    }

    // Date of Birth validation (basic DD/MM/YYYY format)
    if (!coachData.dob.trim()) {
      newErrors.dob = "Date of Birth is required.";
      isValid = false;
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(coachData.dob)) {
      newErrors.dob = "Date of Birth must be in DD/MM/YYYY format.";
      isValid = false;
    }

    // Gender validation
    if (!coachData.gender) {
      newErrors.gender = "Gender is required.";
      isValid = false;
    }

    // Contact Number validation (basic 10-digit number)
    if (!coachData.number.trim()) {
      newErrors.number = "Contact Number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(coachData.number)) {
      newErrors.number = "Contact Number must be 10 digits.";
      isValid = false;
    }

    // Email Address validation
    if (!coachData.email.trim()) {
      newErrors.email = "Email Address is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(coachData.email)) {
      newErrors.email = "Email Address is invalid.";
      isValid = false;
    }

    // Address validation
    if (!coachData.address.trim()) {
      newErrors.address = "Address is required.";
      isValid = false;
    } else if (coachData.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters long.";
      isValid = false;
    }

    // Years of Experience validation
    if (coachData.experience === "" || isNaN(coachData.experience)) {
      newErrors.experience =
        "Years of Experience is required and must be a number.";
      isValid = false;
    } else if (parseInt(coachData.experience, 10) < 0) {
      newErrors.experience = "Years of Experience cannot be negative.";
      isValid = false;
    }

    // Academy Affiliation Name (optional, but if provided, validate min length)
    if (
      coachData.academyName.trim() &&
      coachData.academyName.trim().length < 3
    ) {
      newErrors.academyName = "Academy Name must be at least 3 characters.";
      isValid = false;
    }

    // Academy Contact (Phone) (optional, but if provided, validate 10-digit number)
    if (
      coachData.academyContactPhone.trim() &&
      !/^\d{10}$/.test(coachData.academyContactPhone)
    ) {
      newErrors.academyContactPhone =
        "Academy Contact Phone must be 10 digits.";
      isValid = false;
    }

    // Academy Contact (Email) (optional, but if provided, validate email format)
    if (
      coachData.academyContactEmail.trim() &&
      !/\S+@\S+\.\S+/.test(coachData.academyContactEmail)
    ) {
      newErrors.academyContactEmail = "Academy Contact Email is invalid.";
      isValid = false;
    }

    // Password validation (min 8 chars, at least one digit, one special char, one letter)
    if (!coachData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (coachData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
      isValid = false;
    } else if (
      !/(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}/.test(coachData.password)
    ) {
      newErrors.password =
        "Password must contain at least one number, one special character, and one letter.";
      isValid = false;
    }

    // Confirm Password validation
    if (!coachData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
      isValid = false;
    } else if (coachData.password !== coachData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors); // Update the errors state with all found errors
    return isValid;
  };

  /**
   * Handles the form submission event for the coach form.
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
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/member/register`,
        coachData, // Send only validated data without confirmPassword
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("Coach Registered Successfully");
        setCoachData({
          type: "Coach", // Fixed type for Coach form
          name: "",
          dob: "",
          gender: "",
          number: "",
          email: "",
          address: "",
          experience: "", // Years of Experience
          academyName: "", // Academy Affiliation Name
          academyContactPhone: "", // Academy Contact (Phone)
          academyContactEmail: "", // Academy Contact (Email)
          password: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      // This catch block handles network errors or errors thrown by toast.promise's error callback
      toast.error(err.response?.data?.message);
    } finally {
      setIsLoading(false); // Always stop loading, regardless of success or failure
    }
  };

  return (
    <>
      <h3 className={styles.formSectionTitle}>Coach Membership</h3>
      {/* noValidate attribute prevents default browser HTML5 validation */}
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>
              Full Name <span className={styles.required}>*</span>
            </p>
            <input
              name="name"
              value={coachData.name}
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
              value={coachData.dob}
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
              value={coachData.gender}
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
              value={coachData.number}
              onChange={handleChange}
              placeholder="Enter your 10-digit contact number"
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
              value={coachData.email}
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
              value={coachData.address}
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
              Years of Experience <span className={styles.required}>*</span>
            </p>
            <input
              name="experience"
              value={coachData.experience}
              onChange={handleChange}
              placeholder="Enter years of coaching experience"
              className={`${styles.formInput} ${
                errors.experience ? styles.inputError : ""
              }`}
              type="number"
              min="0" // Coaches usually have non-negative experience
              required
              aria-invalid={errors.experience ? "true" : "false"}
              aria-describedby="experience-error"
            />
            {errors.experience && (
              <p id="experience-error" className={styles.errorMessage}>
                {errors.experience}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>Academy Affiliation Name</p>
            <input
              name="academyName"
              value={coachData.academyName}
              onChange={handleChange}
              placeholder="Enter affiliated academy name"
              className={`${styles.formInput} ${
                errors.academyName ? styles.inputError : ""
              }`}
              type="text"
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
            <p className={styles.fieldLabel}>Academy Contact (Phone)</p>
            <input
              name="academyContactPhone"
              value={coachData.academyContactPhone}
              onChange={handleChange}
              placeholder="Enter academy 10-digit contact number"
              className={`${styles.formInput} ${
                errors.academyContactPhone ? styles.inputError : ""
              }`}
              type="tel"
              aria-invalid={errors.academyContactPhone ? "true" : "false"}
              aria-describedby="academyContactPhone-error"
            />
            {errors.academyContactPhone && (
              <p id="academyContactPhone-error" className={styles.errorMessage}>
                {errors.academyContactPhone}
              </p>
            )}
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formField}>
            <p className={styles.fieldLabel}>Academy Contact (Email)</p>
            <input
              name="academyContactEmail"
              value={coachData.academyContactEmail}
              onChange={handleChange}
              placeholder="Enter academy email address"
              className={`${styles.formInput} ${
                errors.academyContactEmail ? styles.inputError : ""
              }`}
              type="email"
              aria-invalid={errors.academyContactEmail ? "true" : "false"}
              aria-describedby="academyContactEmail-error"
            />
            {errors.academyContactEmail && (
              <p id="academyContactEmail-error" className={styles.errorMessage}>
                {errors.academyContactEmail}
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
              value={coachData.password}
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
              value={coachData.confirmPassword}
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

export default CoachForm;

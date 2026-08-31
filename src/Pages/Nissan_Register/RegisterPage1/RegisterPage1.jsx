import React, { useState } from "react";
import styles from "./RegisterPage1.module.css";

const RegisterPage1 = ({ formData, setFormData, handleNext }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    // Full Name
    if (!formData.name?.trim()) {
      newErrors.name = "Full Name is required.";
    }

    // Email
    if (!formData.email?.trim()) {
      newErrors.email = "Email Address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Create Password
    if (!formData.password) {
      newErrors.password = "Please create a password.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[@$!%*?&]/.test(formData.password)
    ) {
      newErrors.password =
        "Password must include uppercase, lowercase, number and special character.";
    }
    // WhatsApp Number
    if (!String(formData.whatsappNumber || "").trim()) {
      newErrors.whatsappNumber = "WhatsApp Number is required.";
    } else if (!/^\d{10}$/.test(String(formData.whatsappNumber || ""))) {
      newErrors.whatsappNumber = "WhatsApp Number must be 10 digits.";
    }

    // DOB
    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required.";
    }

    // City
    if (!formData.city?.trim()) {
      newErrors.city = "City is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleNext();
    }
  };

  return (
    <div className={styles.registerPage1Container}>
      {/* Full Name */}
      <section className={styles.formSection}>
        <label htmlFor="fullName" className={styles.label}>
          Full Name
        </label>

        <input
          type="text"
          name="fullName"
          id="fullName"
          placeholder="Full Name..."
          value={formData.name || ""}
          onChange={(e) => {
            setFormData({
              ...formData,
              name: e.target.value,
            });

            setErrors({
              ...errors,
              name: "",
            });
          }}
          className={styles.input}
        />

        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
      </section>

      {/* Email Address */}
      <section className={styles.formSection}>
        <label htmlFor="email" className={styles.label}>
          Email Address
        </label>

        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email..."
          value={formData.email || ""}
          onChange={(e) => {
            setFormData({
              ...formData,
              email: e.target.value,
            });

            setErrors({
              ...errors,
              email: "",
            });
          }}
          className={styles.input}
        />

        {errors.email && (
          <span className={styles.errorText}>{errors.email}</span>
        )}
      </section>

      {/* Create Password */}
      <section className={styles.formSection}>
        <label htmlFor="password" className={styles.label}>
          Create Password
        </label>

        <input
          type="password"
          name="password"
          id="password"
          placeholder="Create your password..."
          value={formData.password || ""}
          onChange={(e) => {
            setFormData({
              ...formData,
              password: e.target.value,
            });

            setErrors({
              ...errors,
              password: "",
            });
          }}
          className={styles.input}
        />

        {errors.password && (
          <span className={styles.errorText}>{errors.password}</span>
        )}
      </section>

      {/* WhatsApp Number */}
      <section className={styles.formSection}>
        <label htmlFor="whatsappNumber" className={styles.label}>
          WhatsApp Number
        </label>

        <input
          type="tel"
          name="whatsappNumber"
          id="whatsappNumber"
          placeholder="e.g., 9876543210"
          value={formData.whatsappNumber || ""}
          onChange={(e) => {
            setFormData({
              ...formData,
              whatsappNumber: e.target.value,
            });

            setErrors({
              ...errors,
              whatsappNumber: "",
            });
          }}
          className={styles.input}
        />

        {errors.whatsappNumber && (
          <span className={styles.errorText}>{errors.whatsappNumber}</span>
        )}
      </section>

      {/* Date of Birth */}
      <section className={styles.formSection}>
        <label htmlFor="dob" className={styles.label}>
          Date of Birth
        </label>

        <input
          type="date"
          name="dob"
          id="dob"
          value={formData.dob || ""}
          onChange={(e) => {
            setFormData({
              ...formData,
              dob: e.target.value,
            });

            setErrors({
              ...errors,
              dob: "",
            });
          }}
          className={styles.input}
        />

        {errors.dob && <span className={styles.errorText}>{errors.dob}</span>}
      </section>

      {/* City */}
      <section className={styles.formSection}>
        <label htmlFor="city" className={styles.label}>
          City
        </label>

        <input
          type="text"
          name="city"
          id="city"
          placeholder="Your City..."
          value={formData.city || ""}
          onChange={(e) => {
            setFormData({
              ...formData,
              city: e.target.value,
            });

            setErrors({
              ...errors,
              city: "",
            });
          }}
          className={styles.input}
        />

        {errors.city && <span className={styles.errorText}>{errors.city}</span>}
      </section>

      {/* Next Button */}
      <button
        type="button"
        onClick={handleSubmit}
        className={styles.nextButton}
      >
        Next
      </button>
    </div>
  );
};

export default RegisterPage1;

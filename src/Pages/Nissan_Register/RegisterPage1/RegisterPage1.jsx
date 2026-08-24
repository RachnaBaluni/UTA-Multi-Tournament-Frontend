import React, { useState } from "react";
import styles from "./RegisterPage1.module.css"; // Import the CSS module

const RegisterPage1 = ({ formData, setFormData, handleNext }) => {
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const foodOptions = ["Veg", "Non-Veg", "I Won't Be There"];

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required.";
    }
    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = "WhatsApp Number is required.";
    } else if (!/^\d{10}$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = "WhatsApp Number must be 10 digits.";
    }
    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required.";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    // console.log(formData)
    if (validateForm()) {
      handleNext();
    }
  };

  return (
    <div className={styles.registerPage1Container}>
      {" "}
      {/* Applied container class */}
      <section className={styles.formSection}>
        {" "}
        {/* Applied section class */}
        <label htmlFor="fullName" className={styles.label}>
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          id="fullName"
          placeholder="Full Name..."
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={styles.input} // Applied input class
        />
        {errors.name && <span className={styles.errorText}>{errors.name}</span>}{" "}
        {/* Applied error text class */}
      </section>
      <section className={styles.formSection}>
        <label htmlFor="whatsappNumber" className={styles.label}>
          WhatsApp Number
        </label>
        <input
          type="tel"
          name="whatsappNumber"
          id="whatsappNumber"
          placeholder="e.g., 9876543210"
          value={formData.whatsappNumber}
          onChange={(e) =>
            setFormData({ ...formData, whatsappNumber: e.target.value })
          }
          className={styles.input}
        />
        {errors.whatsappNumber && (
          <span className={styles.errorText}>{errors.whatsappNumber}</span>
        )}
      </section>
      <section className={styles.formSection}>
        <label htmlFor="dob" className={styles.label}>
          Date of Birth
        </label>
        <input
          type="date"
          name="dob"
          id="dob"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          className={styles.input}
        />
        {errors.dob && <span className={styles.errorText}>{errors.dob}</span>}
      </section>
      <section className={styles.formSection}>
        <label htmlFor="city" className={styles.label}>
          City
        </label>
        <input
          type="text"
          name="city"
          id="city"
          placeholder="Your City..."
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className={styles.input}
        />
      </section>
      <section className={styles.formSection}>
        <label htmlFor="email" className={styles.label}>
          Email Address
        </label>

        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email..."
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={styles.input}
        />

        {errors.email && (
          <span className={styles.errorText}>{errors.email}</span>
        )}
      </section>
      {errors.city && <span className={styles.errorText}>{errors.city}</span>}
      <button onClick={handleSubmit} className={styles.nextButton}>
        Next
      </button>{" "}
      {/* Applied button class */}
    </div>
  );
};

export default RegisterPage1;

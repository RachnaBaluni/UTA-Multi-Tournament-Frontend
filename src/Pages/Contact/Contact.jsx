import React from "react";
import styles from "./contact.module.css"; // Using contact.module.css for specific styles

const Contact = () => {
  return (
    <div className={styles.rootContainer}>
      <div className={styles.mainContentWrapper}>
        <div className={styles.contentContainer}>
          {/* Contact Us Introduction Section */}
          <div className={styles.introSection}>
            <div className={styles.introTextGroup}>
              <p className={styles.introHeading}>Contact Us</p>
              <p className={styles.introDescription}>
                We're here to help! Reach out to us with any questions or
                inquiries.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className={styles.formGroup}>
            <label className={styles.formField}>
              <p className={styles.fieldLabel}>Name</p>
              <input
                placeholder="Your Name"
                className={styles.formInput}
                type="text"
                value=""
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formField}>
              <p className={styles.fieldLabel}>Email</p>
              <input
                placeholder="Your Email"
                className={styles.formInput}
                type="email"
                value=""
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formField}>
              <p className={styles.fieldLabel}>Subject</p>
              <input
                placeholder="Subject"
                className={styles.formInput}
                type="text"
                value=""
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formField}>
              <p className={styles.fieldLabel}>Message</p>
              <textarea
                placeholder="Your Message"
                className={`${styles.formInput} ${styles.textareaInput}`} // Apply specific textarea styles
              ></textarea>
            </label>
          </div>
          <div className={styles.submitButtonContainer}>
            <button className={styles.submitButton}>
              <span className={styles.submitButtonText}>Submit</span>
            </button>
          </div>

          {/* Contact Information */}
          <h2 className={styles.contactInfoTitle}>Contact Information</h2>
          <p className={styles.contactInfoText}>
            Address: 32 E. C. Road, Dehradun, Uttarakhand, India
          </p>
          <p className={styles.contactInfoText}>Phone: +91-9412977857</p>
          <p className={styles.contactInfoText}>Email: utennisa@gmail.com</p>

          {/* Map Image */}
          <div className={styles.mapContainer}>
            <div className={styles.mapImage}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4144.13129430105!2d78.0512385762313!3d30.309067774791345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929af78d571c3%3A0xce2d2329a1ca3d38!2sShanti%20Tennis%20Academy!5e1!3m2!1sen!2sin!4v1750927295337!5m2!1sen!2sin"
                width="600"
                height="450"
                style={{ border: 0, maxWidth: "100%" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className={styles.mapFrame}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

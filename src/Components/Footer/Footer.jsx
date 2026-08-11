// src/Components/Footer/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

// Import icons for social media
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Top Section: Logo and Description */}
        <div className={styles.footerBrand}>
          <div className={styles.footerLogoGroup}>
            <img src="/logo.png" alt="UTA Logo" className={styles.footerLogo} />
            <h3 className={styles.footerTitle}>
              Uttaranchal Tennis Association
            </h3>
          </div>
          <p className={styles.footerDescription}>
            Promoting tennis excellence and nurturing talent in the picturesque
            state of Uttarakhand.
          </p>
        </div>

        {/* Navigation Links */}
        <div className={styles.footerNav}>
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/tournaments">Tournaments</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/join-us">Join Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className={styles.footerContact}>
          <h4>Contact Us</h4>
          {/* REMOVED the <p> tag here */} {" "}
          <address>
            32, E. C. Road, <br />
            Dehradun, Uttarakhand, <br />  India - 248001{" "}
          </address>{" "}
          <p>
            Email:{" "}
            <a href="mailto:utennisa@gmail.com">utennisa@gmail.com </a>{" "}
          </p>{" "}
          <p>
            Phone: <a href="tel:+919412977857">+91 9412977857</a>
          </p>{" "}
        </div>

        {/* Social Media Links */}
        <div className={styles.footerSocial}>
          <h4>Follow Us</h4>
          <div className={styles.socialIcons}>
            <a
              href="https://facebook.com/utranchaltennis"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className={styles.icon} />
            </a>
            <a
              href="https://twitter.com/utranchaltennis"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className={styles.icon} />
            </a>
            <a
              href="https://instagram.com/utranchaltennis"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className={styles.icon} />
            </a>
            <a
              href="https://linkedin.com/company/utranchaltennis"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className={styles.icon} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright and Policy Links */}
      <div className={styles.footerBottomBar}>
        <p>
          &copy; {new Date().getFullYear()} Uttaranchal Tennis Association. All
          rights reserved.
        </p>
        <div className={styles.policyLinks}>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

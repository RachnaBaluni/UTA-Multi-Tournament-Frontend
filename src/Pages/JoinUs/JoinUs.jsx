import React, { useState } from "react";
import styles from "./JoinUs.module.css";

// Import the new form components
import PlayerForm from "./PlayerForm";
import CoachForm from "./CoachForm";
import AcademyForm from "./AcademyForm";
import DistrictForm from "./DistrictForm";

const JoinUs = () => {
  const [activeTab, setActiveTab] = useState("Player"); // State to manage active tab

  return (
    <div className={styles.rootContainer}>
      <div className={styles.mainContentWrapper}>
        <div className={styles.contentContainer}>
          {/* Join Us Introduction Section */}
          <div className={styles.introSection}>
            <p className={styles.introHeading}>Join Us</p>
            <p className={styles.introDescription}>
              Become a part of the Uttaranchal Tennis Association and contribute
              to the growth of tennis in the region. Choose your membership
              category below.
            </p>
          </div>

          {/* Membership Category Tabs */}
          <div className={styles.tabsContainer}>
            <a
              href="#"
              className={`${styles.tabLink} ${
                activeTab === "Player" ? styles.activeTab : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("Player");
              }}
            >
              <p className={styles.tabText}>Player</p>
            </a>
            <a
              href="#"
              className={`${styles.tabLink} ${
                activeTab === "Coach" ? styles.activeTab : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("Coach");
              }}
            >
              <p className={styles.tabText}>Coach</p>
            </a>
            <a
              href="#"
              className={`${styles.tabLink} ${
                activeTab === "Academy" ? styles.activeTab : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("Academy");
              }}
            >
              <p className={styles.tabText}>Academy</p>
            </a>
            <a
              href="#"
              className={`${styles.tabLink} ${
                activeTab === "District" ? styles.activeTab : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("District");
              }}
            >
              <p className={styles.tabText}>District</p>
            </a>
          </div>

          {/* Conditionally render forms based on activeTab */}
          {activeTab === "Player" && <PlayerForm />}
          {activeTab === "Coach" && <CoachForm />}
          {activeTab === "Academy" && <AcademyForm />}
          {activeTab === "District" && <DistrictForm />}
        </div>
      </div>
    </div>
  );
};

export default JoinUs;

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Academies.module.css";

export default function Academies() {
  const [academies, setAcademies] = useState([]);

  useEffect(() => {
    fetchAcademies();
  }, []);

  const fetchAcademies = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/academies`,
      );
      console.log("Full Response:", res.data);
      console.log("Academies:", res.data.academies);
      console.log("Count:", res.data.academies?.length);
      setAcademies(res.data.academies);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Registered Academies</h1>

      <div className={styles.cardContainer}>
        {academies.map((academy) => (
          <div key={academy._id} className={styles.card}>
            <h2>{academy.academyName}</h2>

            <p>
              <strong>Address:</strong> {academy.academyAddress}
            </p>

            <p>
              <strong>Contact:</strong> {academy.contactNumber}
            </p>

            <p>
              <strong>Email:</strong> {academy.emailAddress}
            </p>

            <p>
              <strong>Website:</strong> {academy.website || "Not Available"}
            </p>

            <p>
              <strong>Coaches:</strong> {academy.numberOfCoaches}
            </p>

            <p>
              <strong>Players:</strong> {academy.numberOfPlayers}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

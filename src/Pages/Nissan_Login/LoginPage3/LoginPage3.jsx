import React from 'react';
import styles from './LoginPage3.module.css';
import { Link } from 'react-router-dom';

const LoginPage3 = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Update Successful!</h2>
      <p className={styles.message}>Your details have been updated successfully.</p>
      <Link to="/tournaments" className={styles.homeButton}>
        Back to Home
      </Link>
    </div>
  );
};

export default LoginPage3;
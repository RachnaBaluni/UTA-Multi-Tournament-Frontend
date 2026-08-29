{
  /* =========================================================
    TOURNAMENT ACTIONS
========================================================= */
}

<section className={styles.actionSection}>
  <h2 className={styles.sectionTitle}>Tournament Information</h2>

  <div className={styles.actionButtons}>
    <Link to="/tournaments/registered-players" className={styles.actionButton}>
      View Registered Players
    </Link>

    <Link to="/tournaments/registered-teams" className={styles.actionButton}>
      View Registered Teams
    </Link>

    <Link to="/tournaments/draws" className={styles.actionButton}>
      View Draws
    </Link>

    <Link to="/tournaments/results" className={styles.actionButton}>
      View Results
    </Link>

    <Link to="/tournaments/viewresults" className={styles.actionButton}>
      View Results 2
    </Link>

    <Link to="/tournaments/view-order-play" className={styles.actionButton}>
      Order Of Play
    </Link>
  </div>
</section>;

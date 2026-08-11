import React from "react";
import styles from "./Tournaments.module.css";
import { Link } from "react-router-dom";
import TournamentListing from "../../Components/TournamentListing/TournamentListing";
import { FaSearch } from "react-icons/fa";
// import axios from "axios";

const Tournaments = () => {
  // const [tournaments, setTournaments] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");

  // useEffect(() => {
  //   const fetchTournaments = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${import.meta.env.VITE_APP_BACKEND_URL}/api/main-events`
  //       );
  //       setTournaments(response.data.data || []);
  //     } catch (error) {
  //       console.error("Error fetching tournaments:", error);
  //       setTournaments([]);
  //     }
  //   };

  //   fetchTournaments();
  // }, []);

  // const handleSearchChange = (event) => {
  //   setSearchTerm(event.target.value);
  // };

  // const filteredTournaments = tournaments.filter((tournament) =>
  //   tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className={styles.rootContainer}>
      <div className={styles.mainContentWrapper}>
        <div className={styles.contentContainer}>
          {/* Hero Section */}
          <section className={styles.tournamentsHeroSection}>
            <h2 className={styles.tournamentsHeroHeading}>
              All India Open Seniors Tennis Tournament 2025, Dehradun
            </h2>
            <p className={styles.tournamentsHeroParagraph}>
              Join us for an exciting tournament in the heart of Dehradun!
            </p>
            <Link to="/Nissan" className={styles.exploreButton}>
              Explore
            </Link>
          </section>

          {/* Upcoming Tournaments Section */}
          {/* <section className={styles.upcomingTournaments}>
            <h1 className={styles.sectionTitle}>Upcoming Tournaments</h1> */}

            {/* Search Bar with Icon */}
            {/* <label className={styles.searchLabel}>
              <div className={styles.searchInnerWrapper}>
                <div className={styles.searchIconWrapper}>
                  <FaSearch className={styles.searchIcon} aria-hidden="true" />
                </div>
                <input
                  placeholder="Search tournaments by name"
                  className={styles.searchInput}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  aria-label="Search tournaments"
                />
              </div>
            </label> */}

            {/* Render Tournament Listings */}
            {/* {filteredTournaments.length > 0 ? (
              filteredTournaments.map((tournament) => (
                <TournamentListing
                  key={tournament._id}
                  id={tournament._id}
                  name={tournament.name}
                  city={tournament.location}
                  date={new Date(tournament.date).toLocaleDateString()}
                />
              ))
            ) : (
              <p className={styles.noResults}>
                No tournaments found matching your criteria.
              </p>
            )}
          </section> */}
        </div>
      </div>
    </div>
  );
};

export default Tournaments;

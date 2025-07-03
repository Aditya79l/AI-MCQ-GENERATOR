import React from "react";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        {/* Optional icon placeholder or <img src="/logo.png" alt="Logo" className={styles.logo} /> */}
        <div className={styles.logo}></div>
        <span className={styles.title}>Quizify</span>
      </div>
      <nav className={styles.navLinks}>
        <a href="#" className={styles.link}>
          Home
        </a>
        <a href="#" className={styles.link}>
          About
        </a>
        <a href="#" className={styles.link}>
          Contact
        </a>
      </nav>
    </header>
  );
}

export default Navbar;

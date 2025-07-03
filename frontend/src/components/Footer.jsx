import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        <div className={styles.linkGroup}>
          <a href="#" className={styles.link}>
            Privacy Policy
          </a>
          <a href="#" className={styles.link}>
            Terms of Service
          </a>
        </div>
        <div className={styles.iconGroup}>
          <a href="#">
            <svg className={styles.icon} viewBox="0 0 256 256">
              <path d="M247.39...Z" />
            </svg>
          </a>
          <a href="#">
            <svg className={styles.icon} viewBox="0 0 256 256">
              <path d="M128...Z" />
            </svg>
          </a>
          <a href="#">
            <svg className={styles.icon} viewBox="0 0 256 256">
              <path d="M128,80...Z" />
            </svg>
          </a>
        </div>
        <p className={styles.copy}>&copy; 2024 Quizify. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

import { LoaderCircle } from "lucide-react";

import styles from "./PageLoader.module.css";

function PageLoader({ message = "Loading...", fullScreen = true }) {
  return (
    <div
      className={`${styles.container} ${fullScreen ? styles.fullScreen : ""}`}
    >
      <div className={styles.content}>
        <LoaderCircle
          size={22}
          strokeWidth={2}
          className={styles.spinner}
          aria-hidden="true"
        />

        {message && <span className={styles.message}>{message}</span>}
      </div>
    </div>
  );
}

export default PageLoader;

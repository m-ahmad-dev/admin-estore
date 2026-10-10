import styles from "./CouponStatusBadge.module.css";

const CouponStatusBadge = ({ isActive }) => {
  return (
    <span
      className={`${styles.badge} ${
        isActive ? styles.active : styles.inactive
      }`}
    >
      <span className={styles.dot} />

      {isActive ? "Active" : "Inactive"}
    </span>
  );
};

export default CouponStatusBadge;

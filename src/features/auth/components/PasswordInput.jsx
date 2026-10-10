import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import styles from "../styles/PasswordInput.module.css";

function PasswordInput({
  id,
  label,
  error,
  registration,
  autoComplete = "current-password",
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div
        className={`${styles.inputWrapper} ${error ? styles.inputError : ""}`}
      >
        <LockKeyhole
          size={18}
          strokeWidth={1.8}
          className={styles.leadingIcon}
          aria-hidden="true"
        />

        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          className={styles.input}
          {...registration}
        />

        <button
          type="button"
          className={styles.visibilityButton}
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          title={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff size={18} strokeWidth={1.8} />
          ) : (
            <Eye size={18} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}

export default PasswordInput;

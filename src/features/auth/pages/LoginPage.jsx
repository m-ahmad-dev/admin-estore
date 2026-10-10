import { ShieldCheck } from "lucide-react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import LoginForm from "../components/LoginForm";
import styles from "./LoginPage.module.css";

function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className={styles.page}>
      <section className={styles.visualPanel}>
        <div>
          <div className={styles.brandMark}>
            <ShieldCheck size={24} />
          </div>
          <span className={styles.eyebrow}>E-Store Administration</span>
          <h1 className={styles.visualTitle}>
            Manage your store with confidence.
          </h1>
          <p className={styles.visualDescription}>
            Streamlined management for products, orders, customers, and store
            analytics.
          </p>
        </div>

        <div className={styles.visualFooter}>
          <span>Secure Enterprise Access</span>
          <span>•</span>
          <span>v2.0 Architectural Build</span>
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h2 className={styles.title}>Welcome back</h2>
            <p className={styles.subtitle}>
              Sign in to access your administrative dashboard.
            </p>
          </div>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}

export default LoginPage;

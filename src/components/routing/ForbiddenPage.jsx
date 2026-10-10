import { Link } from "react-router-dom";

function ForbiddenPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div>
        <h1>403</h1>

        <h2>Access denied</h2>

        <p>You do not have permission to access this resource.</p>

        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    </main>
  );
}

export default ForbiddenPage;

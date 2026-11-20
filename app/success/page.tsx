
export default function SuccessPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#062b43",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "24px"
    }}>
      <div>
        <h1>Thank You for Signing Up!</h1>
        <h2>Pristine Pool Chemical Club</h2>
        <p>
          Your checkout has been completed.
          Your subscription is being confirmed.
        </p>
        <p>Welcome to the Club!</p>
        <a href="/" style={{ color: "#38bdf8" }}>
          Return to Homepage
        </a>
      </div>
    </main>
  );
}

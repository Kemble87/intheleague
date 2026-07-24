import { useState } from "react";

export default function SeasonPassButton({ user }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user?.uid, email: user?.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // off to Ziina checkout
      } else {
        alert("Couldn't start payment — try again in a minute.");
      }
    } catch {
      alert("Couldn't start payment — try again in a minute.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      style={{
        background: "#2CE86A",
        color: "#0B0F0C",
        border: "none",
        borderRadius: 12,
        padding: "14px 24px",
        fontFamily: "Poppins, sans-serif",
        fontWeight: 700,
        fontSize: 16,
        width: "100%",
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? "One sec..." : "Season Pass 26/27 — £14.99"}
    </button>
  );
}

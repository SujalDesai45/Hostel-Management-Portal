import React, { useState } from "react";
import api from "../api";

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/feedbacks", { rating, message });
      alert("Feedback submitted. Thank you!");
      setRating(0);
      setMessage("");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending feedback");
    }
  };

  return (
    <div className="card">
      <h2 className="page-title">Feedback</h2>
      <p>Rate your hostel experience and share your comments.</p>
      <form onSubmit={submit} style={{ marginTop: "0.75rem" }}>
        <label className="label">Rating</label>
        <div style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>
          {[1,2,3,4,5].map((star) => (
            <span
              key={star}
              style={{
                cursor: "pointer",
                color: rating >= star ? "#facc15" : "#4b5563",
                marginRight: "0.15rem"
              }}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <label className="label">Message</label>
        <textarea
          className="input"
          style={{ minHeight: "90px" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
          Submit Feedback
        </button>
      </form>
    </div>
  );
}

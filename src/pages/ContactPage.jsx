import React, { useState } from "react";
import api from "../api";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const send = async (e) => {
    e.preventDefault();
    try {
      await api.post("/contacts", { name, email, phone, message });
      alert("Message sent to admin.");
      setName(""); setEmail(""); setPhone(""); setMessage("");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending message");
    }
  };

  return (
    <div className="card">
      <h2 className="page-title">Contact Us</h2>
      <form onSubmit={send} style={{ maxWidth: "420px" }}>
        <label className="label">Your Name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        <label className="label">Email</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="label">Contact Number (Optional)</label>
        <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <label className="label">Message</label>
        <textarea className="input" style={{ minHeight: "90px" }} value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
          Send Message
        </button>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { fullName, email, password });
      alert("Registered successfully. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="flex flex-col" style={{ alignItems: "center", marginTop: "3rem" }}>
      <div className="card" style={{ width: "380px" }}>
        <h2 className="page-title">Student Registration</h2>
        <form onSubmit={register}>
          <label className="label">Full Name</label>
          <input
            className="input"
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-secondary" style={{ width: "100%", marginTop: "0.5rem" }}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

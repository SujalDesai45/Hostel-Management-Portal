import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function LoginPage() {
  const [role, setRole] = useState("student"); // "student" or "admin"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.fullName);
      localStorage.setItem("email", res.data.email);
      if (res.data.role === "admin") navigate("/admin");
      else navigate("/student");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
      {/* Role Selector */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
        <button
          onClick={() => {
            setRole("student");
            setEmail("");
            setPassword("");
          }}
          style={{
            padding: "1rem 2rem",
            fontSize: "1rem",
            fontWeight: "600",
            borderRadius: "0.6rem",
            border: "none",
            cursor: "pointer",
            background: role === "student" ? "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" : "#ecf0f1",
            color: role === "student" ? "white" : "#2c3e50",
            transition: "all 0.3s ease",
            boxShadow: role === "student" ? "0 4px 15px rgba(30, 60, 114, 0.4)" : "none"
          }}
        >
          👨‍🎓 Student Login
        </button>
        <button
          onClick={() => {
            setRole("admin");
            setEmail("");
            setPassword("");
          }}
          style={{
            padding: "1rem 2rem",
            fontSize: "1rem",
            fontWeight: "600",
            borderRadius: "0.6rem",
            border: "none",
            cursor: "pointer",
            background: role === "admin" ? "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" : "#ecf0f1",
            color: role === "admin" ? "white" : "#2c3e50",
            transition: "all 0.3s ease",
            boxShadow: role === "admin" ? "0 4px 15px rgba(30, 60, 114, 0.4)" : "none"
          }}
        >
          👨‍💼 Admin Login
        </button>
      </div>

      {/* Login Form Container */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
          {role === "student" ? (
            <>
              <h2 className="page-title" style={{ textAlign: "center" }}>
                Student Login
              </h2>
              <p style={{ textAlign: "center", color: "#666", marginBottom: "1.5rem" }}>
                Login with your registered email to access your dashboard
              </p>
            </>
          ) : (
            <>
              <h2 className="page-title" style={{ textAlign: "center" }}>
                Admin Login
              </h2>
              <p style={{ textAlign: "center", color: "#666", marginBottom: "1.5rem" }}>
                Admin access only. Enter your credentials to manage the system
              </p>
            </>
          )}

          <form onSubmit={login}>
            <label className="label">Email Address</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === "student" ? "your.email@example.com" : "admin@example.com"}
              required
            />

            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <button 
              className="btn btn-primary" 
              style={{ width: "100%", marginTop: "1rem", padding: "0.7rem 1.2rem" }}
            >
              {role === "student" ? "Login as Student" : "Login as Admin"}
            </button>
          </form>

          {role === "student" && (
            <div style={{ marginTop: "1.5rem", textAlign: "center", borderTop: "1px solid #ecf0f1", paddingTop: "1rem" }}>
              <p style={{ color: "#666", marginBottom: "0.5rem" }}>Don't have an account?</p>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <button className="btn btn-secondary" style={{ width: "100%" }}>
                  Create Student Account
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div style={{ textAlign: "center", marginTop: "2rem", color: "#fffbfbff" }}>
        <p>Need help? Contact us at support@hostel.com or call 24/7 support</p>
      </div>
    </div>
  );
}
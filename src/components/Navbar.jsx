import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div>
        <Link to="/" className="nav-link" style={{ fontWeight: 700, fontSize: "1.8rem" }}>
          🏨 Students Nest
        </Link>
      </div>
      <nav className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/rooms" className="nav-link">Rooms</Link>
        {role !== "admin" && (
          <>
            <Link to="/feedback" className="nav-link">Feedback</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </>
        )}
        {!name && (
          <>
            <Link to="/login" className="nav-link tag-pill">Login</Link>
            <Link to="/register" className="nav-link tag-pill">Register</Link>
          </>
        )}
        {name && (
          <>
            {role === "admin" && (
              <Link to="/admin" className="nav-link tag-pill">Admin Dashboard</Link>
            )}
            {role === "student" && (
              <Link to="/student" className="nav-link tag-pill">Student Dashboard</Link>
            )}
            <span className="badge">{name}</span>
            <button className="btn btn-outline" onClick={logout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}
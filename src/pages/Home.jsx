import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Home() {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const response = await api.get("/rooms");
      setBuildings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      setLoading(false);
    }
  };

  const services = [
    {
      id: 1,
      icon: "🛏️",
      title: "Room Booking",
      description: "Browse and apply for hostel rooms with detailed information and availability."
    },
    {
      id: 2,
      icon: "💳",
      title: "Online Payments",
      description: "Secure and convenient online payment system for hostel fees."
    },
    {
      id: 3,
      icon: "📝",
      title: "Feedback System",
      description: "Share your experience and help us improve our hostel services."
    },
    {
      id: 4,
      icon: "📞",
      title: "24/7 Support",
      description: "Contact us anytime for queries, complaints, or assistance."
    },
    {
      id: 5,
      icon: "👨‍💼",
      title: "Admin Management",
      description: "Efficient admin dashboard for managing rooms, bookings, and students."
    },
    {
      id: 7,
      icon: "📡",
      title: "High-Speed WiFi",
      description: "Fast and reliable WiFi connectivity available 24/7 in all rooms."
    },
    {
      id: 8,
      icon: "🧺",
      title: "Washing Machine",
      description: "Modern washing machines available for students' laundry needs."
    },
    {
      id: 9,
      icon: "💧",
      title: "Hot Water",
      description: "Hot water supply available round the clock for comfortable bathing."
    }
  ];

  return (
    <div>
      <div className="card">
        <h1 className="page-title" style={{ textAlign: "center" }}>Welcome to Students Nest</h1>
        {!name ? (
          <>
            <p style={{ fontSize: "1.05rem", lineHeight: "1.6", color: "#555", textAlign: "center" }}>
              This portal allows students to register, apply for hostel rooms, make payments,
              send feedback and contact the admin. Admin can manage rooms, approve bookings
              and track bed availability.
            </p>
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <Link to="/rooms">
                <button className="btn btn-primary">View Rooms</button>
              </Link>
              <Link to="/login">
                <button className="btn btn-secondary">Login</button>
              </Link>
              <Link to="/register">
                <button className="btn btn-outline">Register</button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: "1.05rem", lineHeight: "1.6", color: "#555", textAlign: "center" }}>
              {role === "admin" ? (
                <>Welcome back, Admin! You can manage rooms, approve bookings, view feedback and contact messages from the Admin Dashboard.</>
              ) : (
                <>Welcome back, {name}! Explore our hostel rooms, apply for booking, and share your feedback with us.</>
              )}
            </p>
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <Link to="/rooms">
                <button className="btn btn-primary">View Rooms</button>
              </Link>
              {role === "admin" && (
                <Link to="/admin">
                  <button className="btn btn-secondary">Go to Admin Dashboard</button>
                </Link>
              )}
              {role === "student" && (
                <Link to="/student">
                  <button className="btn btn-secondary">Go to Student Dashboard</button>
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      {/* Services Section */}
      <div style={{ marginTop: "2rem" }}>
        <h2 style={{
          fontSize: "2rem",
          color: "#f7f9fdff",
          fontWeight: "700",
          textAlign: "center",
          marginBottom: "2rem"
        }}>
          Our Services
        </h2>
        
        <div className="grid-3">
          {services.map((service) => (
            <div 
              key={service.id}
              className="card"
              style={{
                textAlign: "center",
                padding: "2rem",
                transition: "all 0.3s ease",
                minHeight: "250px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 20px 50px rgba(30, 60, 114, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 40px rgba(30, 60, 114, 0.15)";
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                {service.icon}
              </div>
              <h3 style={{
                fontSize: "1.3rem",
                color: "#1e3c72",
                fontWeight: "600",
                marginBottom: "0.75rem"
              }}>
                {service.title}
              </h3>
              <p style={{
                fontSize: "0.95rem",
                color: "#666",
                lineHeight: "1.5",
                margin: "0"
              }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
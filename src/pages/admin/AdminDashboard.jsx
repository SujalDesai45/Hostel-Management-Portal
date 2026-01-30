import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin") {
      navigate("/login");
      return;
    }
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [rRes, bRes, fRes, cRes] = await Promise.all([
        api.get("/rooms"),
        api.get("/bookings"),
        api.get("/feedbacks"),
        api.get("/contacts")
      ]);
      setRooms(rRes.data);
      setBookings(bRes.data);
      setFeedbacks(fRes.data);
      setContacts(cRes.data);
    } catch (err) {
      console.error("Error loading data:", err);
      alert("Error loading dashboard data");
    }
  };

  const addRoom = async () => {
    const name = prompt("Room name?");
    if (!name) return;
    const type = prompt('Type: "2-sharing" or "3-sharing"') || "2-sharing";
    const numRooms = Number(prompt("How many rooms? (e.g., 2)")) || 1;
    const cap = Number(prompt("Beds per room? (e.g., 2)")) || 2;
    const price = Number(prompt("Price per month?")) || 2000;
    const photoUrl = prompt("Photo URL (optional)") || "";
    try {
      await api.post("/rooms", {
        name,
        type,
        numRooms,
        capacityPerRoom: cap,
        pricePerMonth: price,
        photoUrl
      });
      alert("Room added successfully!");
      await loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding room");
    }
  };

  const approve = async (id) => {
    try {
      await api.patch(`/bookings/${id}/approve`);
      alert("Booking approved successfully!");
      await loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Error approving booking");
    }
  };

  const reject = async (id) => {
    try {
      await api.patch(`/bookings/${id}/reject`);
      alert("Booking rejected!");
      await loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Error rejecting booking");
    }
  };

  const endBooking = async (id) => {
    try {
      await api.patch(`/bookings/${id}/end`);
      alert("Booking ended successfully!");
      await loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Error ending booking");
    }
  };

  return (
    <div>
      <h2 className="page-title" style={{ textAlign: "center",color:"white" }}>Admin Dashboard</h2>
      
      <div className="card">
        <div className="flex flex-between">
          <h3>🛏️ Rooms</h3>
          <button className="btn btn-secondary" onClick={addRoom}>+ Add Room</button>
        </div>
        <ul>
          {rooms.length > 0 ? (
            rooms.map((r) => (
              <li key={r._id} style={{ marginBottom: "0.35rem" }}>
                <strong>{r.name}</strong> ({r.type}) - {r.availableBeds}/{r.totalBeds} beds | ₹{r.pricePerMonth}/month
              </li>
            ))
          ) : (
            <li>No rooms available</li>
          )}
        </ul>
      </div>

      <div className="card">
        <h3>📋 Bookings</h3>
        <ul>
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <li key={b._id} style={{ marginBottom: "0.6rem" }}>
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>{b.student?.fullName}</strong> → <strong>{b.room?.name}</strong> | beds: {b.bedCount} | status:{" "}
                  <span className="badge">{b.status}</span>
                </div>
                {b.status === "pending" && (
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => approve(b._id)}
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                    >
                      ✓ Approve
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => reject(b._id)}
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}
                {b.status === "approved" && (
                  <span style={{ color: "#27ae60", fontWeight: "600" }}>Waiting for student payment...</span>
                )}
                {b.status === "paid" && (
                  <button 
                    className="btn btn-outline" 
                    onClick={() => endBooking(b._id)}
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                  >
                    🛑 End Booking (Free Beds)
                  </button>
                )}
                {b.status === "rejected" && (
                  <span style={{ color: "#e74c3c", fontWeight: "600" }}>Booking Rejected</span>
                )}
              </li>
            ))
          ) : (
            <li>No bookings</li>
          )}
        </ul>
      </div>

      <div className="card">
        <h3>⭐ Feedback</h3>
        <ul>
          {feedbacks.length > 0 ? (
            feedbacks.map((f) => (
              <li key={f._id} style={{ marginBottom: "0.5rem" }}>
                <span className="badge">⭐ {f.rating}</span>{" "}
                <strong>{f.student?.fullName}</strong>: {f.message}
              </li>
            ))
          ) : (
            <li>No feedback yet</li>
          )}
        </ul>
      </div>

      <div className="card">
        <h3>📞 Contact Messages</h3>
        <ul>
          {contacts.length > 0 ? (
            contacts.map((c) => (
              <li key={c._id} style={{ marginBottom: "0.75rem" }}>
                <strong>{c.name}</strong> ({c.email}){c.phone && ` | ${c.phone}`}
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.9rem", color: "#666" }}>
                  {c.message}
                </p>
              </li>
            ))
          ) : (
            <li>No contact messages</li>
          )}
        </ul>
      </div>
    </div>
  );
}
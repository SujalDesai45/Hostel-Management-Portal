import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function StudentDashboard() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "student") {
      navigate("/login");
      return;
    }
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const res = await api.get("/bookings/my");
    setBookings(res.data);
  };

  const pay = async (id, durationType, method) => {
    await api.patch(`/bookings/${id}/pay`, { durationType, paymentMethod: method });
    await loadBookings();
  };

  return (
    <div>
      <h2 style={{color:"white"}}className="page-title">Student Dashboard</h2>
      <div className="card">
        <h3>My Bookings</h3>
        <ul>
          {bookings.map((b) => (
            <li key={b._id} style={{ marginBottom: "0.5rem" }}>
              Room: <strong>{b.room?.name}</strong> | beds: {b.bedCount} | status:{" "}
              <span className="badge">{b.status}</span>
              {b.status === "approved" && (
                <div style={{ marginTop: "0.25rem" }}>
                  <span style={{ fontSize: "0.85rem", marginRight: "0.35rem" }}>
                    Pay:
                  </span>
                  <button className="btn btn-primary" onClick={() => pay(b._id, "1month", "upi")}>
                    1M (UPI)
                  </button>{" "}
                  <button className="btn btn-primary" onClick={() => pay(b._id, "3month", "card")}>
                    3M (Card)
                  </button>{" "}
                  <button className="btn btn-primary" onClick={() => pay(b._id, "6month", "cash")}>
                    6M (Cash)
                  </button>{" "}
                  <button className="btn btn-primary" onClick={() => pay(b._id, "1year", "upi")}>
                    1Y (UPI)
                  </button>
                </div>
              )}
              {b.status === "paid" && (
                <div className="card" style={{ marginTop: "0.3rem", padding: "0.6rem 0.8rem" }}>
                  <strong>Receipt</strong>
                  <p>Duration: {b.durationMonths} months</p>
                  <p>Total: ₹{b.totalAmount}</p>
                  <p>Method: {b.paymentMethod}</p>
                  <p>
                    Ends on:{" "}
                    {b.endDate ? new Date(b.endDate).toLocaleDateString() : "-"}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

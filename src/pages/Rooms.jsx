import React, { useEffect, useState } from "react";
import api from "../api";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const role = localStorage.getItem("role");

  useEffect(() => {
    api.get("/rooms").then((res) => setRooms(res.data));
  }, []);

  const apply = async (roomId) => {
    try {
      await api.post("/bookings/apply", { roomId, bedCount: 1 });
      alert("Booking request submitted. Wait for admin approval.");
    } catch (err) {
      alert(err.response?.data?.message || "Error applying booking");
    }
  };

  const deleteRoom = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await api.delete(`/rooms/${roomId}`);
        setRooms(rooms.filter((room) => room._id !== roomId));
        alert("Room deleted successfully.");
      } catch (err) {
        alert(err.response?.data?.message || "Error deleting room");
      }
    }
  };

  return (
    <div>
      <h2 style={{color:"white"}}className="page-title">Rooms</h2>
      <div className="grid grid-3">
        {rooms.map((room) => (
          <div key={room._id} className="card">
            {room.photoUrl && (
              <img
                src={room.photoUrl}
                alt={room.name}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "0.75rem",
                  marginBottom: "0.5rem"
                }}
              />
            )}
            <h3>{room.name}</h3>
            <p className="badge">{room.type}</p>
            <p>Total beds: {room.totalBeds}</p>
            <p>Available beds: {room.availableBeds}</p>
            <p>Price per month: ₹{room.pricePerMonth}</p>
            {role === "student" && (
              <>
                {room.availableBeds > 0 ? (
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "0.5rem" }}
                    onClick={() => apply(room._id)}
                  >
                    Apply for 1 bed
                  </button>
                ) : (
                  <button className="btn btn-danger" disabled style={{ marginTop: "0.5rem" }}>
                    Fully Booked
                  </button>
                )}
              </>
            )}
            {role === "admin" && (
              <button
                className="btn btn-danger"
                style={{ marginTop: "0.5rem", width: "100%" }}
                onClick={() => deleteRoom(room._id)}
              >
                Delete Room
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
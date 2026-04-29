"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Header from "../../../../../components/Header";
import Footer from "../../../../../components/Footer";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
};

export default function AttendeesPage() {
  const params = useParams();
  const eventId = params.id;
  const router = useRouter();
  const [attendees, setAttendees] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkinLoading, setCheckinLoading] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch event
      const eventRes = await fetch(`/api/events/${eventId}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (eventRes.ok) {
        setEvent(await eventRes.json());
      }

      // Fetch attendees
      const attendeesRes = await fetch(`/api/host/events/${eventId}/attendees`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (attendeesRes.ok) {
        setAttendees(await attendeesRes.json());
      } else {
        setError("Failed to load attendees");
      }
    } catch (err) {
      setError("Network error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async (bookingId) => {
    setCheckinLoading((prev) => ({ ...prev, [bookingId]: true }));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/bookings/${bookingId}/checkin`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (response.ok) {
        setAttendees((prev) =>
          prev.map((a) =>
            a.id === bookingId ? { ...a, checked_in_at: new Date().toISOString() } : a
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckinLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleExportCSV = () => {
    const csv = [
      ["Name", "Email", "Quantity", "Checked In"],
      ...attendees.map((a) => [
        a.user.name,
        a.user.email,
        a.quantity,
        a.checked_in_at ? "Yes" : "No",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(csv)}`);
    element.setAttribute("download", `attendees-${eventId}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ minHeight: "100vh", background: tokens.cream, display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, padding: "40px max(16px, 3vw)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "40px" }}>
            <Link
              href="/host"
              style={{
                fontFamily: "sans-serif",
                fontSize: "14px",
                color: "#999",
                textDecoration: "none",
                marginBottom: "16px",
                display: "inline-block",
              }}
            >
              ← Back to dashboard
            </Link>
            <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "48px", fontWeight: 900, color: tokens.black, margin: "0 0 12px" }}>
              Attendees
            </h1>
            {event && (
              <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: "#666", margin: 0 }}>
                {event.title} • {attendees.length} confirmed
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "#fee",
              color: "#c0392b",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "24px",
            }}>
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
              Loading attendees...
            </div>
          )}

          {/* Empty State */}
          {!loading && attendees.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
              No attendees yet
            </div>
          )}

          {/* Attendees List */}
          {!loading && attendees.length > 0 && (
            <>
              <div style={{ marginBottom: "24px" }}>
                <button
                  onClick={handleExportCSV}
                  style={{
                    background: tokens.black,
                    color: tokens.white,
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    fontFamily: "sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Export as CSV
                </button>
              </div>

              <div style={{
                overflowX: "auto",
                border: "1px solid #e8e3db",
                borderRadius: "12px",
              }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: tokens.white,
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e8e3db" }}>
                      <th style={{ padding: "16px", textAlign: "left", fontFamily: "sans-serif", fontSize: "12px", fontWeight: 600, color: "#999" }}>
                        Name
                      </th>
                      <th style={{ padding: "16px", textAlign: "left", fontFamily: "sans-serif", fontSize: "12px", fontWeight: 600, color: "#999" }}>
                        Email
                      </th>
                      <th style={{ padding: "16px", textAlign: "left", fontFamily: "sans-serif", fontSize: "12px", fontWeight: 600, color: "#999" }}>
                        Tickets
                      </th>
                      <th style={{ padding: "16px", textAlign: "left", fontFamily: "sans-serif", fontSize: "12px", fontWeight: 600, color: "#999" }}>
                        Status
                      </th>
                      <th style={{ padding: "16px", textAlign: "right", fontFamily: "sans-serif", fontSize: "12px", fontWeight: 600, color: "#999" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map((attendee, idx) => (
                      <tr
                        key={attendee.id}
                        style={{
                          borderBottom: idx < attendees.length - 1 ? "1px solid #f0ebe3" : "none",
                        }}
                      >
                        <td style={{ padding: "16px", fontFamily: "sans-serif", fontSize: "14px", color: tokens.black }}>
                          {attendee.user.name}
                        </td>
                        <td style={{ padding: "16px", fontFamily: "sans-serif", fontSize: "14px", color: "#666" }}>
                          {attendee.user.email}
                        </td>
                        <td style={{ padding: "16px", fontFamily: "sans-serif", fontSize: "14px", color: tokens.black }}>
                          {attendee.quantity}
                        </td>
                        <td style={{ padding: "16px" }}>
                          {attendee.checked_in_at ? (
                            <span style={{
                              background: "#e8f5e9",
                              color: "#2e7d32",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              fontFamily: "sans-serif",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}>
                              ✓ Checked in
                            </span>
                          ) : (
                            <span style={{
                              background: "#f5f5f5",
                              color: "#999",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              fontFamily: "sans-serif",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}>
                              Pending
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "16px", textAlign: "right" }}>
                          {!attendee.checked_in_at && (
                            <button
                              onClick={() => handleCheckin(attendee.id)}
                              disabled={checkinLoading[attendee.id]}
                              style={{
                                background: tokens.orange,
                                color: tokens.white,
                                border: "none",
                                padding: "8px 12px",
                                borderRadius: "6px",
                                fontFamily: "sans-serif",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: checkinLoading[attendee.id] ? "not-allowed" : "pointer",
                                opacity: checkinLoading[attendee.id] ? 0.6 : 1,
                              }}
                            >
                              {checkinLoading[attendee.id] ? "..." : "Check in"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
};

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login?redirect=/tickets");
      return;
    }
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/bookings", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      } else {
        setError("Failed to load tickets");
      }
    } catch (err) {
      setError("Network error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTickets((prev) =>
          prev.map((t) => (t.id === bookingId ? { ...t, status: "cancelled" } : t))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadQR = (booking) => {
    // Generate QR code and download
    const qrText = booking.qr_code;
    const element = document.createElement("a");
    element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(qrText)}`);
    element.setAttribute("download", `ticket-${booking.id}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const upcomingTickets = tickets.filter(
    (t) => t.status !== "cancelled" && new Date(t.event?.starts_at) > new Date()
  );
  const pastTickets = tickets.filter(
    (t) => new Date(t.event?.starts_at) <= new Date() || t.status === "cancelled"
  );

  const displayTickets = activeTab === "upcoming" ? upcomingTickets : pastTickets;

  return (
    <div style={{ minHeight: "100vh", background: tokens.cream, display: "flex", flexDirection: "column" }}>
      <Header />
      
      <main style={{ flex: 1, padding: "40px max(16px, 3vw)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "40px" }}>
            <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "48px", fontWeight: 900, color: tokens.black, margin: "0 0 12px" }}>
              My tickets
            </h1>
            <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: "#666", margin: 0 }}>
              All your event bookings and confirmations
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid #e0dbd0", marginBottom: "32px" }}>
            <button
              onClick={() => setActiveTab("upcoming")}
              style={{
                background: "none",
                border: "none",
                fontFamily: "sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                padding: "16px 0",
                cursor: "pointer",
                color: activeTab === "upcoming" ? tokens.black : "#999",
                borderBottom: activeTab === "upcoming" ? `2px solid ${tokens.black}` : "2px solid transparent",
              }}
            >
              Upcoming ({upcomingTickets.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              style={{
                background: "none",
                border: "none",
                fontFamily: "sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                padding: "16px 0",
                cursor: "pointer",
                color: activeTab === "past" ? tokens.black : "#999",
                borderBottom: activeTab === "past" ? `2px solid ${tokens.black}` : "2px solid transparent",
              }}
            >
              Past ({pastTickets.length})
            </button>
          </div>

          {/* Error Message */}
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
              Loading tickets...
            </div>
          )}

          {/* Empty State */}
          {!loading && displayTickets.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: "60px 0",
            }}>
              <p style={{ fontFamily: "sans-serif", fontSize: "18px", color: "#999", marginBottom: "20px" }}>
                {activeTab === "upcoming" ? "No upcoming events" : "No past events"}
              </p>
              <Link
                href="/browse"
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "14px",
                  color: tokens.orange,
                  textDecoration: "none",
                }}
              >
                Browse events →
              </Link>
            </div>
          )}

          {/* Tickets List */}
          {!loading && displayTickets.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {displayTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  style={{
                    background: tokens.white,
                    border: "1px solid #e8e3db",
                    borderRadius: "16px",
                    padding: "24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Left: Event Details */}
                  <div>
                    <h3 style={{ fontFamily: "'Georgia', serif", fontSize: "18px", fontWeight: 700, color: tokens.black, margin: "0 0 8px" }}>
                      {ticket.event?.title}
                    </h3>
                    <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "#666", margin: "0 0 4px" }}>
                      📅 {new Date(ticket.event?.starts_at).toLocaleDateString()} at {new Date(ticket.event?.starts_at).toLocaleTimeString()}
                    </p>
                    <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "#666", margin: "0 0 12px" }}>
                      📍 {ticket.event?.location_name}
                    </p>
                    
                    {/* Status Badge */}
                    <div style={{
                      display: "inline-block",
                      background: ticket.status === "confirmed" ? "#e8f5e9" : "#fee",
                      color: ticket.status === "confirmed" ? "#2e7d32" : "#c0392b",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontFamily: "sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}>
                      {ticket.status === "confirmed" && "✓ Confirmed"}
                      {ticket.status === "checked_in" && "✓ Checked in"}
                      {ticket.status === "cancelled" && "✗ Cancelled"}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                    {ticket.status === "confirmed" && (
                      <>
                        <button
                          onClick={() => handleDownloadQR(ticket)}
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
                          Download QR
                        </button>
                        <button
                          onClick={() => handleCancel(ticket.id)}
                          style={{
                            background: "none",
                            border: "1px solid #d8d3cb",
                            padding: "10px 16px",
                            borderRadius: "8px",
                            fontFamily: "sans-serif",
                            fontSize: "12px",
                            color: tokens.black,
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {ticket.status === "cancelled" && (
                      <span style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#999" }}>
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

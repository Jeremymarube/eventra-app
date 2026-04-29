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

export default function HostDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login?redirect=/host");
      return;
    }
    fetchHostEvents();
  }, []);

  const fetchHostEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/host/events", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        setError("Failed to load events");
      }
    } catch (err) {
      setError("Network error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (eventId, publish) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_published: publish,
          status: publish ? "published" : "draft",
        }),
      });

      if (response.ok) {
        fetchHostEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (activeTab === "draft") return e.status === "draft";
    if (activeTab === "published") return e.status === "published";
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: tokens.cream, display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, padding: "40px max(16px, 3vw)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "48px", fontWeight: 900, color: tokens.black, margin: "0 0 12px" }}>
                Host Dashboard
              </h1>
              <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: "#666", margin: 0 }}>
                Manage your events and attendees
              </p>
            </div>
            <Link
              href="/host/new"
              style={{
                background: tokens.black,
                color: tokens.white,
                padding: "12px 24px",
                borderRadius: "999px",
                fontFamily: "'Georgia', serif",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              + Create event
            </Link>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid #e0dbd0", marginBottom: "32px" }}>
            <button
              onClick={() => setActiveTab("all")}
              style={{
                background: "none",
                border: "none",
                fontFamily: "sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                padding: "16px 0",
                cursor: "pointer",
                color: activeTab === "all" ? tokens.black : "#999",
                borderBottom: activeTab === "all" ? `2px solid ${tokens.black}` : "2px solid transparent",
              }}
            >
              All ({events.length})
            </button>
            <button
              onClick={() => setActiveTab("published")}
              style={{
                background: "none",
                border: "none",
                fontFamily: "sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                padding: "16px 0",
                cursor: "pointer",
                color: activeTab === "published" ? tokens.black : "#999",
                borderBottom: activeTab === "published" ? `2px solid ${tokens.black}` : "2px solid transparent",
              }}
            >
              Published ({events.filter((e) => e.status === "published").length})
            </button>
            <button
              onClick={() => setActiveTab("draft")}
              style={{
                background: "none",
                border: "none",
                fontFamily: "sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                padding: "16px 0",
                cursor: "pointer",
                color: activeTab === "draft" ? tokens.black : "#999",
                borderBottom: activeTab === "draft" ? `2px solid ${tokens.black}` : "2px solid transparent",
              }}
            >
              Drafts ({events.filter((e) => e.status === "draft").length})
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
              Loading events...
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredEvents.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontFamily: "sans-serif", fontSize: "18px", color: "#999", marginBottom: "20px" }}>
                {activeTab === "draft" ? "No draft events" : "No events yet"}
              </p>
              <Link
                href="/host/new"
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "14px",
                  color: tokens.orange,
                  textDecoration: "none",
                }}
              >
                Create your first event →
              </Link>
            </div>
          )}

          {/* Events List */}
          {!loading && filteredEvents.length > 0 && (
            <div style={{ display: "grid", gap: "16px" }}>
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  style={{
                    background: tokens.white,
                    border: "1px solid #e8e3db",
                    borderRadius: "16px",
                    padding: "24px",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "24px",
                    alignItems: "start",
                  }}
                >
                  {/* Event Info */}
                  <div>
                    <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                      {event.cover_image_url && (
                        <img
                          src={event.cover_image_url}
                          alt={event.title}
                          style={{ width: "100px", height: "100px", borderRadius: "8px", objectFit: "cover" }}
                        />
                      )}
                      <div>
                        <h3 style={{ fontFamily: "'Georgia', serif", fontSize: "18px", fontWeight: 700, color: tokens.black, margin: "0 0 8px" }}>
                          {event.title}
                        </h3>
                        <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "#666", margin: "0 0 4px" }}>
                          📅 {new Date(event.starts_at).toLocaleDateString()}
                        </p>
                        <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "#666", margin: 0 }}>
                          📍 {event.location_name}
                        </p>
                        <div style={{ marginTop: "8px" }}>
                          <span style={{
                            display: "inline-block",
                            background: event.status === "published" ? "#e3f2fd" : "#f5f5f5",
                            color: event.status === "published" ? "#1565c0" : "#999",
                            padding: "4px 12px",
                            borderRadius: "4px",
                            fontFamily: "sans-serif",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}>
                            {event.status === "draft" ? "Draft" : "Published"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", minWidth: "150px" }}>
                    <Link
                      href={`/host/event/${event.id}/attendees`}
                      style={{
                        background: "none",
                        border: "1px solid #d8d3cb",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        fontFamily: "sans-serif",
                        fontSize: "12px",
                        color: tokens.black,
                        cursor: "pointer",
                        textDecoration: "none",
                        textAlign: "center",
                      }}
                    >
                      Attendees
                    </Link>
                    <Link
                      href={`/host/event/${event.id}/analytics`}
                      style={{
                        background: "none",
                        border: "1px solid #d8d3cb",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        fontFamily: "sans-serif",
                        fontSize: "12px",
                        color: tokens.black,
                        cursor: "pointer",
                        textDecoration: "none",
                        textAlign: "center",
                      }}
                    >
                      Analytics
                    </Link>
                    <Link
                      href={`/host/edit/${event.id}`}
                      style={{
                        background: "none",
                        border: "1px solid #d8d3cb",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        fontFamily: "sans-serif",
                        fontSize: "12px",
                        color: tokens.black,
                        cursor: "pointer",
                        textDecoration: "none",
                        textAlign: "center",
                      }}
                    >
                      Edit
                    </Link>
                    {event.status === "draft" && (
                      <button
                        onClick={() => handlePublish(event.id, true)}
                        style={{
                          background: tokens.orange,
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
                        Publish
                      </button>
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

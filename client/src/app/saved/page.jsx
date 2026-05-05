"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
};

function SavedCard({ event, onRemove, removing = false }) {
  const eventData = event.event || event.events || event;
  if (!eventData) return null;

  // Format date from ISO string if available
  const dateStr = eventData.starts_at || eventData.date;
  let month = "APR";
  let day = "22";
  let tag = eventData.category || "EVENTS";
  let price = eventData.price ? `${eventData.currency === 'KES' ? 'KES ' : '$'}${eventData.price}` : "Free";
  
  if (dateStr) {
    const d = new Date(dateStr);
    month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    day = d.getDate().toString();
  }

  const handleRemoveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(event.id || event.event_id);
  };
  
  return (
    <div
      style={{
        background: tokens.white,
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid #e8e3db",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "200px" }}>
        {eventData.cover_image_url ? (
          <img
            src={eventData.cover_image_url}
            alt={eventData.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#e0dbd0", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: "48px" }}>
            📷
          </div>
        )}
        {/* Date badge */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            background: tokens.white,
            borderRadius: "12px",
            padding: "8px 14px",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: "sans-serif", fontSize: "9px", letterSpacing: "1px", color: tokens.orange, fontWeight: 700 }}>
            {month}
          </div>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: "22px", fontWeight: 900, lineHeight: 1, color: tokens.black }}>
            {day}
          </div>
        </div>
        {/* Tag */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            background: tokens.white,
            borderRadius: "999px",
            padding: "6px 14px",
            fontFamily: "sans-serif",
            fontSize: "10px",
            letterSpacing: "1px",
            fontWeight: 700,
          }}
        >
          {tag.toUpperCase()}
        </div>
        {/* Remove button */}
        <button
          onClick={handleRemoveClick}
          disabled={removing}
          title="Remove from saved"
          style={{
            position: "absolute",
            bottom: "14px",
            right: "14px",
            background: "rgba(255,255,255,0.9)",
            border: "none",
            borderRadius: "50%",
            width: "34px",
            height: "34px",
            cursor: removing ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            color: tokens.orange,
            opacity: removing ? 0.6 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {removing ? "…" : "\u2665"}
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <h3
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "17px",
              fontWeight: 900,
              color: tokens.black,
              margin: "0 0 6px",
              letterSpacing: "-0.3px",
            }}
          >
            {eventData.title}
          </h3>
          <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#888", margin: 0 }}>
            📍 {eventData.location_name || eventData.venue || "Location TBA"}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
            paddingTop: "14px",
            borderTop: "1px solid #f0ebe3",
          }}
        >
          <span style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#888" }}>
            {month} {day}
          </span>
          <span style={{ fontFamily: "'Georgia', serif", fontSize: "15px", fontWeight: 700, color: tokens.black }}>
            {price}
          </span>
        </div>
        <a
          href={`/event/${eventData.id}`}
          style={{
            display: "block",
            marginTop: "12px",
            padding: "12px",
            background: tokens.black,
            color: tokens.white,
            borderRadius: "10px",
            fontFamily: "'Georgia', serif",
            fontSize: "14px",
            fontWeight: 700,
            textDecoration: "none",
            textAlign: "center",
          }}
        >
          View event →
        </a>
      </div>
    </div>
  );
}

export default function SavedPage() {
  const router = useRouter();
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login?redirect=/saved");
      return;
    }
    fetchSavedEvents();
  }, [router]);

  const fetchSavedEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/saved-events", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSaved(Array.isArray(data) ? data : []);
      } else {
        setError("Failed to load saved events");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  async function handleRemove(eventId) {
    setRemoving((prev) => ({ ...prev, [eventId]: true }));
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/saved-events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSaved((prev) => prev.filter((e) => (e.id || e.event_id) !== eventId));
      } else {
        setError("Failed to remove event");
      }
    } catch (err) {
      console.error(err);
      setError("Error removing event");
    } finally {
      setRemoving((prev) => ({ ...prev, [eventId]: false }));
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: tokens.cream }}>
      <Header />

      <main style={{ padding: "56px 48px 80px" }}>
        {/* Header */}
        <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "2px", color: "#999", margin: "0 0 12px", fontWeight: 600 }}>
          YOUR COLLECTION
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px" }}>
          <h1
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(44px, 5vw, 64px)",
              fontWeight: 900,
              color: tokens.black,
              margin: 0,
              letterSpacing: "-2px",
              lineHeight: 1.05,
            }}
          >
            Saved <em style={{ color: tokens.orange, fontStyle: "italic" }}>events.</em>
          </h1>
          {saved.length > 0 && (
            <span style={{ fontFamily: "sans-serif", fontSize: "14px", color: "#888" }}>
              {saved.length} {saved.length === 1 ? "event" : "events"} saved
            </span>
          )}
        </div>

        {/* Grid or empty state */}
        {/* Error message */}
        {error && (
          <div style={{
            background: "#fee",
            color: "#c0392b",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "24px",
            fontFamily: "sans-serif",
            fontSize: "14px",
          }}>
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: "#aaa" }}>
              Loading saved events...
            </p>
          </div>
        )}

        {/* Grid or empty state */}
        {!loading && saved.length > 0 ? (
                <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {saved.map((event) => (
              <SavedCard key={event.id || event.event_id} event={event} onRemove={handleRemove} removing={removing[event.id || event.event_id]} />
            ))}
          </div>
        ) : !loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "100px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div style={{ fontSize: "48px" }}>♡</div>
            <h2
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "28px",
                fontWeight: 900,
                color: tokens.black,
                margin: 0,
                letterSpacing: "-0.5px",
              }}
            >
              Nothing saved yet.
            </h2>
            <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: "#888", margin: 0, maxWidth: "360px" }}>
              When you find an event worth showing up for, tap the heart to save it here.
            </p>
            <a
              href="/browse"
              style={{
                marginTop: "8px",
                background: tokens.black,
                color: tokens.white,
                padding: "14px 32px",
                borderRadius: "999px",
                fontFamily: "'Georgia', serif",
                fontSize: "15px",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Browse events →
            </a>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

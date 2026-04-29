"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
};

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id;
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    // Check if logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
        checkIfSaved(data.id);
      } else {
        setError("Event not found");
      }
    } catch (err) {
      setError("Network error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async (eid) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("/api/saved-events", {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (response.ok) {
        const saved = await response.json();
        setIsSaved(saved.some((s) => s.event?.id === eid));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(`/login?redirect=/event/${eventId}`);
      return;
    }

    try {
      if (isSaved) {
        // Unsave
        const response = await fetch(`/api/saved-events/${event.id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (response.ok) {
          setIsSaved(false);
        }
      } else {
        // Save
        const response = await fetch("/api/saved-events", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ event_id: event.id }),
        });

        if (response.ok) {
          setIsSaved(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBook = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(`/login?redirect=/event/${eventId}`);
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: event.id,
          quantity: 1,
          total_price_cents: event.price_cents,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to tickets page or show confirmation
        router.push(`/tickets`);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to book");
      }
    } catch (err) {
      alert("Network error");
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: tokens.cream, display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#999" }}>Loading event...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event || error) {
    return (
      <div style={{ minHeight: "100vh", background: tokens.cream, display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#c0392b" }}>{error || "Event not found"}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: tokens.cream }}>
      <Header />

      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "0 0 80px" }}>
        {/* Back link */}
        <div style={{ padding: "20px 48px" }}>
          <Link
            href="/browse"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "sans-serif",
              fontSize: "14px",
              color: tokens.black,
              textDecoration: "none",
              opacity: 0.7,
            }}
          >
            ← Back to browse
          </Link>
        </div>

        {/* Hero image */}
        <div
          style={{
            position: "relative",
            margin: "0 48px",
            borderRadius: "20px",
            overflow: "hidden",
            height: "420px",
          }}
        >
          <img
            src={event.cover_image_url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"}
            alt={event.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)",
              padding: "48px 32px 28px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
              <span
                style={{
                  background: tokens.white,
                  color: tokens.black,
                  borderRadius: "999px",
                  padding: "6px 16px",
                  fontFamily: "sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                }}
              >
                {event.category}
              </span>
              <span
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.75)",
                  letterSpacing: "1px",
                  fontWeight: 600,
                }}
              >
                {new Date(event.starts_at).toLocaleDateString("en-US", { weekday: "uppercase" })}
              </span>
            </div>
            <h1
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "clamp(36px, 5vw, 60px)",
                fontWeight: 900,
                color: tokens.white,
                margin: 0,
                letterSpacing: "-1.5px",
                lineHeight: 1.05,
              }}
            >
              {event.title}
            </h1>
          </div>
        </div>

        {/* Body content */}
        <div style={{ padding: "0 48px" }}>
          {/* About */}
          <div style={{ padding: "40px 0", borderBottom: "1px solid #e0dbd0" }}>
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: "10px",
                letterSpacing: "2px",
                color: "#aaa",
                margin: "0 0 16px",
                fontWeight: 600,
              }}
            >
              ABOUT THIS EVENT
            </p>
            <p
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "18px",
                lineHeight: 1.7,
                color: tokens.black,
                margin: 0,
              }}
            >
              {event.description}
            </p>
          </div>

          {/* Location */}
          <div style={{ padding: "36px 0", borderBottom: "1px solid #e0dbd0" }}>
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: "10px",
                letterSpacing: "2px",
                color: "#aaa",
                margin: "0 0 12px",
                fontWeight: 600,
              }}
            >
              LOCATION
            </p>
            <p
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "22px",
                fontWeight: 900,
                color: tokens.black,
                margin: "0 0 4px",
                letterSpacing: "-0.5px",
              }}
            >
              {event.location_name}
            </p>
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: "14px",
                color: "#888",
                margin: 0,
              }}
            >
              {event.location}
            </p>
          </div>

          {/* Booking card */}
          <div
            style={{
              marginTop: "36px",
              background: tokens.white,
              borderRadius: "20px",
              border: "1px solid #e0dbd0",
              padding: "32px",
            }}
          >
            {/* Price */}
            <div style={{ marginBottom: "28px" }}>
              <span
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "40px",
                  fontWeight: 900,
                  color: tokens.black,
                  letterSpacing: "-1px",
                }}
              >
                {event.price_cents === 0 ? "Free" : `${(event.price_cents / 100).toFixed(2)} ${event.currency}`}
              </span>
              {event.price_cents > 0 && (
                <span
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: "14px",
                    color: "#888",
                    marginLeft: "8px",
                  }}
                >
                  per ticket
                </span>
              )}
            </div>

            {/* Details list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
              {/* Date */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <span style={{ fontSize: "16px", marginTop: "1px" }}>📅</span>
                <div>
                  <div style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: 600, color: tokens.black }}>
                    {new Date(event.starts_at).toLocaleDateString()}
                  </div>
                  <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#888" }}>
                    {new Date(event.starts_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <span style={{ fontSize: "16px", marginTop: "1px" }}>📍</span>
                <div>
                  <div style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: 600, color: tokens.black }}>
                    {event.location_name}
                  </div>
                  <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#888" }}>{event.location}</div>
                </div>
              </div>

              {/* Capacity */}
              {event.capacity && (
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ fontSize: "16px" }}>👥</span>
                  <div style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: 600, color: tokens.black }}>
                    Limited to {event.capacity} guests
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            {isLoggedIn ? (
              <button
                onClick={handleBook}
                disabled={bookingLoading}
                style={{
                  width: "100%",
                  padding: "18px",
                  background: tokens.orange,
                  color: tokens.white,
                  border: "none",
                  borderRadius: "12px",
                  fontFamily: "'Georgia', serif",
                  fontSize: "17px",
                  fontWeight: 700,
                  cursor: bookingLoading ? "not-allowed" : "pointer",
                  marginBottom: "12px",
                  opacity: bookingLoading ? 0.7 : 1,
                }}
              >
                {bookingLoading ? "Booking..." : "Book event"}
              </button>
            ) : (
              <Link
                href={`/login?redirect=/event/${eventId}`}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "18px",
                  background: tokens.orange,
                  color: tokens.white,
                  border: "none",
                  borderRadius: "12px",
                  fontFamily: "'Georgia', serif",
                  fontSize: "17px",
                  fontWeight: 700,
                  textAlign: "center",
                  textDecoration: "none",
                  marginBottom: "12px",
                }}
              >
                Sign in to book
              </Link>
            )}

            {/* Save / Share row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <button
                onClick={handleSave}
                style={{
                  padding: "14px",
                  background: isSaved ? tokens.orange : "none",
                  border: isSaved ? "none" : "1px solid #e0dbd0",
                  borderRadius: "12px",
                  fontFamily: "sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: isSaved ? tokens.white : tokens.black,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                }}
              >
                {isSaved ? "♥" : "♡"} {isSaved ? "Saved" : "Save"}
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: event.title,
                      text: event.description,
                      url: window.location.href,
                    });
                  } else {
                    alert("Copy this link to share: " + window.location.href);
                  }
                }}
                style={{
                  padding: "14px",
                  background: "none",
                  border: "1px solid #e0dbd0",
                  borderRadius: "12px",
                  fontFamily: "sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: tokens.black,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                ↗ Share
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

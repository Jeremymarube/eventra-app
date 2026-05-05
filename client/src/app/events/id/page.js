"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
};

// Fetch event from backend

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) {
          setError('Event not found');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: tokens.cream }}>
        <Header />
        <main style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 48px", textAlign: "center" }}>
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ minHeight: "100vh", background: tokens.cream }}>
        <Header />
        <main style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 48px", textAlign: "center" }}>
          <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "48px", marginBottom: "20px" }}>
            Event not found
          </h1>
          <button
            onClick={() => router.push('/Browse')}
            style={{
              background: tokens.black,
              color: tokens.white,
              padding: "12px 24px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Browse events →
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: tokens.cream }}>
      <Header />

      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "0 0 80px" }}>

        {/* ── Back link ── */}
        <div style={{ padding: "20px 48px" }}>
          <button
            onClick={() => router.push('/Browse')}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "sans-serif",
              fontSize: "14px",
              color: tokens.black,
              textDecoration: "none",
              opacity: 0.7,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ← Back to browse
          </button>
        </div>

        {/* ── Hero image ── */}
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
            src={event.img}
            alt={event.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Bottom overlay */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)",
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
                {event.dayLabel}
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

        {/* ── Body content ── */}
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

          {/* Hosted by */}
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
              HOSTED BY
            </p>
            <p
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "22px",
                fontWeight: 900,
                color: tokens.black,
                margin: 0,
                letterSpacing: "-0.5px",
              }}
            >
              {event.host}
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
              {event.venue}
            </p>
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: "14px",
                color: "#888",
                margin: "0 0 20px",
              }}
            >
              {event.address}
            </p>

            {/* Map embed */}
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                height: "220px",
                border: "1px solid #e0dbd0",
              }}
            >
              <iframe
                title="Event location map"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${event.mapLng - 0.02}%2C${event.mapLat - 0.01}%2C${event.mapLng + 0.02}%2C${event.mapLat + 0.01}&layer=mapnik&marker=${event.mapLat}%2C${event.mapLng}`}
                allowFullScreen
              />
            </div>
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
                {event.price}
              </span>
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
            </div>

            {/* Details list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
              {/* Date */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <span style={{ fontSize: "16px", marginTop: "1px" }}>📅</span>
                <div>
                  <div style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: 600, color: tokens.black }}>
                    {event.date}
                  </div>
                  <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#888" }}>{event.time}</div>
                </div>
              </div>

              {/* Location */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <span style={{ fontSize: "16px", marginTop: "1px" }}>📍</span>
                <div>
                  <div style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: 600, color: tokens.black }}>
                    {event.venue}
                  </div>
                  <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#888" }}>{event.address}</div>
                </div>
              </div>

              {/* Capacity */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ fontSize: "16px" }}>🕐</span>
                <div style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: 600, color: tokens.black }}>
                  {event.capacity}
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
  onClick={() => router.push('/login')}  // Changed to /login
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
    cursor: "pointer",
    marginBottom: "12px",
  }}
>
  Sign in to book
</button>


            {/* Save / Share row */}
            <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <button
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
                ♡ Save
              </button>
              <button
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
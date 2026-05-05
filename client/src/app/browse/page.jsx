"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "../../components/Footer";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
};

const categoryFilters = ["ALL", "MUSIC", "TECH", "FOOD & DRINK", "ART", "SPORTS", "BUSINESS", "WELLNESS", "COMMUNITY", "NIGHTLIFE", "OTHER"];
const priceFilters = ["FREE", "PAID", "WEEKEND"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatEvent(event) {
  const date = event.starts_at ? new Date(event.starts_at) : null;
  const dayOfWeek = date ? date.toLocaleDateString("en-US", { weekday: "long" }) : "";
  const time = date ? date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";
  const month = date ? date.toLocaleDateString("en-US", { month: "short" }).toUpperCase() : "";
  const day = date ? date.getDate().toString() : "";
  const isWeekend = date ? [0, 6].includes(date.getDay()) : false;
  const isFree = !event.price_cents || event.price_cents === 0;
  const price = isFree ? "Free" : `KES ${(event.price_cents / 100).toLocaleString()}`;
  const tag = (event.category || "OTHER").toUpperCase().replace("-", " & ");

  return {
    ...event,
    month,
    day,
    tag,
    category: tag,
    venue: event.location_name || event.location || "TBA",
    day_label: dayOfWeek,
    time,
    price,
    free: isFree,
    weekend: isWeekend,
    img: event.cover_image_url || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
  };
}

// ── Event Card ────────────────────────────────────────────────────────────────
function EventCard({ event }) {
  return (
    <Link href={`/event/${event.id}`}>
      <div
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          color: tokens.black,
          display: "flex",
          flexDirection: "column",
          background: tokens.white,
          border: "1px solid #e8e3db",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", height: "220px", flexShrink: 0 }}>
          <img
            src={event.img}
            alt={event.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Date badge */}
          <div
            style={{
              position: "absolute", top: "14px", left: "14px",
              background: tokens.white, borderRadius: "12px",
              padding: "8px 14px", textAlign: "center", minWidth: "52px",
            }}
          >
            <div style={{ fontFamily: "sans-serif", fontSize: "9px", letterSpacing: "1px", color: tokens.orange, fontWeight: 700 }}>
              {event.month}
            </div>
            <div style={{ fontFamily: "'Georgia', serif", fontSize: "24px", fontWeight: 900, lineHeight: 1, color: tokens.black }}>
              {event.day}
            </div>
          </div>
          {/* Tag badge */}
          <div
            style={{
              position: "absolute", top: "14px", right: "14px",
              background: tokens.white, borderRadius: "999px",
              padding: "6px 14px", fontFamily: "sans-serif",
              fontSize: "10px", letterSpacing: "1px", fontWeight: 700, color: tokens.black,
            }}
          >
            {event.tag}
          </div>
          {/* Title overlay */}
          <div
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
              padding: "40px 16px 16px",
            }}
          >
            <h3 style={{ fontFamily: "'Georgia', serif", fontSize: "17px", fontWeight: 900, color: tokens.white, margin: 0, lineHeight: 1.25 }}>
              {event.title}
            </h3>
            <p style={{ fontFamily: "sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.8)", margin: "4px 0 0", display: "flex", alignItems: "center", gap: "4px" }}>
              <span>📍</span> {event.venue}
            </p>
          </div>
        </div>

        {/* Bottom meta */}
        <div
          style={{
            padding: "12px 16px", display: "flex",
            justifyContent: "space-between", alignItems: "center",
            borderTop: "1px solid #f0ebe3",
          }}
        >
          <span style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#888" }}>
            {event.day_label} · {event.time}
          </span>
          <span style={{ fontFamily: "'Georgia', serif", fontSize: "14px", fontWeight: 700, color: tokens.black }}>
            {event.price}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ borderRadius: "20px", overflow: "hidden", background: tokens.white, border: "1px solid #e8e3db" }}>
      <div style={{ height: "220px", background: "#e8e3db", animation: "pulse 1.5s infinite" }} />
      <div style={{ padding: "12px 16px" }}>
        <div style={{ height: "12px", background: "#e8e3db", borderRadius: "6px", width: "60%" }} />
      </div>
    </div>
  );
}

// ── Browse Page ───────────────────────────────────────────────────────────────
export default function BrowsePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activePriceFilter, setActivePriceFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events?published=true");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data.map(formatEvent));
    } catch (err) {
      console.error(err);
      setError("Could not load events. Is your Flask server running?");
    } finally {
      setLoading(false);
    }
  };

  const filtered = events.filter((e) => {
    const matchCategory = activeCategory === "ALL" || e.category === activeCategory;
    const matchPrice =
      !activePriceFilter ||
      (activePriceFilter === "FREE" && e.free) ||
      (activePriceFilter === "PAID" && !e.free) ||
      (activePriceFilter === "WEEKEND" && e.weekend);
    const matchSearch =
      !searchQuery ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchPrice && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: tokens.cream }}>
      <main className="browse-main" style={{ padding: "56px 48px 80px" }}>

        {/* Page header */}
        <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "2px", color: "#999", margin: "0 0 12px", fontWeight: 600 }}>
          CATALOGUE
        </p>
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(44px, 5vw, 72px)",
            fontWeight: 900, color: tokens.black,
            margin: "0 0 16px", letterSpacing: "-2px", lineHeight: 1.05,
          }}
        >
          Browse <em style={{ color: tokens.orange, fontStyle: "italic" }}>every</em> event.
        </h1>
        <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: "#777", margin: "0 0 40px" }}>
          {loading ? "Loading events..." : `${filtered.length} event${filtered.length !== 1 ? "s" : ""} on the calendar.`}
        </p>

        {/* Filter bar */}
        <div
          className="browse-filters"
          style={{
            display: "flex", flexWrap: "wrap", gap: "10px",
            alignItems: "center", marginBottom: "8px",
            paddingBottom: "20px", borderBottom: "1px solid #e0dbd0",
          }}
        >
          {/* Search icon */}
          <button
            onClick={() => setShowSearchInput(!showSearchInput)}
            style={{
              background: tokens.white, border: "1px solid #e0dbd0",
              borderRadius: "999px", width: "40px", height: "40px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* Category filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", flex: 1 }}>
            {categoryFilters.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat ? tokens.black : tokens.white,
                  color: activeCategory === cat ? tokens.white : tokens.black,
                  border: `1px solid ${activeCategory === cat ? tokens.black : "#d8d3cb"}`,
                  borderRadius: "999px", padding: "8px 18px",
                  fontFamily: "sans-serif", fontSize: "12px",
                  fontWeight: 600, letterSpacing: "0.5px",
                  cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price filters */}
          <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
            {priceFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActivePriceFilter(activePriceFilter === f ? null : f)}
                style={{
                  background: activePriceFilter === f ? tokens.black : tokens.white,
                  color: activePriceFilter === f ? tokens.white : tokens.black,
                  border: `1px solid ${activePriceFilter === f ? tokens.black : "#d8d3cb"}`,
                  borderRadius: "999px", padding: "8px 18px",
                  fontFamily: "sans-serif", fontSize: "12px",
                  fontWeight: 600, letterSpacing: "0.5px", cursor: "pointer",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Search input */}
        {showSearchInput && (
          <div className="browse-search" style={{ marginBottom: "32px", marginTop: "16px" }}>
            <input
              type="text"
              placeholder="Search events or venues…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{
                width: "100%", maxWidth: "400px",
                padding: "12px 20px", borderRadius: "999px",
                border: "1px solid #d8d3cb", fontFamily: "sans-serif",
                fontSize: "14px", background: tokens.white,
                outline: "none", color: tokens.black,
              }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "#fee", color: "#c0392b", padding: "16px", borderRadius: "12px", marginTop: "32px", fontSize: "14px" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Events grid */}
        <div className="events-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginTop: "32px" }}>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length > 0 ? (
            filtered.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <div
              style={{
                gridColumn: "1 / -1", textAlign: "center",
                padding: "80px 0", fontFamily: "'Georgia', serif",
                fontSize: "20px", color: "#aaa",
              }}
            >
              {events.length === 0 ? "No events yet. Be the first to create one!" : "No events match your filters."}
            </div>
          )}
        </div>

      </main>
      <Footer />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
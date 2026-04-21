"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// ── Design tokens ────────────────────────────────────────────────────────────
const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
};

// ── Event data ────────────────────────────────────────────────────────────────
const allEvents = [
  {
    id: 1,
    month: "APR",
    day: "22",
    tag: "WELLNESS",
    category: "WELLNESS",
    title: "Sunrise Yoga & Stillness",
    venue: "Dolores Park",
    day_label: "Wednesday",
    time: "6:30 AM",
    price: "$15",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    free: true,
  },
  {
    id: 2,
    month: "APR",
    day: "24",
    tag: "ART",
    category: "ART",
    title: "Abstract Forms Gallery Night",
    venue: "Meridian Gallery",
    day_label: "Friday",
    time: "7:00 PM",
    price: "$12",
    img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80",
    free: false,
  },
  {
    id: 3,
    month: "APR",
    day: "25",
    tag: "SPORTS",
    category: "SPORTS",
    title: "City Rooftop Run",
    venue: "Ferry Building",
    day_label: "Saturday",
    time: "8:00 AM",
    price: "Free",
    img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
    free: true,
    weekend: true,
  },
  {
    id: 4,
    month: "APR",
    day: "26",
    tag: "MUSIC",
    category: "MUSIC",
    title: "Late Night Jazz & Electric",
    venue: "The Independent",
    day_label: "Sunday",
    time: "9:00 PM",
    price: "$25",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    free: false,
    weekend: true,
  },
  {
    id: 5,
    month: "MAY",
    day: "3",
    tag: "MUSIC",
    category: "MUSIC",
    title: "Vinyl Listening Club: Side A",
    venue: "Studio 84",
    day_label: "Sunday",
    time: "10:27 AM",
    price: "$18",
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
    free: false,
    weekend: true,
  },
  {
    id: 6,
    month: "MAY",
    day: "4",
    tag: "TECH",
    category: "TECH",
    title: "The Future of Interfaces — A Conference",
    venue: "Mission Bay Conference Center",
    day_label: "Monday",
    time: "11:27 PM",
    price: "$199",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    free: false,
  },
  {
    id: 7,
    month: "MAY",
    day: "6",
    tag: "FOOD & DRINK",
    category: "FOOD & DRINK",
    title: "Natural Wine 101: A Tasting",
    venue: "Ordinaire Wine",
    day_label: "Wednesday",
    time: "9:27 AM",
    price: "$45",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    free: false,
  },
  {
    id: 8,
    month: "MAY",
    day: "10",
    tag: "WELLNESS",
    category: "WELLNESS",
    title: "Forest Bathing: A Slow Morning Walk",
    venue: "Muir Woods",
    day_label: "Sunday",
    time: "11:27 PM",
    price: "$20",
    img: "https://images.unsplash.com/photo-1499852848443-3004847b2f5d?w=600&q=80",
    free: false,
    weekend: true,
  },
];

const categoryFilters = ["ALL", "MUSIC", "TECH", "FOOD & DRINK", "ART", "SPORTS", "BUSINESS", "WELLNESS", "COMMUNITY", "NIGHTLIFE", "OTHER"];
const priceFilters = ["FREE", "PAID", "WEEKEND"];

// ── Event Card ────────────────────────────────────────────────────────────────
function EventCard({ event }) {
  return (
    <a
      href="#"
      style={{
        borderRadius: "20px",
        overflow: "hidden",
        textDecoration: "none",
        color: tokens.black,
        display: "flex",
        flexDirection: "column",
        background: tokens.white,
        border: "1px solid #e8e3db",
      }}
    >
      {/* Image area */}
      <div style={{ position: "relative", height: "220px", flexShrink: 0 }}>
        <img
          src={event.img}
          alt={event.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
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
            minWidth: "52px",
          }}
        >
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: "9px",
              letterSpacing: "1px",
              color: tokens.orange,
              fontWeight: 700,
            }}
          >
            {event.month}
          </div>
          <div
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "24px",
              fontWeight: 900,
              lineHeight: 1,
              color: tokens.black,
            }}
          >
            {event.day}
          </div>
        </div>
        {/* Tag badge */}
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
            color: tokens.black,
          }}
        >
          {event.tag}
        </div>
        {/* Title overlay on image */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
            padding: "40px 16px 16px",
          }}
        >
          <h3
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "17px",
              fontWeight: 900,
              color: tokens.white,
              margin: 0,
              lineHeight: 1.25,
            }}
          >
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
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #f0ebe3",
        }}
      >
        <span style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#888" }}>
          {event.day_label} · {event.time}
        </span>
        <span
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "14px",
            fontWeight: 700,
            color: tokens.black,
          }}
        >
          {event.price}
        </span>
      </div>
    </a>
  );
}

// ── Browse Page ───────────────────────────────────────────────────────────────
export default function BrowsePage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activePriceFilter, setActivePriceFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = allEvents.filter((e) => {
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
      <Header />

      <main style={{ padding: "56px 48px 80px" }}>
        {/* Page header */}
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "11px",
            letterSpacing: "2px",
            color: "#999",
            margin: "0 0 12px",
            fontWeight: 600,
          }}
        >
          CATALOGUE
        </p>
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(44px, 5vw, 72px)",
            fontWeight: 900,
            color: tokens.black,
            margin: "0 0 16px",
            letterSpacing: "-2px",
            lineHeight: 1.05,
          }}
        >
          Browse <em style={{ color: tokens.orange, fontStyle: "italic" }}>every</em> event.
        </h1>
        <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: "#777", margin: "0 0 40px" }}>
          Filter by category, price, or when you want to go. {allEvents.length} events on the calendar.
        </p>

        {/* Filter bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center",
            marginBottom: "8px",
            paddingBottom: "20px",
            borderBottom: "1px solid #e0dbd0",
          }}
        >
          {/* Search icon pill */}
          <button
            style={{
              background: tokens.white,
              border: "1px solid #e0dbd0",
              borderRadius: "999px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
            onClick={() => setSearchQuery("")}
            aria-label="Search"
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
                  borderRadius: "999px",
                  padding: "8px 18px",
                  fontFamily: "sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price / time filters */}
          <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
            {priceFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActivePriceFilter(activePriceFilter === f ? null : f)}
                style={{
                  background: activePriceFilter === f ? tokens.black : tokens.white,
                  color: activePriceFilter === f ? tokens.white : tokens.black,
                  border: `1px solid ${activePriceFilter === f ? tokens.black : "#d8d3cb"}`,
                  borderRadius: "999px",
                  padding: "8px 18px",
                  fontFamily: "sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Search input (shown when results are being searched) */}
        {searchQuery !== undefined && (
          <div style={{ marginBottom: "32px", marginTop: "16px" }}>
            <input
              type="text"
              placeholder="Search events or venues…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "400px",
                padding: "12px 20px",
                borderRadius: "999px",
                border: "1px solid #d8d3cb",
                fontFamily: "sans-serif",
                fontSize: "14px",
                background: tokens.white,
                outline: "none",
                color: tokens.black,
              }}
            />
          </div>
        )}

        {/* Events grid */}
        {filtered.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
              marginTop: "32px",
            }}
          >
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              fontFamily: "'Georgia', serif",
              fontSize: "20px",
              color: "#aaa",
            }}
          >
            No events match your filters.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
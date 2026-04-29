"use client";

import { useParams, useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
};

// Mock events data (will come from Flask backend later)
const eventsData = {
  1: {
    id: 1,
    title: "Golden Hour Sessions",
    category: "MUSIC",
    dayLabel: "FRIDAY",
    description: "An evening of soulful music as the sun sets over San Francisco. Local artists, food trucks, and good vibes.",
    host: "SF Arts & Culture",
    venue: "Golden Gate Park Bandshell",
    address: "501 Stanyan St, San Francisco, CA 94117",
    date: "Friday, April 25",
    time: "6:00 PM - 10:00 PM",
    capacity: "Limited to 500 guests",
    price: "$25 - $45",
    img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
    mapLat: 37.7694,
    mapLng: -122.4862,
  },
  2: {
    id: 2,
    title: "Sunrise Yoga & Stillness",
    category: "WELLNESS",
    dayLabel: "WEDNESDAY",
    description: "Move slowly, breathe deeply, watch the day arrive. All levels welcome. Mats provided.",
    host: "Eventra Curators",
    venue: "Bernal Heights Summit",
    address: "Bernal Heights Park, San Francisco, CA",
    date: "Wednesday, April 22",
    time: "8:57 PM",
    capacity: "Limited to 30 guests",
    price: "$15",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    mapLat: 37.7399,
    mapLng: -122.4148,
  },
  3: {
    id: 3,
    title: "Abstract Forms Gallery Night",
    category: "ART",
    dayLabel: "THURSDAY",
    description: "Explore contemporary abstract art at Meridian Gallery. Wine and small bites provided.",
    host: "Meridian Gallery",
    venue: "Meridian Gallery",
    address: "535 Powell St, San Francisco, CA 94108",
    date: "Thursday, April 24",
    time: "7:00 PM - 9:30 PM",
    capacity: "Limited to 100 guests",
    price: "$25",
    img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&q=80",
    mapLat: 37.7883,
    mapLng: -122.4084,
  },
  4: {
    id: 4,
    title: "City Rooftop Run",
    category: "SPORTS",
    dayLabel: "SATURDAY",
    description: "5K run with stunning skyline views. Proceeds benefit local parks.",
    host: "SF Running Club",
    venue: "Salesforce Park",
    address: "425 Mission St, San Francisco, CA 94105",
    date: "Saturday, April 26",
    time: "8:00 AM - 10:00 AM",
    capacity: "Limited to 300 runners",
    price: "$35",
    img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
    mapLat: 37.7898,
    mapLng: -122.3971,
  },
  5: {
    id: 5,
    title: "Late Night Jazz & Electric",
    category: "MUSIC",
    dayLabel: "SATURDAY",
    description: "Late night jazz fusion and electronic beats. 21+ event.",
    host: "Nightlife Collective",
    venue: "Studio 84",
    address: "84 Turk St, San Francisco, CA 94102",
    date: "Saturday, April 26",
    time: "10:00 PM - 2:00 AM",
    capacity: "Limited to 200 guests",
    price: "$18",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80",
    mapLat: 37.7825,
    mapLng: -122.4108,
  },
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;
  const event = eventsData[eventId];

  // If event not found, show error
  if (!event) {
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
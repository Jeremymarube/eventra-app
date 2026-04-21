// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";

// //import { supabase } from "@/integrations/supabase/client";
// import { Header } from "@/components/Header";
// import { SiteFooter } from "@/components/Footer";
// import { EventCard, resolveCover } from "@/components/EventCard";
// import { Button } from "@/components/ui/Button";
// import { CATEGORIES, CATEGORY_LABELS } from "@/lib/format";

// //import heroImg from "@//hero-event.jpg";
// import { ArrowRight, Sparkles } from "lucide-react";



"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Browse from "../pages/Browse.jsx";

// ── Design tokens ────────────────────────────────────────────────────────────
const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
  darkBg: "#1a1008",
};

// ── HERO SECTION ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      style={{
        background: tokens.cream,
        padding: "72px 48px 80px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "48px",
        alignItems: "center",
        minHeight: "500px",
      }}
    >
      <div>
        <h1
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(52px, 6vw, 84px)",
            fontWeight: 900,
            lineHeight: 1.05,
            color: tokens.black,
            margin: "0 0 24px",
            letterSpacing: "-2px",
          }}
        >
          Events worth{" "}
          <em style={{ color: tokens.orange, fontStyle: "italic" }}>showing</em>{" "}
          up for.
        </h1>
        <p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "16px",
            lineHeight: 1.7,
            color: "#555",
            maxWidth: "440px",
            margin: "0 0 40px",
          }}
        >
          Eventra is your editorial guide to the gatherings that matter — from
          candlelit dinners and gallery openings to rooftop sets and sunrise yoga.
        </p>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <a
            href="#"
            style={{
              background: tokens.black,
              color: tokens.white,
              padding: "14px 28px",
              borderRadius: "999px",
              fontFamily: "'Georgia', serif",
              fontSize: "15px",
              textDecoration: "none",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Browse events <span>→</span>
          </a>
          <a
            href="#"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "15px",
              color: tokens.black,
              textDecoration: "none",
            }}
          >
            Explore categories
          </a>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <div
          style={{
            borderRadius: "24px",
            overflow: "hidden",
            position: "relative",
            height: "380px",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80"
            alt="Golden Hour Sessions concert"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              background: "rgba(20,12,4,0.85)",
              backdropFilter: "blur(8px)",
              borderRadius: "12px",
              padding: "14px 20px",
              color: tokens.white,
            }}
          >
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "2px",
                opacity: 0.7,
                fontFamily: "sans-serif",
                marginBottom: "4px",
              }}
            >
              FEATURED
            </div>
            <div style={{ fontFamily: "'Georgia', serif", fontSize: "18px", fontWeight: 700 }}>
              Golden Hour Sessions
            </div>
          </div>
          <button
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              background: tokens.white,
              border: "none",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            ✦
          </button>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "-20px",
            left: "-20px",
            width: "120px",
            height: "120px",
            background: tokens.orange,
            borderRadius: "50%",
            opacity: 0.85,
            zIndex: -1,
          }}
        />
      </div>
    </section>
  );
}

// ── CATEGORY FILTER BAR ───────────────────────────────────────────────────────
function CategoryBar() {
  const [active, setActive] = useState("NOW SHOWING");
  const cats = ["NOW SHOWING", "MUSIC", "FOOD & DRINK", "ART", "TECH", "WELLNESS", "NIGHTLIFE", "COMMUNITY"];

  return (
    <div
      style={{
        background: tokens.cream,
        borderTop: "1px solid #e0dbd0",
        borderBottom: "1px solid #e0dbd0",
        padding: "0 48px",
        display: "flex",
        gap: "32px",
        alignItems: "center",
        overflowX: "auto",
        whiteSpace: "nowrap",
      }}
    >
      {cats.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "16px 0",
            fontFamily: "sans-serif",
            fontSize: "11px",
            letterSpacing: "1.5px",
            fontWeight: 600,
            color: active === cat ? tokens.black : "#999",
            borderBottom: active === cat ? `2px solid ${tokens.black}` : "2px solid transparent",
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

// ── BROWSE BY CATEGORY ────────────────────────────────────────────────────────
function BrowseByCategory() {
  const categories = [
    { n: "01", label: "Music" },
    { n: "02", label: "Tech" },
    { n: "03", label: "Food & Drink" },
    { n: "04", label: "Art" },
    { n: "05", label: "Sports" },
    { n: "06", label: "Business" },
    { n: "07", label: "Wellness" },
    { n: "08", label: "Community" },
    { n: "09", label: "Nightlife" },
    { n: "10", label: "Other" },
  ];

  return (
    <section style={{ background: tokens.cream, padding: "72px 48px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "40px",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "11px",
              letterSpacing: "2px",
              color: "#999",
              margin: "0 0 8px",
            }}
          >
            DEPARTMENTS
          </p>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "42px",
              fontWeight: 900,
              margin: 0,
              color: tokens.black,
              letterSpacing: "-1px",
            }}
          >
            Browse by category
          </h2>
        </div>
        <a
          href="#"
          style={{
            fontFamily: "sans-serif",
            fontSize: "13px",
            color: tokens.orange,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          See all →
        </a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
        {categories.map((cat) => (
          <a
            key={cat.n}
            href="#"
            style={{
              background: tokens.white,
              borderRadius: "16px",
              padding: "20px",
              textDecoration: "none",
              color: tokens.black,
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              border: "1px solid #e8e3db",
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <span style={{ fontFamily: "sans-serif", fontSize: "10px", letterSpacing: "1px", color: "#aaa" }}>
              N°{cat.n}
            </span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Georgia', serif", fontSize: "17px", fontWeight: 700 }}>
                {cat.label}
              </span>
              <span style={{ fontSize: "14px" }}>→</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ── EDITOR'S PICK ─────────────────────────────────────────────────────────────
function EditorsPick() {
  return (
    <section
      style={{
        background: tokens.cream,
        borderTop: "1px solid #e0dbd0",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "480px",
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
        alt="Sunrise Yoga"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{ padding: "72px 60px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "11px",
            letterSpacing: "2px",
            color: tokens.orange,
            margin: "0 0 16px",
            fontWeight: 600,
          }}
        >
          EDITOR'S PICK
        </p>
        <h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 900,
            color: tokens.black,
            margin: "0 0 24px",
            lineHeight: 1.1,
            letterSpacing: "-1px",
          }}
        >
          Sunrise Yoga &amp; Stillness
        </h2>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "24px" }}>
          <span
            style={{
              background: "#e8e3db",
              borderRadius: "999px",
              padding: "6px 14px",
              fontFamily: "sans-serif",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Wellness
          </span>
          <span style={{ color: "#aaa", fontSize: "13px" }}>•</span>
          <span style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#666" }}>Wednesday, April 22</span>
        </div>
        <p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "16px",
            lineHeight: 1.7,
            color: "#555",
            margin: "0 0 36px",
          }}
        >
          Step into a curated experience selected by our editors this week. Tap through to see full details,
          location, and how to attend.
        </p>
        <a
          href="#"
          style={{
            background: tokens.orange,
            color: tokens.white,
            padding: "14px 28px",
            borderRadius: "999px",
            fontFamily: "'Georgia', serif",
            fontSize: "15px",
            textDecoration: "none",
            fontWeight: 600,
            display: "inline-block",
            alignSelf: "flex-start",
          }}
        >
          View event
        </a>
      </div>
    </section>
  );
}

// ── DON'T MISS OUT ────────────────────────────────────────────────────────────
const eventCards = [
  {
    month: "APR",
    day: "24",
    tag: "ART",
    img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80",
    title: "Abstract Forms Gallery Night",
  },
  {
    month: "APR",
    day: "25",
    tag: "SPORTS",
    img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
    title: "City Rooftop Run",
  },
  {
    month: "APR",
    day: "26",
    tag: "MUSIC",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    title: "Late Night Jazz & Electric",
  },
];

function DontMissOut() {
  return (
    <section style={{ background: tokens.cream, padding: "72px 48px", borderTop: "1px solid #e0dbd0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "40px",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "11px",
              letterSpacing: "2px",
              color: "#999",
              margin: "0 0 8px",
            }}
          >
            THIS WEEK
          </p>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "42px",
              fontWeight: 900,
              margin: 0,
              color: tokens.black,
              letterSpacing: "-1px",
            }}
          >
            Don't miss out
          </h2>
        </div>
        <a
          href="#"
          style={{
            fontFamily: "sans-serif",
            fontSize: "13px",
            color: tokens.black,
            textDecoration: "none",
            border: "1px solid #ccc",
            padding: "10px 20px",
            borderRadius: "999px",
          }}
        >
          Browse all events
        </a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {eventCards.map((card) => (
          <a
            key={card.day}
            href="#"
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              textDecoration: "none",
              color: tokens.black,
              position: "relative",
              display: "block",
              aspectRatio: "4/3",
            }}
          >
            <img
              src={card.img}
              alt={card.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                background: tokens.white,
                borderRadius: "12px",
                padding: "8px 14px",
                textAlign: "center",
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
                {card.month}
              </div>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: "22px", fontWeight: 900, lineHeight: 1 }}>
                {card.day}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: tokens.white,
                borderRadius: "999px",
                padding: "6px 14px",
                fontFamily: "sans-serif",
                fontSize: "10px",
                letterSpacing: "1px",
                fontWeight: 700,
              }}
            >
              {card.tag}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ── HOST CTA ──────────────────────────────────────────────────────────────────
function HostCTA() {
  return (
    <section style={{ background: tokens.cream, padding: "0 48px 72px" }}>
      <div
        style={{
          background: `radial-gradient(ellipse at 80% 50%, #3d1a08 0%, ${tokens.darkBg} 60%)`,
          borderRadius: "24px",
          padding: "60px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "10px",
              letterSpacing: "2px",
              color: "#aaa",
              margin: "0 0 16px",
            }}
          >
            HOSTING SOMETHING?
          </p>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(28px, 3vw, 42px)",
              fontWeight: 900,
              color: tokens.white,
              margin: "0 0 16px",
              letterSpacing: "-0.5px",
            }}
          >
            Bring your event to a city of curious people.
          </h2>
          <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "#aaa", margin: 0, maxWidth: "480px" }}>
            Sign in to publish events, manage tickets, and reach attendees who want to be there.
          </p>
        </div>
        <a
          href="#"
          style={{
            background: tokens.orange,
            color: tokens.white,
            padding: "16px 32px",
            borderRadius: "999px",
            fontFamily: "'Georgia', serif",
            fontSize: "16px",
            textDecoration: "none",
            fontWeight: 700,
            whiteSpace: "nowrap",
            flexShrink: 0,
            marginLeft: "40px",
          }}
        >
          Get started
        </a>
      </div>
    </section>
  );
}

// ── PAGE (imports Header & Footer) ────────────────────────────────────────────
export default function Page() {
  return (
    <div style={{ minHeight: "100vh", background: tokens.cream }}>
      <Header />
      <main>
        <HeroSection />
        <CategoryBar />
        <BrowseByCategory />
        <EditorsPick />
        <DontMissOut />
        <HostCTA />
      </main>
      <Footer />
    </div>
  );
}            
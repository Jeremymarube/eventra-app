"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
  darkBg: "#1a1008",
};

// ── 1. HERO ───────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "48px",
        padding: "56px 48px 72px",
        alignItems: "center",
        background: tokens.cream,
      }}
    >
      {/* Left */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          <div style={{ width: "40px", height: "1px", background: tokens.black }} />
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: "11px",
              letterSpacing: "2px",
              color: "#888",
              fontWeight: 600,
            }}
          >
            ABOUT · ISSUE 01
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(48px, 5.5vw, 76px)",
            fontWeight: 900,
            color: tokens.black,
            margin: "0 0 8px",
            lineHeight: 1.05,
            letterSpacing: "-2px",
          }}
        >
          Events worth showing up for.
        </h1>

        {/* Underline accent */}
        <div
          style={{
            width: "260px",
            height: "4px",
            background: "rgba(232,68,10,0.25)",
            borderRadius: "2px",
            margin: "0 0 32px",
          }}
        />

        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "15px",
            lineHeight: 1.7,
            color: "#666",
            maxWidth: "480px",
            margin: "0 0 40px",
          }}
        >
          Eventra is a magazine-grade event discovery platform. We help curious
          humans find concerts, dinners, gallery openings, talks, and weekenders
          — without drowning in algorithmic noise.
        </p>

        <div style={{ display: "flex", gap: "16px" }}>
          <a
            href="/browse"
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
            Browse events →
          </a>
          <a
            href="/register"
            style={{
              background: "none",
              color: tokens.black,
              padding: "14px 28px",
              borderRadius: "999px",
              fontFamily: "'Georgia', serif",
              fontSize: "15px",
              textDecoration: "none",
              fontWeight: 600,
              border: `1px solid ${tokens.black}`,
            }}
          >
            Become a host
          </a>
        </div>
      </div>

      {/* Right — cover card */}
      <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", height: "380px" }}>
        <img
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80"
          alt="Cover story"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(to top, rgba(255,255,255,0.95) 0%, transparent 55%)",
            padding: "32px 24px 24px",
          }}
        >
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "10px",
              letterSpacing: "2px",
              color: "#888",
              margin: "0 0 6px",
              fontWeight: 600,
            }}
          >
            COVER STORY
          </p>
          <h3
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "22px",
              fontWeight: 900,
              color: tokens.black,
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            Where the city meets itself.
          </h3>
        </div>
      </div>
    </section>
  );
}

// ── 2. MANIFESTO ──────────────────────────────────────────────────────────────
function Manifesto() {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "80px",
        padding: "80px 48px",
        borderTop: "1px solid #e0dbd0",
        background: tokens.cream,
      }}
    >
      {/* Left */}
      <div>
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "11px",
            letterSpacing: "2px",
            color: "#999",
            margin: "0 0 20px",
            fontWeight: 600,
          }}
        >
          MANIFESTO
        </p>
        <h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(36px, 4vw, 52px)",
            fontWeight: 900,
            color: tokens.black,
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
          }}
        >
          The internet flattened culture. We're un-flattening it.
        </h2>
      </div>

      {/* Right */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "24px" }}>
        <p style={{ fontFamily: "sans-serif", fontSize: "15px", lineHeight: 1.8, color: "#444", margin: 0 }}>
          Most event platforms treat a warehouse rave and a wine tasting like the
          same row in a database. We don't. Eventra is built around the belief
          that{" "}
          <em style={{ fontStyle: "italic", color: tokens.black }}>
            where you spend your evenings shapes who you become.
          </em>
        </p>
        <p style={{ fontFamily: "sans-serif", fontSize: "15px", lineHeight: 1.8, color: "#444", margin: 0 }}>
          So we put the editorial back into discovery. Each listing is laid out
          like a spread — typography that breathes, photography that earns its
          place, copy that respects your attention.
        </p>
        <p style={{ fontFamily: "sans-serif", fontSize: "15px", lineHeight: 1.8, color: "#444", margin: 0 }}>
          Whether you're a host launching a 30-person supper club or an attendee
          looking for the right Thursday night, Eventra is the home page for
          going out again.
        </p>
      </div>
    </section>
  );
}

// ── 3. PRINCIPLES ─────────────────────────────────────────────────────────────
const principles = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8440A" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
    ),
    title: "Curated, not crowded",
    body: "Every event on Eventra is hand-picked or vetted by hosts who care. No spam, no filler — only nights worth remembering.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8440A" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Built for showing up",
    body: "We design for the moment between scrolling and stepping out. Save what speaks to you, then actually go.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8440A" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Hosts first",
    body: "Independent organizers, supper clubs, collectives, and venues get the tools — and the spotlight — they deserve.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8440A" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Editorial at heart",
    body: "We treat the listing like a magazine spread. Beautiful typography, warm photography, generous space.",
  },
];

function Principles() {
  return (
    <section style={{ background: tokens.cream, padding: "80px 48px", borderTop: "1px solid #e0dbd0" }}>
      <p
        style={{
          fontFamily: "sans-serif",
          fontSize: "11px",
          letterSpacing: "2px",
          color: "#999",
          margin: "0 0 16px",
          fontWeight: 600,
        }}
      >
        WHAT WE BELIEVE
      </p>
      <h2
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: "clamp(36px, 4vw, 54px)",
          fontWeight: 900,
          color: tokens.black,
          margin: "0 0 48px",
          letterSpacing: "-1.5px",
          lineHeight: 1.1,
          maxWidth: "480px",
        }}
      >
        Four principles, no compromises.
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {principles.map((p) => (
          <div
            key={p.title}
            style={{
              background: tokens.white,
              borderRadius: "20px",
              padding: "36px",
              border: "1px solid #e8e3db",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "rgba(232,68,10,0.1)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "28px",
              }}
            >
              {p.icon}
            </div>
            <h3
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "20px",
                fontWeight: 900,
                color: tokens.black,
                margin: "0 0 12px",
                letterSpacing: "-0.5px",
              }}
            >
              {p.title}
            </h3>
            <p style={{ fontFamily: "sans-serif", fontSize: "14px", lineHeight: 1.7, color: "#666", margin: 0 }}>
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 4. STATS ──────────────────────────────────────────────────────────────────
const stats = [
  { value: "12", label: "CATEGORIES" },
  { value: "48", label: "CITIES, GROWING" },
  { value: "1.2k", label: "EVENTS LISTED MONTHLY" },
  { value: "94%", label: "ATTENDEES WHO'D RETURN" },
];

function Stats() {
  return (
    <section
      style={{
        background: tokens.cream,
        padding: "80px 48px",
        borderTop: "1px solid #e0dbd0",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px" }}>
        {stats.map((s) => (
          <div key={s.label}>
            <div style={{ height: "1px", background: tokens.black, marginBottom: "24px" }} />
            <div
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "clamp(44px, 5vw, 64px)",
                fontWeight: 900,
                color: tokens.black,
                lineHeight: 1,
                letterSpacing: "-2px",
                marginBottom: "10px",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: "10px",
                letterSpacing: "2px",
                color: "#999",
                fontWeight: 600,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 5. JOIN CTA ───────────────────────────────────────────────────────────────
function JoinCTA() {
  return (
    <section style={{ background: tokens.cream, padding: "0 48px 72px" }}>
      <div
        style={{
          background: `radial-gradient(ellipse at 80% 50%, #3d1a08 0%, ${tokens.darkBg} 60%)`,
          borderRadius: "24px",
          padding: "72px 64px",
        }}
      >
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "10px",
            letterSpacing: "2px",
            color: "#aaa",
            margin: "0 0 20px",
            fontWeight: 600,
          }}
        >
          JOIN THE ISSUE
        </p>
        <h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 900,
            color: tokens.white,
            margin: "0 0 20px",
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            maxWidth: "560px",
          }}
        >
          Make this weekend mean something.
        </h2>
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "15px",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.7,
            margin: "0 0 40px",
            maxWidth: "480px",
          }}
        >
          Sign up free to save events, follow hosts you love, and get a weekly
          edit of what's worth your Friday.
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          <a
            href="/register"
            style={{
              background: tokens.orange,
              color: tokens.white,
              padding: "16px 32px",
              borderRadius: "999px",
              fontFamily: "'Georgia', serif",
              fontSize: "16px",
              textDecoration: "none",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Create account →
          </a>
          <a
            href="/browse"
            style={{
              background: "none",
              color: tokens.white,
              padding: "16px 32px",
              borderRadius: "999px",
              fontFamily: "'Georgia', serif",
              fontSize: "16px",
              textDecoration: "none",
              fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            Just browsing
          </a>
        </div>
      </div>
    </section>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: tokens.cream }}>
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <Principles />
        <Stats />
        <JoinCTA />
      </main>
      <Footer />
    </div>
  );
}
"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";


const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
};

const suggestions = [
  { label: "Browse all events", href: "/browse" },
  { label: "Explore categories", href: "/categories" },
  { label: "About Eventra", href: "/about" },
];

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: "100vh", background: tokens.cream }}>
      <Header />

      <main
        style={{
          padding: "100px 48px 120px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Big 404 */}
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(100px, 18vw, 200px)",
            fontWeight: 900,
            color: tokens.black,
            lineHeight: 1,
            letterSpacing: "-8px",
            margin: "0 0 -16px",
            opacity: 0.06,
            userSelect: "none",
          }}
        >
          404
        </div>

        {/* Icon */}
        <div style={{ fontSize: "48px", margin: "0 0 24px" }}>🗓️</div>

        {/* Copy */}
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
          PAGE NOT FOUND
        </p>
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 900,
            color: tokens.black,
            margin: "0 0 20px",
            letterSpacing: "-2px",
            lineHeight: 1.05,
            maxWidth: "560px",
          }}
        >
          This event has left the building.
        </h1>
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "16px",
            color: "#888",
            lineHeight: 1.7,
            margin: "0 0 48px",
            maxWidth: "420px",
          }}
        >
          The page you're looking for doesn't exist, was moved, or never showed up in the first place.
        </p>

        {/* Primary CTA */}
        <a
          href="/"
          style={{
            background: tokens.black,
            color: tokens.white,
            padding: "16px 36px",
            borderRadius: "999px",
            fontFamily: "'Georgia', serif",
            fontSize: "16px",
            textDecoration: "none",
            fontWeight: 700,
            marginBottom: "48px",
          }}
        >
          Back to home →
        </a>

        {/* Divider */}
        <div
          style={{
            width: "40px",
            height: "1px",
            background: "#ccc",
            margin: "0 0 32px",
          }}
        />

        {/* Suggestions */}
        <p style={{ fontFamily: "sans-serif", fontSize: "12px", letterSpacing: "1.5px", color: "#bbb", margin: "0 0 20px", fontWeight: 600 }}>
          OR TRY ONE OF THESE
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          {suggestions.map((s) => (
            <a
              key={s.label}
              href={s.href}
              style={{
                background: tokens.white,
                color: tokens.black,
                padding: "12px 24px",
                borderRadius: "999px",
                fontFamily: "sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid #e0dbd0",
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

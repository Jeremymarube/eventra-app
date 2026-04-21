"use client";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
};

export default function Header() {
  return (
    <header
      style={{
        background: tokens.cream,
        borderBottom: "1px solid #e0dbd0",
        padding: "0 48px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "2px" }}>
        <span
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 700,
            fontSize: "22px",
            color: tokens.black,
            letterSpacing: "-0.5px",
          }}
        >
          Eventra
        </span>
        <span style={{ color: tokens.orange, fontSize: "28px", lineHeight: 1, marginTop: "-4px" }}>.</span>
      </a>

      {/* Nav */}
      <nav style={{ display: "flex", gap: "36px", alignItems: "center" }}>
        {["Browse", "Categories", "About"].map((item) => (
          <a
            key={item}
            href="#"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "15px",
              color: tokens.black,
              textDecoration: "none",
              opacity: 0.8,
            }}
          >
            {item}
          </a>
        ))}
      </nav>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <button
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: tokens.black }}
          aria-label="Search"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
        <a
          href="#"
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "15px",
            color: tokens.black,
            textDecoration: "none",
          }}
        >
          Sign in
        </a>
        <a
          href="#"
          style={{
            background: tokens.black,
            color: tokens.white,
            padding: "10px 20px",
            borderRadius: "999px",
            fontFamily: "'Georgia', serif",
            fontSize: "14px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Get started
        </a>
      </div>
    </header>
  );
}
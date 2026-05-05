"use client";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
  deepBlue: "#0D1B2A",
  gray: "#666666",
  lightGray: "#f7f7f7",
  borderGray: "#e5e5e5",
};

const stats = [
  { value: "10,000+", label: "Events hosted" },
  { value: "50,000+", label: "Tickets sold" },
  { value: "Kenya", label: "Headquartered" },
  { value: "2024", label: "Founded" },
];

const pressKit = [
  { title: "Brand Guidelines", desc: "Logo usage, colors, typography, and tone of voice.", icon: "🎨" },
  { title: "Product Screenshots", desc: "High-resolution screenshots of the Eventra platform.", icon: "📸" },
  { title: "Founder Photos", desc: "Professional photos of the founding team.", icon: "👤" },
  { title: "Company Fact Sheet", desc: "Key facts, figures, and milestones about Eventra.", icon: "📄" },
];

export default function PressPage() {
  return (
    <div style={{ background: tokens.white, minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ background: tokens.deepBlue, padding: "80px max(20px, 5vw)" }}>
        <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "3px", color: tokens.orange, fontWeight: 700, textTransform: "uppercase", margin: "0 0 16px" }}>
          Newsroom
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(36px, 7vw, 64px)", fontWeight: 900, color: tokens.cream, margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-1px", maxWidth: "700px" }}>
          Press & Media
        </h1>
        <p style={{ fontFamily: "sans-serif", fontSize: "clamp(14px, 2vw, 17px)", color: "rgba(245,240,232,0.6)", maxWidth: "520px", lineHeight: 1.7, margin: 0 }}>
          For press enquiries, interview requests, and media resources. We'd love to tell the Eventra story with you.
        </p>
      </section>

      {/* Stats */}
      <section style={{ padding: "56px max(20px, 5vw)", background: tokens.lightGray, borderBottom: `1px solid ${tokens.borderGray}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "24px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, color: tokens.orange, margin: "0 0 8px" }}>{stat.value}</div>
              <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: tokens.gray, letterSpacing: "1px", textTransform: "uppercase" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About Eventra */}
      <section style={{ padding: "72px max(20px, 5vw)", maxWidth: "720px", margin: "0 auto" }}>
        <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "2px", color: "rgba(26,26,26,0.4)", textTransform: "uppercase", margin: "0 0 8px" }}>About</p>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: tokens.black, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
          The Eventra story
        </h2>
        <p style={{ fontFamily: "sans-serif", fontSize: "16px", color: tokens.gray, lineHeight: 1.8, margin: "0 0 16px" }}>
          Eventra was founded in Kenya in 2024 with a simple mission: make it easy for anyone to discover and host events worth showing up for. We built the platform we wished existed — one that works for local creators, not just big corporations.
        </p>
        <p style={{ fontFamily: "sans-serif", fontSize: "16px", color: tokens.gray, lineHeight: 1.8, margin: 0 }}>
          Today, Eventra powers thousands of events across Kenya — from tech meetups and art exhibitions to community gatherings and music festivals.
        </p>
      </section>

      {/* Press Kit */}
      <section style={{ padding: "72px max(20px, 5vw)", background: tokens.lightGray, borderTop: `1px solid ${tokens.borderGray}` }}>
        <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "2px", color: "rgba(26,26,26,0.4)", textTransform: "uppercase", margin: "0 0 8px" }}>Resources</p>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: tokens.black, margin: "0 0 36px", letterSpacing: "-0.5px" }}>
          Press kit
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
          {pressKit.map((item) => (
            <div key={item.title} style={{ background: tokens.white, borderRadius: "16px", padding: "28px", border: `1px solid ${tokens.borderGray}`, display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "28px" }}>{item.icon}</span>
              <div>
                <h3 style={{ fontFamily: "'Georgia', serif", fontSize: "17px", fontWeight: 700, color: tokens.black, margin: "0 0 6px" }}>{item.title}</h3>
                <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: tokens.gray, lineHeight: 1.6, margin: "0 0 12px" }}>{item.desc}</p>
                <button style={{ background: "none", border: `1px solid ${tokens.borderGray}`, borderRadius: "8px", padding: "8px 14px", fontSize: "13px", cursor: "pointer", color: tokens.black }}>
                  Request →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section style={{ padding: "72px max(20px, 5vw)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: tokens.black, margin: "0 0 16px" }}>
          Get in touch
        </h2>
        <p style={{ fontFamily: "sans-serif", fontSize: "16px", color: tokens.gray, margin: "0 0 24px" }}>
          For press enquiries, contact our media team directly.
        </p>
        <a href="mailto:press@eventra.co.ke" style={{ background: tokens.orange, color: tokens.white, padding: "14px 32px", borderRadius: "999px", textDecoration: "none", fontFamily: "'Georgia', serif", fontSize: "15px", fontWeight: 700 }}>
          press@eventra.co.ke
        </a>
      </section>
    </div>
  );
}
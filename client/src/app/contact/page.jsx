"use client";
import { useState } from "react";

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

const topics = [
  { icon: "🎟️", title: "Hosting an event", desc: "Questions about creating or managing your event." },
  { icon: "🐛", title: "Report a bug", desc: "Something not working? Let us know." },
  { icon: "💳", title: "Payments & billing", desc: "Questions about tickets, refunds, or payments." },
  { icon: "📰", title: "Press & media", desc: "Interview requests and media enquiries." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ background: tokens.white, minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ background: tokens.deepBlue, padding: "80px max(20px, 5vw)" }}>
        <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "3px", color: tokens.orange, fontWeight: 700, textTransform: "uppercase", margin: "0 0 16px" }}>
          Get in touch
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(36px, 7vw, 64px)", fontWeight: 900, color: tokens.cream, margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-1px" }}>
          We'd love to hear from you.
        </h1>
        <p style={{ fontFamily: "sans-serif", fontSize: "clamp(14px, 2vw, 17px)", color: "rgba(245,240,232,0.6)", maxWidth: "480px", lineHeight: 1.7, margin: 0 }}>
          Whether you have a question, a bug to report, or just want to say hello — we're here.
        </p>
      </section>

      {/* Topics */}
      <section style={{ padding: "64px max(20px, 5vw)", background: tokens.lightGray, borderBottom: `1px solid ${tokens.borderGray}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", maxWidth: "960px", margin: "0 auto" }}>
          {topics.map((t) => (
            <div key={t.title} style={{ background: tokens.white, borderRadius: "16px", padding: "24px", border: `1px solid ${tokens.borderGray}` }}>
              <span style={{ fontSize: "28px" }}>{t.icon}</span>
              <h3 style={{ fontFamily: "'Georgia', serif", fontSize: "17px", fontWeight: 700, color: tokens.black, margin: "12px 0 6px" }}>{t.title}</h3>
              <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: tokens.gray, lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section style={{ padding: "72px max(20px, 5vw)" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "2px", color: "rgba(26,26,26,0.4)", textTransform: "uppercase", margin: "0 0 8px" }}>Contact form</p>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: tokens.black, margin: "0 0 36px", letterSpacing: "-0.5px" }}>
            Send us a message
          </h2>

          {sent ? (
            <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "16px", padding: "40px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
              <h3 style={{ fontFamily: "'Georgia', serif", fontSize: "24px", fontWeight: 700, color: tokens.black, margin: "0 0 8px" }}>Message sent!</h3>
              <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: tokens.gray }}>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "Your name", field: "name", type: "text", placeholder: "Jeremy Rioba" },
                { label: "Email address", field: "email", type: "email", placeholder: "hello@example.com" },
                { label: "Subject", field: "subject", type: "text", placeholder: "What's this about?" },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label style={{ fontFamily: "sans-serif", fontSize: "13px", fontWeight: 600, color: tokens.black, display: "block", marginBottom: "6px" }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    required
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: `1px solid ${tokens.borderGray}`, fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontFamily: "sans-serif", fontSize: "13px", fontWeight: 600, color: tokens.black, display: "block", marginBottom: "6px" }}>Message</label>
                <textarea
                  placeholder="Tell us more..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: `1px solid ${tokens.borderGray}`, fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box", resize: "vertical", outline: "none" }}
                />
              </div>
              <button
                type="submit"
                style={{ background: tokens.orange, color: tokens.white, padding: "14px", borderRadius: "12px", border: "none", fontFamily: "'Georgia', serif", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}
              >
                Send message →
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
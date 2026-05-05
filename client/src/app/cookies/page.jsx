"use client";
import { useState } from "react";

const tokens = {
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
  deepBlue: "#0D1B2A",
  cream: "#F5F0E8",
  gray: "#666666",
  lightGray: "#f7f7f7",
  borderGray: "#e5e5e5",
};

const cookieTypes = [
  {
    name: "Essential Cookies",
    icon: "🔒",
    required: true,
    desc: "These cookies are necessary for the platform to function. They enable core features like authentication, security, and your session. These cannot be disabled.",
    examples: ["Session token", "CSRF protection", "Login state"],
  },
  {
    name: "Analytics Cookies",
    icon: "📊",
    required: false,
    desc: "These help us understand how visitors interact with Eventra, which pages are most visited, and how to improve the experience.",
    examples: ["Page views", "Session duration", "Traffic sources"],
  },
  {
    name: "Preference Cookies",
    icon: "⚙️",
    required: false,
    desc: "These remember your settings and preferences to personalize your experience, such as saved filters and display preferences.",
    examples: ["Category preferences", "Display settings", "Language"],
  },
  {
    name: "Marketing Cookies",
    icon: "📣",
    required: false,
    desc: "These track your activity to help us show you relevant events and promotions. We do not sell this data to third parties.",
    examples: ["Event recommendations", "Retargeting", "Campaign tracking"],
  },
];

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    analytics: true,
    preference: true,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    setPreferences((p) => ({ ...p, [key]: !p[key] }));
    setSaved(false);
  };

  return (
    <div style={{ background: tokens.white, minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ background: tokens.deepBlue, padding: "72px max(20px, 5vw)" }}>
        <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "3px", color: tokens.orange, fontWeight: 700, textTransform: "uppercase", margin: "0 0 12px" }}>Legal</p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, color: tokens.cream, margin: "0 0 16px", letterSpacing: "-1px" }}>
          Cookie Policy
        </h1>
        <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "rgba(245,240,232,0.5)", margin: 0 }}>
          Last updated: January 1, 2026
        </p>
      </section>

      {/* Intro */}
      <section style={{ padding: "64px max(20px, 5vw)", maxWidth: "760px", margin: "0 auto" }}>
        <p style={{ fontFamily: "sans-serif", fontSize: "16px", color: tokens.gray, lineHeight: 1.8, margin: "0 0 24px" }}>
          Eventra uses cookies and similar technologies to give you a better experience. This page explains what cookies we use, why we use them, and how you can control them.
        </p>
        <p style={{ fontFamily: "sans-serif", fontSize: "16px", color: tokens.gray, lineHeight: 1.8, margin: 0 }}>
          A cookie is a small text file stored on your device when you visit a website. Cookies help us remember your preferences and improve performance.
        </p>
      </section>

      {/* Cookie Types */}
      <section style={{ padding: "0 max(20px, 5vw) 72px", maxWidth: "760px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 900, color: tokens.black, margin: "0 0 32px", letterSpacing: "-0.5px" }}>
          Types of cookies we use
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {cookieTypes.map((cookie) => {
            const key = cookie.name.split(" ")[0].toLowerCase();
            const isEnabled = cookie.required || preferences[key];
            return (
              <div key={cookie.name} style={{ background: tokens.lightGray, borderRadius: "16px", padding: "24px", border: `1px solid ${tokens.borderGray}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "24px" }}>{cookie.icon}</span>
                    <h3 style={{ fontFamily: "'Georgia', serif", fontSize: "18px", fontWeight: 700, color: tokens.black, margin: 0 }}>{cookie.name}</h3>
                  </div>
                  {cookie.required ? (
                    <span style={{ fontFamily: "sans-serif", fontSize: "12px", color: tokens.orange, fontWeight: 700, background: "#fff3ef", padding: "4px 10px", borderRadius: "999px", whiteSpace: "nowrap" }}>Required</span>
                  ) : (
                    <button
                      onClick={() => toggle(key)}
                      style={{
                        width: "48px", height: "26px", borderRadius: "999px", border: "none", cursor: "pointer", flexShrink: 0,
                        background: isEnabled ? tokens.orange : "#ccc", transition: "background 0.2s", position: "relative",
                      }}
                    >
                      <div style={{
                        width: "20px", height: "20px", borderRadius: "50%", background: tokens.white,
                        position: "absolute", top: "3px", transition: "left 0.2s",
                        left: isEnabled ? "25px" : "3px",
                      }} />
                    </button>
                  )}
                </div>
                <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: tokens.gray, lineHeight: 1.6, margin: "0 0 12px" }}>{cookie.desc}</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {cookie.examples.map((ex) => (
                    <span key={ex} style={{ fontFamily: "monospace", fontSize: "12px", color: "#888", background: tokens.white, padding: "4px 10px", borderRadius: "6px", border: `1px solid ${tokens.borderGray}` }}>{ex}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Button */}
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <button
            onClick={() => setSaved(true)}
            style={{ background: tokens.orange, color: tokens.white, padding: "14px 36px", borderRadius: "12px", border: "none", fontFamily: "'Georgia', serif", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}
          >
            {saved ? "✅ Preferences saved!" : "Save preferences"}
          </button>
        </div>
      </section>
    </div>
  );
}
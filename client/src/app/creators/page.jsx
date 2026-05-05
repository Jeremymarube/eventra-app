"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

const perks = [
  { icon: "🎟️", title: "Sell tickets instantly", desc: "Set up paid or free events in minutes. M-Pesa and card payments built in." },
  { icon: "📊", title: "Real-time analytics", desc: "Track bookings, revenue, and attendance from your host dashboard." },
  { icon: "📧", title: "Automated emails", desc: "Attendees get tickets, reminders, and QR codes automatically." },
  { icon: "🔍", title: "Get discovered", desc: "Your events appear in browse, categories, and search results." },
  { icon: "📱", title: "QR check-in", desc: "Scan attendee QR codes at the door. No extra hardware needed." },
  { icon: "🤖", title: "AI descriptions", desc: "Generate compelling event descriptions in seconds with Gemini AI." },
];

const steps = [
  { n: "01", title: "Create your account", desc: "Sign up free. No credit card required." },
  { n: "02", title: "Create your first event", desc: "Add title, date, location, and cover image. Takes under 5 minutes." },
  { n: "03", title: "Share & sell", desc: "Share your event link. Tickets sell directly to your attendees." },
  { n: "04", title: "Show up", desc: "Use our QR check-in tool at the door. We handle the rest." },
];

export default function CreatorsPage() {
  const router = useRouter();

  return (
    <div style={{ background: tokens.white, minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{
        background: tokens.deepBlue,
        padding: "80px max(20px, 5vw)",
        textAlign: "center",
      }}>
        <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "3px", color: tokens.orange, fontWeight: 700, textTransform: "uppercase", margin: "0 0 16px" }}>
          For creators & hosts
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(36px, 7vw, 64px)", fontWeight: 900, color: tokens.cream, margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-1px" }}>
          Host events that people<br />actually show up for.
        </h1>
        <p style={{ fontFamily: "sans-serif", fontSize: "clamp(14px, 2vw, 17px)", color: "rgba(245,240,232,0.6)", maxWidth: "560px", margin: "0 auto 40px", lineHeight: 1.7 }}>
          Eventra gives you everything you need to create, promote, and manage events — from intimate gatherings to large festivals.
        </p>
        <button
          onClick={() => router.push("/register")}
          style={{ background: tokens.orange, color: tokens.white, padding: "16px 36px", borderRadius: "999px", border: "none", fontFamily: "'Georgia', serif", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}
        >
          Start hosting free →
        </button>
      </section>

      {/* Perks */}
      <section style={{ padding: "72px max(20px, 5vw)", background: tokens.white }}>
        <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "2px", color: "rgba(26,26,26,0.4)", textTransform: "uppercase", textAlign: "center", margin: "0 0 8px" }}>
          Everything included
        </p>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: tokens.black, textAlign: "center", margin: "0 0 48px", letterSpacing: "-0.5px" }}>
          Built for serious hosts
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", maxWidth: "1000px", margin: "0 auto" }}>
          {perks.map((perk) => (
            <div key={perk.title} style={{ background: tokens.lightGray, borderRadius: "16px", padding: "28px", border: `1px solid ${tokens.borderGray}` }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>{perk.icon}</div>
              <h3 style={{ fontFamily: "'Georgia', serif", fontSize: "18px", fontWeight: 700, color: tokens.black, margin: "0 0 8px" }}>{perk.title}</h3>
              <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: tokens.gray, lineHeight: 1.6, margin: 0 }}>{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "72px max(20px, 5vw)", background: tokens.lightGray, borderTop: `1px solid ${tokens.borderGray}` }}>
        <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "2px", color: "rgba(26,26,26,0.4)", textTransform: "uppercase", textAlign: "center", margin: "0 0 8px" }}>
          How it works
        </p>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: tokens.black, textAlign: "center", margin: "0 0 48px", letterSpacing: "-0.5px" }}>
          From idea to sold out
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px", maxWidth: "960px", margin: "0 auto" }}>
          {steps.map((step) => (
            <div key={step.n} style={{ background: tokens.white, borderRadius: "16px", padding: "28px", border: `1px solid ${tokens.borderGray}` }}>
              <span style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "1px", color: "#aaa" }}>N°{step.n}</span>
              <h3 style={{ fontFamily: "'Georgia', serif", fontSize: "18px", fontWeight: 700, color: tokens.black, margin: "16px 0 8px" }}>{step.title}</h3>
              <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: tokens.gray, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "72px max(20px, 5vw)", background: tokens.deepBlue, textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, color: tokens.cream, margin: "0 0 20px", letterSpacing: "-1px" }}>
          Ready to host your first event?
        </h2>
        <p style={{ fontFamily: "sans-serif", fontSize: "16px", color: "rgba(245,240,232,0.6)", margin: "0 0 36px" }}>
          Free to start. No monthly fees.
        </p>
        <button
          onClick={() => router.push("/register")}
          style={{ background: tokens.orange, color: tokens.white, padding: "16px 36px", borderRadius: "999px", border: "none", fontFamily: "'Georgia', serif", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}
        >
          Create your account →
        </button>
      </section>
    </div>
  );
}
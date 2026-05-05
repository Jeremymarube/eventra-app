"use client";

import { useState } from "react";
import Header from "../../components/Header";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
  dark: "#111",
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const statsCards = [
  { label: "Total Page Views", value: "24,381", change: "+12%", up: true },
  { label: "Avg. Daily Views", value: "812", change: "+5%", up: true },
  { label: "Peak Day Views", value: "2,104", change: "Apr 18", up: null },
  { label: "Events Listed", value: "148", change: "+8 this week", up: true },
  { label: "Registered Users", value: "3,920", change: "+231", up: true },
  { label: "Tickets Booked", value: "1,047", change: "-3%", up: false },
];

// 90-day sparkline mock — generate a plausible curve
function generateChartData(days = 90) {
  const data = [];
  let val = 400;
  for (let i = 0; i < days; i++) {
    val = Math.max(100, Math.min(2200, val + (Math.random() - 0.46) * 180));
    data.push(Math.round(val));
  }
  return data;
}
const chartData90 = generateChartData(90);
const chartData30 = chartData90.slice(-30);
const chartData7 = chartData90.slice(-7);

function AreaChart({ data, color = tokens.orange }) {
  const W = 860;
  const H = 180;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padX = 0;
  const padY = 16;

  const pts = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * (W - padX * 2);
    const y = padY + (1 - (v - min) / range) * (H - padY * 2);
    return [x, y];
  });

  const lineD = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaD = `${lineD} L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#areaGrad)" />
      <path d={lineD} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {/* Y axis labels */}
      {[0, 0.5, 1].map((t) => {
        const val = Math.round(min + t * range);
        const y = padY + (1 - t) * (H - padY * 2);
        return (
          <text key={t} x="4" y={y + 4} fontSize="10" fill="#aaa" fontFamily="sans-serif">
            {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
          </text>
        );
      })}
    </svg>
  );
}

const topEvents = [
  { title: "Sunrise Yoga & Stillness", views: 1204, bookings: 28, revenue: "$420" },
  { title: "Late Night Jazz & Electric", views: 987, bookings: 42, revenue: "$1,050" },
  { title: "Natural Wine 101: A Tasting", views: 876, bookings: 19, revenue: "$855" },
  { title: "The Future of Interfaces", views: 754, bookings: 11, revenue: "$2,189" },
  { title: "Abstract Forms Gallery Night", views: 643, bookings: 33, revenue: "$396" },
];

const recentUsers = [
  { name: "Amara Osei", email: "amara@example.com", joined: "Apr 21", events: 3 },
  { name: "Lucía Reyes", email: "lucia@example.com", joined: "Apr 20", events: 1 },
  { name: "James Park", email: "jpark@example.com", joined: "Apr 20", events: 5 },
  { name: "Nour El-Din", email: "nour@example.com", joined: "Apr 19", events: 2 },
  { name: "Sophie Müller", email: "sophie@example.com", joined: "Apr 18", events: 0 },
];

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState("90d");

  const chartMap = { "7d": chartData7, "30d": chartData30, "90d": chartData90 };
  const activeData = chartMap[range];

  return (
    <div style={{ minHeight: "100vh", background: "#f7f4ef" }}>
      <Header />

      <main style={{ padding: "48px 48px 80px" }}>

        {/* ── Page title ── */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "2px", color: "#999", margin: "0 0 8px", fontWeight: 600 }}>
            ADMIN
          </p>
          <h1
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "42px",
              fontWeight: 900,
              color: tokens.black,
              margin: 0,
              letterSpacing: "-1.5px",
            }}
          >
            Analytics
          </h1>
        </div>

        {/* ── Stat cards ── */}
        <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
          {statsCards.map((s) => (
            <div
              key={s.label}
              style={{
                background: tokens.white,
                borderRadius: "16px",
                padding: "24px 28px",
                border: "1px solid #e8e3db",
              }}
            >
              <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "1.5px", color: "#aaa", margin: "0 0 12px", fontWeight: 600 }}>
                {s.label.toUpperCase()}
              </p>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: "36px",
                    fontWeight: 900,
                    color: tokens.black,
                    letterSpacing: "-1px",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: s.up === true ? "#2d9e5f" : s.up === false ? "#d94040" : "#aaa",
                    marginBottom: "4px",
                  }}
                >
                  {s.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Area chart ── */}
        <div
          style={{
            background: tokens.white,
            borderRadius: "20px",
            border: "1px solid #e8e3db",
            padding: "28px 32px",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "1.5px", color: "#aaa", margin: "0 0 4px", fontWeight: 600 }}>
                ABOUT PAGE VIEWS
              </p>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "20px", fontWeight: 900, color: tokens.black, margin: 0, letterSpacing: "-0.5px" }}>
                Daily traffic overview
              </h2>
            </div>
            {/* Range toggle */}
            <div style={{ display: "flex", gap: "8px" }}>
              {["7d", "30d", "90d"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  style={{
                    background: range === r ? tokens.black : "none",
                    color: range === r ? tokens.white : tokens.black,
                    border: `1px solid ${range === r ? tokens.black : "#d8d3cb"}`,
                    borderRadius: "999px",
                    padding: "7px 18px",
                    fontFamily: "sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: "180px" }}>
            <AreaChart data={activeData} />
          </div>

          {/* X axis labels */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            {["Start", "", "", "", "", "", "Now"].map((l, i) => (
              <span key={i} style={{ fontFamily: "sans-serif", fontSize: "10px", color: "#bbb" }}>{l}</span>
            ))}
          </div>
        </div>

        {/* ── Bottom two-col ── */}
        <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>

          {/* Top events table */}
          <div
            style={{
              background: tokens.white,
              borderRadius: "20px",
              border: "1px solid #e8e3db",
              padding: "28px 32px",
            }}
          >
            <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "1.5px", color: "#aaa", margin: "0 0 6px", fontWeight: 600 }}>
              TOP EVENTS
            </p>
            <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "18px", fontWeight: 900, color: tokens.black, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
              By views this month
            </h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Event", "Views", "Bookings", "Revenue"].map((h) => (
                    <th
                      key={h}
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: "10px",
                        letterSpacing: "1px",
                        color: "#bbb",
                        fontWeight: 600,
                        textAlign: h === "Event" ? "left" : "right",
                        paddingBottom: "12px",
                        borderBottom: "1px solid #f0ebe3",
                      }}
                    >
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topEvents.map((e, i) => (
                  <tr key={i}>
                    <td
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: "13px",
                        color: tokens.black,
                        fontWeight: 600,
                        padding: "12px 0",
                        borderBottom: i < topEvents.length - 1 ? "1px solid #f8f5f0" : "none",
                        maxWidth: "160px",
                      }}
                    >
                      {e.title}
                    </td>
                    <td style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#666", textAlign: "right", padding: "12px 0", borderBottom: i < topEvents.length - 1 ? "1px solid #f8f5f0" : "none" }}>
                      {e.views.toLocaleString()}
                    </td>
                    <td style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#666", textAlign: "right", padding: "12px 0", borderBottom: i < topEvents.length - 1 ? "1px solid #f8f5f0" : "none" }}>
                      {e.bookings}
                    </td>
                    <td style={{ fontFamily: "'Georgia', serif", fontSize: "13px", fontWeight: 700, color: tokens.black, textAlign: "right", padding: "12px 0", borderBottom: i < topEvents.length - 1 ? "1px solid #f8f5f0" : "none" }}>
                      {e.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent users */}
          <div
            style={{
              background: tokens.white,
              borderRadius: "20px",
              border: "1px solid #e8e3db",
              padding: "28px 32px",
            }}
          >
            <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "1.5px", color: "#aaa", margin: "0 0 6px", fontWeight: 600 }}>
              RECENT SIGN-UPS
            </p>
            <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "18px", fontWeight: 900, color: tokens.black, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
              New users this week
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {recentUsers.map((u, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 0",
                    borderBottom: i < recentUsers.length - 1 ? "1px solid #f8f5f0" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {/* Avatar initial */}
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: `hsl(${(i * 67) % 360}, 55%, 88%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Georgia', serif",
                        fontSize: "14px",
                        fontWeight: 900,
                        color: tokens.black,
                        flexShrink: 0,
                      }}
                    >
                      {u.name[0]}
                    </div>
                    <div>
                      <div style={{ fontFamily: "sans-serif", fontSize: "13px", fontWeight: 700, color: tokens.black }}>
                        {u.name}
                      </div>
                      <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: "#aaa" }}>{u.email}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#888" }}>{u.joined}</div>
                    <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: "#bbb" }}>
                      {u.events} event{u.events !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

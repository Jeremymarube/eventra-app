"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import {
  Calendar,
  Plus,
  Ticket,
  Heart,
  Compass,
  User as UserIcon,
  ArrowRight,
  MapPin,
} from "lucide-react";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
  darkBg: "#1a1008",
  lightGray: "#f8f7f5",
  borderColor: "#e8e3db",
  muted: "#999",
  card: "#ffffff",
};

// Use real backend data for upcoming bookings and saved events
const MOCK_UPCOMING = [];
const MOCK_SAVED = [];

const CATEGORY_LABELS = {
  music: "Music",
  tech: "Tech",
  "food-drink": "Food & Drink",
  art: "Art",
  sports: "Sports",
  business: "Business",
  wellness: "Wellness",
  community: "Community",
  nightlife: "Nightlife",
  other: "Other",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatEventDate(isoString) {
  const d = new Date(isoString);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.getDate(),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DateHeader() {
  const [date, setDate] = useState("");
  useEffect(() => {
    const today = new Date();
    setDate(
      today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );
  }, []);
  return (
    <div
      style={{
        padding: "16px 48px",
        background: tokens.white,
        borderBottom: `1px solid ${tokens.borderColor}`,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "sans-serif",
          fontSize: "11px",
          color: tokens.muted,
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        {date}
      </p>
    </div>
  );
}

function WelcomeSection({ userName = "Jeremy" }) {
  const router = useRouter();

  const quickTiles = [
    { href: "/host/new", icon: Plus, label: "Host", hint: "Create an event" },
    { href: "/tickets", icon: Ticket, label: "My tickets", hint: "View & manage" },
    { href: "/saved", icon: Heart, label: "Saved", hint: "Your shortlist" },
    { href: "/browse", icon: Compass, label: "Browse", hint: "Find what's on" },
    { href: "/profile", icon: UserIcon, label: "Profile", hint: "Edit details" },
  ];

  return (
    <div
      className="responsive-grid"
      style={{
        padding: "48px 48px 40px",
        background: tokens.white,
        borderBottom: `1px solid ${tokens.borderColor}`,
      }}
    >
      {/* Greeting row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              color: tokens.black,
              margin: "0 0 12px",
              lineHeight: 1,
              letterSpacing: "-1.5px",
            }}
          >
            Welcome back,{' '}
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 300,
                color: tokens.orange,
              }}
            >
              {userName}
            </em>
            .
          </h1>
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "15px",
              color: tokens.muted,
              margin: 0,
              maxWidth: "420px",
            }}
          >
            Here&apos;s what&apos;s next on your calendar — and a few things you&apos;ve been eyeing.
          </p>
        </div>

        <button
          onClick={() => router.push("/browse")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: tokens.black,
            color: tokens.white,
            padding: "12px 24px",
            borderRadius: "999px",
            border: "none",
            fontFamily: "sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Discover events
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Quick tiles */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
        }}
      >
        {quickTiles.map(({ href, icon: Icon, label, hint }) => (
          <Link key={href} href={href} style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "18px 20px",
                background: tokens.lightGray,
                border: `1px solid ${tokens.borderColor}`,
                borderRadius: "16px",
                cursor: "pointer",
                transition: "all 0.2s",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: "#e8e3db",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}
              >
                <Icon size={18} color={tokens.black} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: "16px",
                    fontWeight: 700,
                    color: tokens.black,
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: "12px",
                    color: tokens.muted,
                    margin: "2px 0 0",
                  }}
                >
                  {hint}
                </p>
              </div>
              <ArrowRight size={14} color={tokens.muted} style={{ flexShrink: 0 }} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, body, ctaLabel, ctaHref }) {
  const router = useRouter();
  return (
    <div
      style={{
        borderRadius: "16px",
        border: `2px dashed ${tokens.borderColor}`,
        background: tokens.lightGray,
        padding: "56px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "#e8e3db",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <Icon size={20} color={tokens.muted} />
      </div>
      <p
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: "20px",
          fontWeight: 700,
          color: tokens.black,
          margin: "0 0 8px",
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontFamily: "sans-serif",
          fontSize: "14px",
          color: tokens.muted,
          margin: "0 0 24px",
        }}
      >
        {body}
      </p>
      <button
        onClick={() => router.push(ctaHref)}
        style={{
          background: "none",
          border: `1px solid ${tokens.borderColor}`,
          borderRadius: "999px",
          padding: "10px 24px",
          fontFamily: "sans-serif",
          fontSize: "14px",
          color: tokens.black,
          cursor: "pointer",
        }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

function UpNextSection() {
  const router = useRouter();
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/bookings', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setUpcoming(data);
        }
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      }
    };
    fetchUpcoming();
  }, []);

  return (
      <section
      className="responsive-grid"
      style={{
        padding: "56px 48px",
        background: tokens.white,
        borderBottom: `1px solid ${tokens.borderColor}`,
      }}
      >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "28px",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "11px",
              letterSpacing: "2px",
              color: tokens.muted,
              margin: "0 0 8px",
              textTransform: "uppercase",
            }}
          >
            Up next
          </p>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "28px",
              fontWeight: 900,
              color: tokens.black,
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            Your upcoming events
          </h2>
        </div>
        {upcoming.length > 0 && (
          <button
            onClick={() => router.push("/tickets")}
            style={{
              background: "none",
              border: "none",
              fontFamily: "sans-serif",
              fontSize: "13px",
              color: tokens.orange,
              cursor: "pointer",
              fontWeight: 600,
              padding: 0,
            }}
          >
            All tickets →
          </button>
        )}
      </div>

      {upcoming.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No upcoming tickets"
          body="When you book an event, it'll show up here."
          ctaLabel="Browse events"
          ctaHref="/browse"
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {upcoming.map((booking) => {
            // support different API shapes: booking.events, booking.event, or booking as event
            const ev = booking.events || booking.event || booking;
            if (!ev || !ev.starts_at) return null;
            const d = formatEventDate(ev.starts_at);
            return (
              <Link
                key={booking.id || ev.id || ev.event_id}
                href={`/event/${ev.id || booking.event_id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    padding: "16px",
                    borderRadius: "16px",
                    border: `1px solid ${tokens.borderColor}`,
                    background: tokens.card,
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = tokens.orange;
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = tokens.borderColor;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Date block */}
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      flexShrink: 0,
                      borderRadius: "12px",
                      background: tokens.black,
                      color: tokens.white,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "9px",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        opacity: 0.7,
                      }}
                    >
                      {d.month}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Georgia', serif",
                        fontSize: "28px",
                        fontWeight: 900,
                        lineHeight: 1,
                      }}
                    >
                      {d.day}
                    </span>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "9px",
                        opacity: 0.7,
                        marginTop: "2px",
                      }}
                    >
                      {d.time}
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p
                      style={{
                        fontFamily: "monospace",
                        fontSize: "10px",
                        color: tokens.muted,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        margin: "0 0 4px",
                      }}
                    >
                      {booking.quantity || 1} ticket{(booking.quantity || 1) > 1 ? "s" : ""} ·{" "}
                      {booking.reference_code || ''}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Georgia', serif",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: tokens.black,
                        margin: "0 0 8px",
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {ev.title}
                    </p>
                    {ev.location_name && (
                      <p
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontFamily: "sans-serif",
                          fontSize: "12px",
                          color: tokens.muted,
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <MapPin size={11} style={{ flexShrink: 0 }} />
                        {ev.location_name}
                      </p>
                    )}
                  </div>
                  {/* Actions column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = '/tickets';
                      }}
                      style={{
                        background: tokens.orange,
                        color: tokens.white,
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 700,
                      }}
                    >
                      View ticket
                    </button>

                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const url = `${window.location.origin}/event/${ev.id}`;
                        try {
                          if (navigator.share) {
                            await navigator.share({ title: ev.title, url });
                          } else {
                            await navigator.clipboard.writeText(url);
                            alert('Link copied to clipboard');
                          }
                        } catch (err) {
                          console.error(err);
                          alert('Could not share');
                        }
                      }}
                      style={{
                        background: 'none',
                        border: `1px solid ${tokens.borderColor}`,
                        padding: '6px 10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      ↗ Share
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

function SavedSection() {
  const router = useRouter();
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/saved-events', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          // backend returns array of { id, event, saved_at }
          setSaved(data.map((s) => ({ events: s.event, event_id: s.id })));
        }
      } catch (err) {
        console.error('Failed to fetch saved events', err);
      }
    };
    fetchSaved();
  }, []);

  if (saved.length === 0) return null;

  return (
      <section
        className="responsive-grid"
        style={{
          padding: "56px 48px",
          background: tokens.white,
          borderBottom: `1px solid ${tokens.borderColor}`,
        }}
      >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "28px",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "11px",
              letterSpacing: "2px",
              color: tokens.muted,
              margin: "0 0 8px",
              textTransform: "uppercase",
            }}
          >
            From your shortlist
          </p>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "28px",
              fontWeight: 900,
              color: tokens.black,
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            Saved for later
          </h2>
        </div>
        <button
          onClick={() => router.push("/saved")}
          style={{
            background: "none",
            border: "none",
            fontFamily: "sans-serif",
            fontSize: "13px",
            color: tokens.orange,
            cursor: "pointer",
            fontWeight: 600,
            padding: 0,
          }}
        >
          View all →
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {saved.map((item) => {
          const ev = item.events;
          const d = formatEventDate(ev.starts_at);
          return (
            <Link
              key={item.event_id}
              href={`/event/${ev.id}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                  aspectRatio: "4/5",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <img
                  src={ev.cover_image_url}
                  alt={ev.title}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {/* Gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(26,26,26,0.7) 0%, transparent 55%)",
                  }}
                />
                {/* Text */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "12px",
                    right: "12px",
                    color: tokens.white,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: "9px",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      opacity: 0.85,
                      margin: "0 0 4px",
                    }}
                  >
                    {d.month} {d.day} · {CATEGORY_LABELS[ev.category] || ev.category}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: "15px",
                      fontWeight: 600,
                      margin: 0,
                      lineHeight: 1.3,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {ev.title}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function DepartmentsSection() {
  const router = useRouter();
  const categories = [
    { n: "01", label: "Music", slug: "music" },
    { n: "02", label: "Tech", slug: "tech" },
    { n: "03", label: "Food & Drink", slug: "food-drink" },
    { n: "04", label: "Art", slug: "art" },
    { n: "05", label: "Sports", slug: "sports" },
    { n: "06", label: "Business", slug: "business" },
    { n: "07", label: "Wellness", slug: "wellness" },
    { n: "08", label: "Community", slug: "community" },
    { n: "09", label: "Nightlife", slug: "nightlife" },
    { n: "10", label: "Other", slug: "other" },
  ];

  return (
    <section
      className="responsive-grid"
      style={{
        padding: "56px 48px",
        background: tokens.lightGray,
        borderTop: `1px solid ${tokens.borderColor}`,
      }}
    >
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
              color: tokens.muted,
              margin: "0 0 8px",
              textTransform: "uppercase",
            }}
          >
            Departments
          </p>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "28px",
              fontWeight: 900,
              margin: 0,
              color: tokens.black,
              letterSpacing: "-0.5px",
            }}
          >
            Browse by category
          </h2>
        </div>
        <button
          onClick={() => router.push("/categories")}
          style={{
            background: "none",
            border: "none",
            fontFamily: "sans-serif",
            fontSize: "13px",
            color: tokens.orange,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          See all →
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "12px",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.n}
            onClick={() => router.push(`/browse?category=${cat.slug}`)}
            style={{
              background: tokens.white,
              borderRadius: "16px",
              padding: "20px",
              color: tokens.black,
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              border: `1px solid ${tokens.borderColor}`,
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                letterSpacing: "1px",
                color: "#aaa",
              }}
            >
              N°{cat.n}
            </span>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "17px",
                  fontWeight: 700,
                }}
              >
                {cat.label}
              </span>
              <span style={{ fontSize: "14px" }}>→</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function FeaturedEventSection() {
  const router = useRouter();

  return (
    <section
      className="responsive-grid"
      style={{
        background: tokens.lightGray,
        borderTop: `1px solid ${tokens.borderColor}`,
        display: "grid",
        gridTemplateColumns: "40% 60%",
        minHeight: "360px",
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
        alt="Featured event"
        style={{ width: "100%", height: "100%", objectFit: "cover", maxHeight: "360px" }}
      />
      <div
        style={{
          padding: "72px 60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "11px",
            letterSpacing: "2px",
            color: tokens.orange,
            margin: "0 0 16px",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          Editor&apos;s pick
        </p>
        <h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 900,
            color: tokens.black,
            margin: "0 0 20px",
            lineHeight: 1.1,
            letterSpacing: "-1px",
          }}
        >
          Founders Breakfast: Building in Public
        </h2>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              background: "#e8e3db",
              borderRadius: "999px",
              padding: "6px 14px",
              fontFamily: "sans-serif",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            Business
          </span>
          <span style={{ color: "#aaa", fontSize: "13px" }}>•</span>
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: "13px",
              color: "#666",
            }}
          >
            Thursday, May 10
          </span>
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
          Step into a curated experience selected by our editors this week. Tap
          through to see full details, location, and how to attend.
        </p>
        <button
          onClick={() => router.push("/event/1")}
          style={{
            background: tokens.orange,
            color: tokens.white,
            padding: "14px 28px",
            borderRadius: "999px",
            fontFamily: "'Georgia', serif",
            fontSize: "15px",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          View event
        </button>
      </div>
    </section>
  );
}

function ThisWeekSection() {
  const router = useRouter();
  const eventCards = [
    {
      id: 3,
      month: "MAY",
      day: "3",
      tag: "MUSIC",
      img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
      title: "Vinyl Listening Club: Side A",
    },
    {
      id: 4,
      month: "MAY",
      day: "4",
      tag: "TECH",
      img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80",
      title: "The Future of Interfaces — A Conference",
    },
    {
      id: 5,
      month: "MAY",
      day: "6",
      tag: "FOOD & DRINK",
      img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
      title: "Natural Wine 101: A Tasting",
    },
  ];

  return (
    <section
      className="responsive-grid"
      style={{
        background: tokens.lightGray,
        padding: "56px 48px",
        borderTop: `1px solid ${tokens.borderColor}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "32px",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "11px",
              letterSpacing: "2px",
              color: tokens.muted,
              margin: "0 0 8px",
              textTransform: "uppercase",
            }}
          >
            This week
          </p>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "28px",
              fontWeight: 900,
              margin: 0,
              color: tokens.black,
              letterSpacing: "-0.5px",
            }}
          >
            Don&apos;t miss out
          </h2>
        </div>
        <button
          onClick={() => router.push("/browse")}
          style={{
            background: "none",
            fontFamily: "sans-serif",
            fontSize: "13px",
            color: tokens.black,
            cursor: "pointer",
            border: `1px solid #ccc`,
            padding: "10px 20px",
            borderRadius: "999px",
          }}
        >
          Browse all events
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {eventCards.map((card) => (
          <button
            key={card.id}
            onClick={() => router.push(`/event/${card.id}`)}
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              color: tokens.black,
              position: "relative",
              display: "block",
              aspectRatio: "4/3",
              border: "none",
              cursor: "pointer",
              padding: 0,
              width: "100%",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
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
              <div
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "22px",
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
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
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function SignedInHome({ userName = "Jeremy" }) {
  return (
    <div style={{ minHeight: "100vh", background: tokens.white }}>
      {/* <Header /> */}
      <DateHeader />
      <main>
        <WelcomeSection userName={userName} />
        <UpNextSection />
        <SavedSection />
        <FeaturedEventSection />
        <ThisWeekSection />
      </main>
      <Footer />
    </div>
  );
}
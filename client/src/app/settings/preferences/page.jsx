"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Monitor, Sun, Moon, Smartphone, Bell, Calendar, Users, Megaphone, Star, Check } from "lucide-react";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
  lightGray: "#f8f7f5",
  borderColor: "#e8e3db",
  muted: "#999",
};

// ─── Default preferences ──────────────────────────────────────────────────────
const defaultPrefs = {
  display: "system",
  language: "en",
  notifications: {
    // Events you attend
    eventInvites: { email: true, whatsapp: false },
    eventReminders: { email: true, whatsapp: false },
    eventBlasts: { email: true, whatsapp: false },
    eventUpdates: { email: true, whatsapp: false },
    feedbackRequests: { email: false, whatsapp: false },
    // Events you host
    guestRegistrations: { email: true, whatsapp: false },
    feedbackResponses: { email: false, whatsapp: false },
    // Luma
    productUpdates: { email: false, whatsapp: false },
  },
};

const DISPLAY_OPTIONS = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "sw", label: "Swahili" },
];

// ─── Notification rows config ─────────────────────────────────────────────────
const ATTEND_ROWS = [
  { key: "eventInvites", label: "Event Invites" },
  { key: "eventReminders", label: "Event Reminders" },
  { key: "eventBlasts", label: "Event Blasts" },
  { key: "eventUpdates", label: "Event Updates" },
  { key: "feedbackRequests", label: "Feedback Requests" },
];

const HOST_ROWS = [
  { key: "guestRegistrations", label: "Guest Registrations" },
  { key: "feedbackResponses", label: "Feedback Responses" },
];

const LUMA_ROWS = [
  { key: "productUpdates", label: "Product Updates" },
];

export default function PreferencesPage() {
  const router = useRouter();
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("userPreferences");
    if (stored) {
      try {
        setPrefs(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading preferences", e);
      }
    }
  }, []);

  const save = (updated) => {
    setPrefs(updated);
    localStorage.setItem("userPreferences", JSON.stringify(updated));
    setSavedMessage("Preferences saved!");
    setTimeout(() => setSavedMessage(""), 2500);
  };

  const setDisplay = (val) => save({ ...prefs, display: val });
  const setLanguage = (val) => save({ ...prefs, language: val });

  const toggleNotif = (key, channel) => {
    const updated = {
      ...prefs,
      notifications: {
        ...prefs.notifications,
        [key]: {
          ...prefs.notifications[key],
          [channel]: !prefs.notifications[key][channel],
        },
      },
    };
    save(updated);
  };

  return (
    <div style={{ minHeight: "100vh", background: tokens.white }}>
      <main style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Page header */}
        <div style={{ marginBottom: "48px" }}>
          <p style={{
            fontFamily: "sans-serif",
            fontSize: "11px",
            letterSpacing: "2px",
            color: tokens.muted,
            margin: "0 0 8px",
            textTransform: "uppercase",
          }}>
            Settings
          </p>
          <h1 style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 900,
            color: tokens.black,
            margin: "0 0 12px",
            letterSpacing: "-1px",
          }}>
            Preferences
          </h1>
          <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: tokens.muted, margin: 0 }}>
            Customise how Eventra looks and notifies you.
          </p>
        </div>

        {/* Saved toast */}
        {savedMessage && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#e8f5e9",
            border: "1px solid #4caf50",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "24px",
            fontFamily: "sans-serif",
            fontSize: "14px",
            color: "#2e7d32",
          }}>
            <Check size={16} />
            {savedMessage}
          </div>
        )}

        {/* ── DISPLAY ─────────────────────────────────────────────────── */}
        <Section title="Display" description="Choose your desired Eventra interface.">
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {DISPLAY_OPTIONS.map(({ value, label, icon: Icon }) => {
              const active = prefs.display === value;
              return (
                <button
                  key={value}
                  onClick={() => setDisplay(value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 20px",
                    borderRadius: "10px",
                    border: active ? `2px solid ${tokens.black}` : `1px solid ${tokens.borderColor}`,
                    background: active ? tokens.black : tokens.white,
                    color: active ? tokens.white : tokens.black,
                    fontFamily: "sans-serif",
                    fontSize: "14px",
                    fontWeight: active ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <Icon size={16} />
                  {label}
                </button>
              );
            })}
          </div>
        </Section>

        <Divider />

        {/* ── LANGUAGE ────────────────────────────────────────────────── */}
        <Section title="Language" description="Choose your preferred language.">
          <select
            value={prefs.language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              border: `1px solid ${tokens.borderColor}`,
              fontFamily: "sans-serif",
              fontSize: "14px",
              color: tokens.black,
              background: tokens.lightGray,
              cursor: "pointer",
              outline: "none",
              minWidth: "200px",
            }}
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </Section>

        <Divider />

        {/* ── NOTIFICATIONS ───────────────────────────────────────────── */}
        <Section
          title="Notifications"
          description="Choose how you'd like to be notified about updates, invites and events."
          icon={<Bell size={20} color={tokens.orange} />}
        >

          {/* Get the app banner */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            padding: "16px 20px",
            borderRadius: "12px",
            background: tokens.lightGray,
            border: `1px solid ${tokens.borderColor}`,
            marginBottom: "32px",
            flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: tokens.black,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <Smartphone size={18} color={tokens.white} />
              </div>
              <div>
                <p style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: 600, color: tokens.black, margin: "0 0 2px" }}>
                  Get the Eventra App
                </p>
                <p style={{ fontFamily: "sans-serif", fontSize: "12px", color: tokens.muted, margin: 0 }}>
                  Stay in the know and receive push notifications.
                </p>
              </div>
            </div>
            <button style={{
              padding: "10px 20px",
              borderRadius: "999px",
              border: `1px solid ${tokens.borderColor}`,
              background: tokens.white,
              fontFamily: "sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: tokens.black,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}>
              Get the App
            </button>
          </div>

          {/* Notification groups */}
          <NotifGroup
            icon={<Calendar size={16} />}
            title="Events You Attend"
            rows={ATTEND_ROWS}
            notifications={prefs.notifications}
            onToggle={toggleNotif}
          />

          <NotifGroup
            icon={<Star size={16} />}
            title="Events You Host"
            rows={HOST_ROWS}
            notifications={prefs.notifications}
            onToggle={toggleNotif}
          />

          <NotifGroup
            icon={<Megaphone size={16} />}
            title="Eventra"
            rows={LUMA_ROWS}
            notifications={prefs.notifications}
            onToggle={toggleNotif}
          />
        </Section>

        <Divider />

        {/* ── SUBSCRIPTIONS ───────────────────────────────────────────── */}
        <Section
          title="Your Subscriptions"
          description="Manage the pages and calendars you follow."
          icon={<Users size={20} color={tokens.orange} />}
        >
          <div style={{ display: "grid", gap: "12px" }}>
            <SubscriptionRow label="Discovery Pages" count={0} />
            <SubscriptionRow label="Calendars" count={0} />
          </div>
        </Section>

      </main>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, description, icon, children }) {
  return (
    <div style={{ padding: "32px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
        {icon}
        <h2 style={{
          fontFamily: "'Georgia', serif",
          fontSize: "20px",
          fontWeight: 700,
          color: tokens.black,
          margin: 0,
        }}>
          {title}
        </h2>
      </div>
      <p style={{
        fontFamily: "sans-serif",
        fontSize: "13px",
        color: tokens.muted,
        margin: "0 0 24px",
      }}>
        {description}
      </p>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: tokens.borderColor }} />;
}

// ─── Notification group ───────────────────────────────────────────────────────
function NotifGroup({ icon, title, rows, notifications, onToggle }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
        <span style={{ color: tokens.muted }}>{icon}</span>
        <p style={{
          fontFamily: "sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: tokens.muted,
          margin: 0,
        }}>
          {title}
        </p>
      </div>

      {/* Column headers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 80px 100px",
        gap: "8px",
        padding: "8px 0",
        borderBottom: `1px solid ${tokens.borderColor}`,
        marginBottom: "4px",
      }}>
        <span />
        <span style={{ fontFamily: "sans-serif", fontSize: "11px", color: tokens.muted, textAlign: "center", letterSpacing: "1px", textTransform: "uppercase" }}>Email</span>
        <span style={{ fontFamily: "sans-serif", fontSize: "11px", color: tokens.muted, textAlign: "center", letterSpacing: "1px", textTransform: "uppercase" }}>WhatsApp</span>
      </div>

      {rows.map(({ key, label }) => (
        <div key={key} style={{
          display: "grid",
          gridTemplateColumns: "1fr 80px 100px",
          gap: "8px",
          alignItems: "center",
          padding: "14px 0",
          borderBottom: `1px solid ${tokens.borderColor}`,
        }}>
          <span style={{ fontFamily: "sans-serif", fontSize: "14px", color: tokens.black }}>
            {label}
          </span>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Toggle
              checked={notifications[key]?.email}
              onChange={() => onToggle(key, "email")}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Toggle
              checked={notifications[key]?.whatsapp}
              onChange={() => onToggle(key, "whatsapp")}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: "40px",
        height: "22px",
        borderRadius: "11px",
        background: checked ? tokens.orange : "#d8d3cb",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.25s",
        flexShrink: 0,
        padding: 0,
      }}
    >
      <div style={{
        position: "absolute",
        top: "2px",
        left: checked ? "20px" : "2px",
        width: "18px",
        height: "18px",
        borderRadius: "50%",
        background: tokens.white,
        transition: "left 0.25s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
      }} />
    </button>
  );
}

// ─── Subscription row ─────────────────────────────────────────────────────────
function SubscriptionRow({ label, count }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 20px",
      borderRadius: "10px",
      border: `1px solid ${tokens.borderColor}`,
      background: tokens.lightGray,
    }}>
      <span style={{ fontFamily: "sans-serif", fontSize: "14px", color: tokens.black, fontWeight: 500 }}>
        {label}
      </span>
      <span style={{
        fontFamily: "monospace",
        fontSize: "13px",
        color: count === 0 ? tokens.muted : tokens.orange,
        fontWeight: 600,
      }}>
        {count} {count === 1 ? label.slice(0, -1) : label}
      </span>
    </div>
  );
}
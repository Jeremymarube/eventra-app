"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Mail, Lock, Eye, Trash2, Check, SlidersHorizontal } from "lucide-react";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
  lightGray: "#f8f7f5",
  borderColor: "#e8e3db",
  danger: "#d32f2f",
};

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState("");

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    eventReminders: true,
    weeklyDigest: true,
    privateProfile: false,
    allowMessages: true,
    twoFactorEnabled: false,
    marketingEmails: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (e) {
      console.error("Error parsing user data", e);
      router.push("/login");
      return;
    }

    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Error loading settings", e);
      }
    }

    setLoading(false);
  }, [router]);

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    localStorage.setItem("userSettings", JSON.stringify(newSettings));
    showSavedMessage();
  };

  const handleSave = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    showSavedMessage();
  };

  const showSavedMessage = () => {
    setSavedMessage("Settings saved successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userSettings");
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: tokens.white }}>
        <div style={{ padding: "48px" }}>
          <p style={{ fontFamily: "sans-serif", color: "#999" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: tokens.white }}>
      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Page Header */}
        <div style={{ marginBottom: "48px" }}>
          <h1
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 900,
              color: tokens.black,
              margin: "0 0 16px",
              letterSpacing: "-1px",
            }}
          >
            Settings
          </h1>
          <p style={{ fontFamily: "sans-serif", fontSize: "16px", color: "#999", margin: 0 }}>
            Manage your account preferences and privacy
          </p>
        </div>

        {/* Success Message */}
        {savedMessage && (
          <div
            style={{
              background: "#e8f5e9",
              border: "1px solid #4caf50",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "sans-serif",
              fontSize: "14px",
              color: "#2e7d32",
            }}
          >
            <Check size={18} />
            {savedMessage}
          </div>
        )}

        {/* Settings Sections */}
        <div style={{ display: "grid", gap: "32px" }}>

          {/* ── Preferences Section ── */}
          <SettingsSection
            icon={<SlidersHorizontal size={24} />}
            title="Preferences"
            description="Display, language and notification settings"
          >
            <NavRow
              label="Display, Language & Notifications"
              hint="Customise how Eventra looks and notifies you"
              onClick={() => router.push("/settings/preferences")}
            />
          </SettingsSection>

          {/* ── Notifications Section ── */}
          <SettingsSection
            icon={<Bell size={24} />}
            title="Notifications"
            description="Control how you receive updates about events"
          >
            <SettingToggle
              label="Email Notifications"
              description="Get notified about events you're interested in"
              checked={settings.emailNotifications}
              onChange={() => handleToggle("emailNotifications")}
            />
            <SettingToggle
              label="Push Notifications"
              description="Receive push notifications on your device"
              checked={settings.pushNotifications}
              onChange={() => handleToggle("pushNotifications")}
            />
            <SettingToggle
              label="Event Reminders"
              description="Get reminders before events you've booked"
              checked={settings.eventReminders}
              onChange={() => handleToggle("eventReminders")}
            />
            <SettingToggle
              label="Weekly Digest"
              description="Receive a weekly summary of new events"
              checked={settings.weeklyDigest}
              onChange={() => handleToggle("weeklyDigest")}
            />
          </SettingsSection>

          {/* ── Email Preferences Section ── */}
          <SettingsSection
            icon={<Mail size={24} />}
            title="Email Preferences"
            description="Choose what emails you want to receive"
          >
            <SettingToggle
              label="Marketing Emails"
              description="Promotional content and special offers"
              checked={settings.marketingEmails}
              onChange={() => handleToggle("marketingEmails")}
            />
            <div style={{ marginTop: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "8px",
                  color: tokens.black,
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: `1px solid ${tokens.borderColor}`,
                  borderRadius: "8px",
                  fontFamily: "sans-serif",
                  fontSize: "14px",
                  background: tokens.lightGray,
                  color: "#999",
                  cursor: "not-allowed",
                  boxSizing: "border-box",
                }}
              />
              <p style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#999", marginTop: "8px" }}>
                Contact support to change your email address
              </p>
            </div>
          </SettingsSection>

          {/* ── Privacy Section ── */}
          <SettingsSection
            icon={<Eye size={24} />}
            title="Privacy"
            description="Control who can see your profile and events"
          >
            <SettingToggle
              label="Private Profile"
              description="Only you can see your saved events and profile details"
              checked={settings.privateProfile}
              onChange={() => handleToggle("privateProfile")}
            />
            <SettingToggle
              label="Allow Messages"
              description="Let other users send you messages about events"
              checked={settings.allowMessages}
              onChange={() => handleToggle("allowMessages")}
            />
          </SettingsSection>

          {/* ── Security Section ── */}
          <SettingsSection
            icon={<Lock size={24} />}
            title="Security"
            description="Manage your account security settings"
          >
            <div style={{ marginBottom: "24px" }}>
              <NavRow
                label="Change Password"
                hint="Update your password regularly for better security"
                onClick={() => alert("Password change feature coming soon!")}
              />
            </div>
            <SettingToggle
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              checked={settings.twoFactorEnabled}
              onChange={() => handleToggle("twoFactorEnabled")}
            />
          </SettingsSection>

          {/* ── Danger Zone ── */}
          <SettingsSection
            icon={<Trash2 size={24} />}
            title="Danger Zone"
            description="Irreversible and destructive actions"
            isDanger
          >
            <button
              onClick={handleDeleteAccount}
              style={{
                width: "100%",
                padding: "16px",
                background: tokens.danger,
                border: "none",
                borderRadius: "8px",
                color: tokens.white,
                fontFamily: "sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Delete Account
            </button>
            <p style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#999", marginTop: "12px", textAlign: "center" }}>
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </SettingsSection>

          {/* ── Save / Cancel ── */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handleSave}
              style={{
                padding: "12px 28px",
                background: tokens.black,
                color: tokens.white,
                border: "none",
                borderRadius: "8px",
                fontFamily: "'Georgia', serif",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Save Changes
            </button>
            <button
              onClick={() => router.back()}
              style={{
                padding: "12px 28px",
                background: tokens.lightGray,
                color: tokens.black,
                border: `1px solid ${tokens.borderColor}`,
                borderRadius: "8px",
                fontFamily: "'Georgia', serif",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = tokens.borderColor)}
              onMouseLeave={(e) => (e.currentTarget.style.background = tokens.lightGray)}
            >
              Cancel
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

// ─── Reusable nav row (arrow button) ─────────────────────────────────────────
function NavRow({ label, hint, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "16px",
        background: tokens.white,
        border: `1px solid ${tokens.borderColor}`,
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background 0.2s",
        textAlign: "left",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = tokens.lightGray)}
      onMouseLeave={(e) => (e.currentTarget.style.background = tokens.white)}
    >
      <div>
        <p style={{ margin: "0 0 4px", fontFamily: "sans-serif", fontSize: "14px", fontWeight: 600, color: tokens.black }}>
          {label}
        </p>
        <p style={{ margin: 0, fontFamily: "sans-serif", fontSize: "12px", color: "#999" }}>
          {hint}
        </p>
      </div>
      <span style={{ fontSize: "18px", color: "#999", flexShrink: 0, marginLeft: "16px" }}>→</span>
    </button>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function SettingsSection({ icon, title, description, isDanger, children }) {
  return (
    <div
      style={{
        borderRadius: "12px",
        border: `1px solid ${isDanger ? tokens.danger : tokens.borderColor}`,
        padding: "28px",
        background: isDanger ? "#ffebee" : tokens.white,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "48px",
            height: "48px",
            borderRadius: "8px",
            background: isDanger ? "#ffebee" : tokens.lightGray,
            color: isDanger ? tokens.danger : tokens.orange,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "20px", fontWeight: 700, color: tokens.black, margin: "0 0 4px" }}>
            {title}
          </h2>
          <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "#999", margin: 0 }}>
            {description}
          </p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

// ─── Toggle row ───────────────────────────────────────────────────────────────
function SettingToggle({ label, description, checked, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0",
        borderBottom: `1px solid ${tokens.borderColor}`,
      }}
    >
      <div>
        <label style={{ display: "block", fontFamily: "sans-serif", fontSize: "14px", fontWeight: 600, color: tokens.black, marginBottom: "4px" }}>
          {label}
        </label>
        <p style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#999", margin: 0 }}>
          {description}
        </p>
      </div>
      <label style={{ display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0, marginLeft: "16px" }}>
        <input type="checkbox" checked={checked} onChange={onChange} style={{ display: "none" }} />
        <div
          style={{
            width: "44px",
            height: "24px",
            borderRadius: "12px",
            background: checked ? tokens.orange : "#d8d3cb",
            transition: "all 0.3s",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "2px",
              left: checked ? "22px" : "2px",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: tokens.white,
              transition: "all 0.3s",
            }}
          />
        </div>
      </label>
    </div>
  );
}
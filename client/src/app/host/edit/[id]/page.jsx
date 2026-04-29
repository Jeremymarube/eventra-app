"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
};

function FormField({ label, type = "text", placeholder, value, onChange, required = false }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "24px" }}>
      <label
        style={{
          display: "block",
          fontFamily: "sans-serif",
          fontSize: "14px",
          fontWeight: 600,
          color: tokens.black,
          marginBottom: "8px",
        }}
      >
        {label}
        {required && <span style={{ color: tokens.orange }}>*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "10px",
            border: `1px solid ${focused ? tokens.black : "#d8d3cb"}`,
            fontFamily: "sans-serif",
            fontSize: "14px",
            background: tokens.white,
            color: tokens.black,
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.15s",
            minHeight: "120px",
            resize: "vertical",
          }}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "10px",
            border: `1px solid ${focused ? tokens.black : "#d8d3cb"}`,
            fontFamily: "sans-serif",
            fontSize: "14px",
            background: tokens.white,
            color: tokens.black,
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.15s",
          }}
        />
      )}
    </div>
  );
}

const categories = [
  "Music",
  "Art",
  "Tech",
  "Food & Drink",
  "Sports",
  "Business",
  "Wellness",
  "Community",
  "Nightlife",
  "Other",
];

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id;
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login?redirect=/host");
      return;
    }
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/events/${eventId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvent(data);
        setFormData(data);
      } else {
        setError("Failed to load event");
      }
    } catch (err) {
      setError("Network error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location_name: formData.location_name,
        location: formData.location,
        price_cents: parseInt(formData.price_cents) || 0,
        currency: formData.currency,
        starts_at: new Date(formData.starts_at).toISOString(),
        ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        cover_image_url: formData.cover_image_url,
        status: formData.status,
      };

      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save event");
      }
    } catch (err) {
      setError("Network error");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: tokens.cream, display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#999", fontFamily: "sans-serif" }}>Loading event...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!formData) {
    return (
      <div style={{ minHeight: "100vh", background: tokens.cream, display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#999", fontFamily: "sans-serif" }}>Event not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: tokens.cream, display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, padding: "40px max(16px, 3vw)" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "40px" }}>
            <Link
              href="/host"
              style={{
                fontFamily: "sans-serif",
                fontSize: "14px",
                color: "#999",
                textDecoration: "none",
                marginBottom: "16px",
                display: "inline-block",
              }}
            >
              ← Back
            </Link>
            <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "48px", fontWeight: 900, color: tokens.black, margin: "0 0 12px" }}>
              Edit event
            </h1>
            <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: "#666", margin: 0 }}>
              {formData.title}
            </p>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div style={{
              background: "#fee",
              color: "#c0392b",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "24px",
              fontFamily: "sans-serif",
              fontSize: "14px",
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: "#e8f5e9",
              color: "#2e7d32",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "24px",
              fontFamily: "sans-serif",
              fontSize: "14px",
            }}>
              ✓ Event updated successfully!
            </div>
          )}

          {/* Form */}
          <div>
            <FormField
              label="Event title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />

            <FormField
              label="Description"
              type="textarea"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />

            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: 600, color: tokens.black, display: "block", marginBottom: "8px" }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1px solid #d8d3cb",
                  fontFamily: "sans-serif",
                  fontSize: "14px",
                  background: tokens.white,
                  color: tokens.black,
                  outline: "none",
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Venue name"
              value={formData.location_name}
              onChange={(e) => handleChange("location_name", e.target.value)}
            />

            <FormField
              label="Address"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />

            <FormField
              label="Start date & time"
              type="datetime-local"
              value={formData.starts_at?.slice(0, 16) || ""}
              onChange={(e) => handleChange("starts_at", e.target.value)}
            />

            <FormField
              label="End date & time"
              type="datetime-local"
              value={formData.ends_at?.slice(0, 16) || ""}
              onChange={(e) => handleChange("ends_at", e.target.value)}
            />

            <FormField
              label="Capacity"
              type="number"
              value={formData.capacity || ""}
              onChange={(e) => handleChange("capacity", e.target.value)}
            />

            <FormField
              label="Price (in cents)"
              type="number"
              value={formData.price_cents}
              onChange={(e) => handleChange("price_cents", e.target.value)}
            />

            <FormField
              label="Cover image URL"
              value={formData.cover_image_url || ""}
              onChange={(e) => handleChange("cover_image_url", e.target.value)}
            />

            {/* Actions */}
            <div style={{ display: "flex", gap: "12px", marginTop: "40px" }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  flex: 1,
                  background: tokens.black,
                  color: tokens.white,
                  border: "none",
                  padding: "14px 28px",
                  borderRadius: "999px",
                  fontFamily: "'Georgia', serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
  gray: "#666666",
  lightGray: "#f7f7f7",
  borderGray: "#e5e5e5",
};

const CATEGORIES = [
  { value: "music", label: "🎵 Music" },
  { value: "tech", label: "💻 Tech" },
  { value: "food-drink", label: "🍷 Food & Drink" },
  { value: "art", label: "🎨 Art" },
  { value: "sports", label: "⚽ Sports" },
  { value: "business", label: "💼 Business" },
  { value: "wellness", label: "🧘 Wellness" },
  { value: "community", label: "🤝 Community" },
  { value: "nightlife", label: "🌙 Nightlife" },
  { value: "other", label: "✦ Other" },
];

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: `1px solid ${tokens.borderGray}`,
  fontSize: "14px",
  boxSizing: "border-box",
  background: tokens.white,
  color: tokens.black,
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: 500,
  color: tokens.black,
  marginBottom: "8px",
  display: "block",
};

export default function CreateEventPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location_name: "",
    location: "",
    starts_at: "",
    ends_at: "",
    capacity: "",
    price_cents: "0",
    currency: "KES",
    cover_image_url: "",
    status: "draft",
    visibility: "public",
    calendar_id: null,
  });

  const [paymentType, setPaymentType] = useState("free");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [calendars, setCalendars] = useState([]);
  const [showCreateCalendar, setShowCreateCalendar] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState("");
  const [newCalendarDescription, setNewCalendarDescription] = useState("");
  const [creatingCalendar, setCreatingCalendar] = useState(false);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchCalendars();
    }
  }, []);

  const fetchCalendars = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/calendars",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setCalendars(data.calendars || []);
      }
    } catch (err) {
      console.error("Failed to fetch calendars:", err);
    }
  };

  const handleCreateCalendar = async () => {
    if (!newCalendarName.trim()) {
      setError("Please enter a calendar name");
      return;
    }
    setCreatingCalendar(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/calendars",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newCalendarName,
            description: newCalendarDescription,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCalendars([...calendars, data.calendar]);
        setSelectedCalendarId(data.calendar.id);
        handleChange("calendar_id", data.calendar.id);
        setShowCreateCalendar(false);
        setNewCalendarName("");
        setNewCalendarDescription("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to create calendar");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setCreatingCalendar(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid image (JPEG, PNG, WEBP, or GIF)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }
    const localPreview = URL.createObjectURL(file);
    setPreviewImage(localPreview);
    setUploadingImage(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/upload",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: uploadFormData,
        }
      );
      if (response.ok) {
        const data = await response.json();
        handleChange("cover_image_url", data.imageUrl);
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      setPreviewImage(localPreview);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    handleChange("cover_image_url", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const generateDescription = async () => {
    if (!formData.title) {
      setError("Please enter a title first");
      return;
    }
    setAiGenerating(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/events/generate-description",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            category: formData.category,
            location_name: formData.location_name,
          }),
        }
      );
      const data = await res.json();
      if (res.ok && data.description) {
        handleChange("description", data.description);
      } else {
        setError(data.error || "Failed to generate description");
      }
    } catch (err) {
      setError("Network error while generating description");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      setError("Please select a category");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        status: "published",
        is_published: true,
        price_cents:
          paymentType === "paid" ? parseInt(formData.price_cents) : 0,
        starts_at: new Date(formData.starts_at).toISOString(),
        ends_at: formData.ends_at
          ? new Date(formData.ends_at).toISOString()
          : null,
      };
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = "/browse";
      } else {
        setError(data.error || "Failed to create event");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .create-grid {
            display: grid !important;
            grid-template-columns: 340px 1fr !important;
          }
          .cover-preview {
            height: 460px !important;
          }
          .event-title-input {
            font-size: 32px !important;
          }
          .dates-row {
            flex-direction: row !important;
          }
        }
      `}</style>

      <div style={{ background: tokens.white, minHeight: "100vh" }}>
        <main style={{ padding: "20px 16px 60px", boxSizing: "border-box" }}>
          <div
            className="create-grid"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              maxWidth: "1100px",
              margin: "0 auto",
            }}
          >
            {/* ── COVER IMAGE ── */}
            <div>
              <div
                className="cover-preview"
                style={{
                  borderRadius: "14px",
                  overflow: "hidden",
                  background: tokens.lightGray,
                  height: "220px",
                  position: "relative",
                }}
              >
                <img
                  src={
                    previewImage ||
                    formData.cover_image_url ||
                    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
                  }
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt="Event cover preview"
                />
                {uploadingImage && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "14px",
                    }}
                  >
                    Uploading...
                  </div>
                )}
              </div>

              <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: `1px solid ${tokens.borderGray}`,
                    background: tokens.white,
                    color: tokens.black,
                    fontSize: "14px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  📸 {uploadingImage ? "Uploading..." : "Upload cover"}
                </label>
                {(previewImage || formData.cover_image_url) && (
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: `1px solid ${tokens.borderGray}`,
                      background: tokens.white,
                      cursor: "pointer",
                      fontSize: "14px",
                      color: tokens.gray,
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "10px 0",
                  gap: "10px",
                }}
              >
                <hr
                  style={{
                    flex: 1,
                    border: "none",
                    borderTop: `1px solid ${tokens.borderGray}`,
                  }}
                />
                <span style={{ fontSize: "12px", color: tokens.gray }}>OR</span>
                <hr
                  style={{
                    flex: 1,
                    border: "none",
                    borderTop: `1px solid ${tokens.borderGray}`,
                  }}
                />
              </div>

              <input
                type="text"
                placeholder="Paste image URL"
                value={formData.cover_image_url}
                onChange={(e) => {
                  handleChange("cover_image_url", e.target.value);
                  if (e.target.value) setPreviewImage(null);
                }}
                style={{ ...inputStyle, marginBottom: "4px" }}
              />
              <p style={{ fontSize: "11px", color: tokens.gray, margin: "4px 0 0" }}>
                Recommended: 1200×630px, max 5MB
              </p>
            </div>

            {/* ── FORM ── */}
            <div>
              {/* Error */}
              {error && (
                <div
                  style={{
                    background: "#fee",
                    color: "#c0392b",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}

              {/* CALENDAR */}
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <label style={labelStyle}>Choose calendar</label>
                  {!showCreateCalendar && (
                    <button
                      type="button"
                      onClick={() => setShowCreateCalendar(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: tokens.orange,
                        fontSize: "13px",
                        cursor: "pointer",
                        textDecoration: "underline",
                        padding: 0,
                      }}
                    >
                      + New calendar
                    </button>
                  )}
                </div>

                {!showCreateCalendar ? (
                  <div
                    style={{
                      border: `1px solid ${tokens.borderGray}`,
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      onClick={() => {
                        setSelectedCalendarId(null);
                        handleChange("calendar_id", null);
                      }}
                      style={{
                        padding: "12px 14px",
                        background:
                          selectedCalendarId === null
                            ? tokens.lightGray
                            : tokens.white,
                        borderBottom:
                          calendars.length > 0
                            ? `1px solid ${tokens.borderGray}`
                            : "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>📅</span>
                      <div>
                        <div
                          style={{ fontWeight: 500, fontSize: "14px", color: tokens.black }}
                        >
                          Personal Calendar
                        </div>
                        <div style={{ fontSize: "12px", color: tokens.gray }}>
                          Your default calendar
                        </div>
                      </div>
                    </div>
                    {calendars.map((calendar) => (
                      <div
                        key={calendar.id}
                        onClick={() => {
                          setSelectedCalendarId(calendar.id);
                          handleChange("calendar_id", calendar.id);
                        }}
                        style={{
                          padding: "12px 14px",
                          background:
                            selectedCalendarId === calendar.id
                              ? tokens.lightGray
                              : tokens.white,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          borderTop: `1px solid ${tokens.borderGray}`,
                        }}
                      >
                        <span style={{ fontSize: "18px" }}>📆</span>
                        <div>
                          <div
                            style={{
                              fontWeight: 500,
                              fontSize: "14px",
                              color: tokens.black,
                            }}
                          >
                            {calendar.name}
                          </div>
                          {calendar.description && (
                            <div style={{ fontSize: "12px", color: tokens.gray }}>
                              {calendar.description}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      border: `1px solid ${tokens.borderGray}`,
                      borderRadius: "8px",
                      padding: "14px",
                      background: tokens.lightGray,
                    }}
                  >
                    <div style={{ marginBottom: "10px" }}>
                      <label style={{ ...labelStyle, marginBottom: "4px" }}>
                        Calendar name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Work Events, Personal"
                        value={newCalendarName}
                        onChange={(e) => setNewCalendarName(e.target.value)}
                        style={inputStyle}
                        autoFocus
                      />
                    </div>
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ ...labelStyle, marginBottom: "4px" }}>
                        Description (optional)
                      </label>
                      <textarea
                        placeholder="What is this calendar for?"
                        value={newCalendarDescription}
                        onChange={(e) =>
                          setNewCalendarDescription(e.target.value)
                        }
                        style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={handleCreateCalendar}
                        disabled={creatingCalendar}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "6px",
                          background: tokens.orange,
                          color: tokens.white,
                          border: "none",
                          cursor: creatingCalendar ? "not-allowed" : "pointer",
                          fontWeight: 500,
                          opacity: creatingCalendar ? 0.6 : 1,
                          fontSize: "14px",
                        }}
                      >
                        {creatingCalendar ? "Creating..." : "Create"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateCalendar(false);
                          setNewCalendarName("");
                          setNewCalendarDescription("");
                        }}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "6px",
                          background: tokens.white,
                          color: tokens.black,
                          border: `1px solid ${tokens.borderGray}`,
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                <p style={{ fontSize: "12px", color: tokens.gray, marginTop: "6px" }}>
                  Calendar admins get manage access to this event.
                </p>
              </div>

              {/* VISIBILITY */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Event visibility</label>
                <select
                  value={formData.visibility || "public"}
                  onChange={(e) => handleChange("visibility", e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="public">🌍 Public — Anyone can find and join</option>
                  <option value="unlisted">🔗 Unlisted — Only people with the link</option>
                  <option value="private">🔒 Private — Only invited people</option>
                </select>
              </div>

              {(formData.visibility === "private" ||
                formData.visibility === "unlisted") && (
                <div
                  style={{
                    background: tokens.lightGray,
                    padding: "10px 12px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    fontSize: "13px",
                    color: tokens.gray,
                  }}
                >
                  {formData.visibility === "private"
                    ? "🔒 Only people you specifically invite will see this event."
                    : "🔗 Won't appear in search. Anyone with the link can join."}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* TITLE */}
                <input
                  type="text"
                  placeholder="Event name"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="event-title-input"
                  style={{
                    width: "100%",
                    fontSize: "24px",
                    fontWeight: "bold",
                    border: "none",
                    borderBottom: `2px solid ${tokens.borderGray}`,
                    outline: "none",
                    background: "transparent",
                    color: tokens.black,
                    marginBottom: "20px",
                    padding: "4px 0",
                    boxSizing: "border-box",
                  }}
                  required
                />

                {/* CATEGORY */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>
                    Category{" "}
                    <span style={{ color: tokens.orange }}>*</span>
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleChange("category", cat.value)}
                        style={{
                          padding: "7px 14px",
                          borderRadius: "999px",
                          border: `1px solid ${
                            formData.category === cat.value
                              ? tokens.orange
                              : tokens.borderGray
                          }`,
                          background:
                            formData.category === cat.value
                              ? tokens.orange
                              : tokens.white,
                          color:
                            formData.category === cat.value
                              ? tokens.white
                              : tokens.black,
                          fontSize: "13px",
                          fontWeight:
                            formData.category === cat.value ? 600 : 400,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DATES — stack on mobile, row on desktop */}
                <div
                  className="dates-row"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <label style={{ ...labelStyle, marginBottom: "4px" }}>
                      Start date & time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.starts_at}
                      onChange={(e) => handleChange("starts_at", e.target.value)}
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ ...labelStyle, marginBottom: "4px" }}>
                      End date & time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.ends_at}
                      onChange={(e) => handleChange("ends_at", e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* LOCATION */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Location</label>
                  <input
                    placeholder="Add event location"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* DESCRIPTION */}
                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <label style={{ ...labelStyle, margin: 0 }}>Description</label>
                    <button
                      type="button"
                      onClick={generateDescription}
                      disabled={aiGenerating}
                      style={{
                        background: "none",
                        border: `1px solid ${tokens.borderGray}`,
                        padding: "6px 12px",
                        borderRadius: "8px",
                        cursor: aiGenerating ? "not-allowed" : "pointer",
                        fontSize: "13px",
                        color: tokens.black,
                        opacity: aiGenerating ? 0.6 : 1,
                      }}
                    >
                      {aiGenerating ? "Generating…" : "✨ Generate"}
                    </button>
                  </div>
                  <textarea
                    placeholder="Describe your event"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    style={{
                      ...inputStyle,
                      minHeight: "100px",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                  />
                </div>

                {/* TICKET TYPE */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Ticket type</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {["free", "paid"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPaymentType(type)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          border: `1px solid ${
                            paymentType === type
                              ? tokens.orange
                              : tokens.borderGray
                          }`,
                          background:
                            paymentType === type ? tokens.orange : tokens.white,
                          color:
                            paymentType === type ? tokens.white : tokens.black,
                          cursor: "pointer",
                          fontWeight: 500,
                          fontSize: "14px",
                          textTransform: "capitalize",
                        }}
                      >
                        {type === "free" ? "🎟 Free" : "💳 Paid"}
                      </button>
                    ))}
                  </div>
                  {paymentType === "paid" && (
                    <input
                      type="number"
                      placeholder="Price (KES)"
                      value={formData.price_cents}
                      onChange={(e) =>
                        handleChange("price_cents", e.target.value)
                      }
                      style={{ ...inputStyle, marginTop: "10px" }}
                    />
                  )}
                </div>

                {/* CAPACITY */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={labelStyle}>Capacity (optional)</label>
                  <input
                    type="number"
                    placeholder="Leave blank for unlimited"
                    value={formData.capacity}
                    onChange={(e) => handleChange("capacity", e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading || uploadingImage}
                  style={{
                    width: "100%",
                    padding: "15px",
                    borderRadius: "12px",
                    background: tokens.orange,
                    color: tokens.white,
                    fontWeight: "bold",
                    cursor:
                      loading || uploadingImage ? "not-allowed" : "pointer",
                    border: "none",
                    fontSize: "16px",
                    opacity: loading || uploadingImage ? 0.6 : 1,
                  }}
                >
                  {loading
                    ? "Creating..."
                    : uploadingImage
                    ? "Uploading image..."
                    : "Create Event"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
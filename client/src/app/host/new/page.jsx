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
  { value: "other", label: " Other" },
];

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

  // Calendar states
  const [calendars, setCalendars] = useState([]);
  const [showCreateCalendar, setShowCreateCalendar] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState("");
  const [newCalendarDescription, setNewCalendarDescription] = useState("");
  const [creatingCalendar, setCreatingCalendar] = useState(false);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);

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
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/calendars", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/calendars", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCalendarName, description: newCalendarDescription }),
      });
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
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: uploadFormData,
      });
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

  const [aiGenerating, setAiGenerating] = useState(false);
  const generateDescription = async () => {
    if (!formData.title) {
      setError('Please enter a title first');
      return;
    }
    setAiGenerating(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/events/generate-description', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: formData.title, category: formData.category, location_name: formData.location_name })
      });
      const data = await res.json();
      if (res.ok && data.description) {
        handleChange('description', data.description);
      } else {
        setError(data.error || 'Failed to generate description');
      }
    } catch (err) {
      setError('Network error while generating description');
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
        price_cents: paymentType === "paid" ? parseInt(formData.price_cents) : 0,
        starts_at: new Date(formData.starts_at).toISOString(),
        ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : null,

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
    <div style={{ background: tokens.white, minHeight: "100vh" }}>
      <main className="create-event-main" style={{ padding: "40px 5vw" }}>
        <div
          className="create-event-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "380px 1fr",
            gap: "40px",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {/* LEFT PREVIEW */}
          <div>
            <div
              className="cover-preview"
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                background: tokens.lightGray,
                height: "500px",
                position: "relative",
              }}
            >
              <img
                className="cover-image"
                src={previewImage || formData.cover_image_url || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                alt="Event cover preview"
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
                    transition: "all 0.2s",
                  }}
                  className="image-upload-label"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = tokens.orange;
                    e.currentTarget.style.color = tokens.orange;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = tokens.borderGray;
                    e.currentTarget.style.color = tokens.black;
                  }}
                >
                  {uploadingImage ? "📤 Uploading..." : "📸 Add theme"}
                </label>
                {(previewImage || formData.cover_image_url) && (
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: `1px solid ${tokens.borderGray}`,
                      background: tokens.white,
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", margin: "12px 0", gap: "10px" }}>
                <hr style={{ flex: 1, border: "none", borderTop: `1px solid ${tokens.borderGray}` }} />
                <span style={{ fontSize: "12px", color: tokens.gray }}>OR</span>
                <hr style={{ flex: 1, border: "none", borderTop: `1px solid ${tokens.borderGray}` }} />
              </div>

              <input
                type="text"
                placeholder="Or paste image URL"
                value={formData.cover_image_url}
                onChange={(e) => {
                  handleChange("cover_image_url", e.target.value);
                  if (e.target.value) setPreviewImage(null);
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: `1px solid ${tokens.borderGray}`,
                  fontSize: "14px",
                  marginBottom: "8px",
                  boxSizing: "border-box",
                }}
              />
              <p style={{ fontSize: "12px", color: tokens.gray, marginTop: "8px" }}>
                Recommended: 1200 x 630 pixels (2:1 ratio), max 5MB
              </p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div>
            {/* CALENDAR SELECTION */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: 500, color: tokens.black }}>
                  Choose calendar
                </label>
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
                    }}
                  >
                    + Create new calendar
                  </button>
                )}
              </div>

              {!showCreateCalendar ? (
                <div style={{ border: `1px solid ${tokens.borderGray}`, borderRadius: "8px", overflow: "hidden" }}>
                  <div
                    onClick={() => { setSelectedCalendarId(null); handleChange("calendar_id", null); }}
                    style={{
                      padding: "12px 16px",
                      background: selectedCalendarId === null ? tokens.lightGray : tokens.white,
                      borderBottom: calendars.length > 0 ? `1px solid ${tokens.borderGray}` : "none",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "18px" }}>📅</span>
                      <div>
                        <div style={{ fontWeight: 500, color: tokens.black }}>Personal Calendar</div>
                        <div style={{ fontSize: "12px", color: tokens.gray }}>Your default calendar</div>
                      </div>
                    </div>
                  </div>
                  {calendars.map((calendar) => (
                    <div
                      key={calendar.id}
                      onClick={() => { setSelectedCalendarId(calendar.id); handleChange("calendar_id", calendar.id); }}
                      style={{
                        padding: "12px 16px",
                        background: selectedCalendarId === calendar.id ? tokens.lightGray : tokens.white,
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "18px" }}>📆</span>
                        <div>
                          <div style={{ fontWeight: 500, color: tokens.black }}>{calendar.name}</div>
                          {calendar.description && (
                            <div style={{ fontSize: "12px", color: tokens.gray }}>{calendar.description}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ border: `1px solid ${tokens.borderGray}`, borderRadius: "8px", padding: "16px", background: tokens.lightGray }}>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ fontSize: "14px", fontWeight: 500, color: tokens.black, marginBottom: "4px", display: "block" }}>
                      Calendar name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Work Events, Personal, Team Meetings"
                      value={newCalendarName}
                      onChange={(e) => setNewCalendarName(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: `1px solid ${tokens.borderGray}`, fontSize: "14px", boxSizing: "border-box" }}
                      autoFocus
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "14px", fontWeight: 500, color: tokens.black, marginBottom: "4px", display: "block" }}>
                      Description (optional)
                    </label>
                    <textarea
                      placeholder="What is this calendar for?"
                      value={newCalendarDescription}
                      onChange={(e) => setNewCalendarDescription(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: `1px solid ${tokens.borderGray}`, fontSize: "14px", minHeight: "60px", boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={handleCreateCalendar}
                      disabled={creatingCalendar}
                      style={{
                        flex: 1, padding: "10px", borderRadius: "6px",
                        background: tokens.orange, color: tokens.white, border: "none",
                        cursor: creatingCalendar ? "not-allowed" : "pointer",
                        fontWeight: 500, opacity: creatingCalendar ? 0.6 : 1,
                      }}
                    >
                      {creatingCalendar ? "Creating..." : "Create calendar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowCreateCalendar(false); setNewCalendarName(""); setNewCalendarDescription(""); }}
                      style={{
                        flex: 1, padding: "10px", borderRadius: "6px",
                        background: tokens.white, color: tokens.black,
                        border: `1px solid ${tokens.borderGray}`, cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <p style={{ fontSize: "12px", color: tokens.gray, marginTop: "8px" }}>
                Creating the event under a calendar grants its admins manage access.
              </p>
            </div>

            {/* VISIBILITY SELECTION */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "14px", fontWeight: 500, color: tokens.black, marginBottom: "8px", display: "block" }}>
                Event visibility
              </label>
              <select
                value={formData.visibility || "public"}
                onChange={(e) => handleChange("visibility", e.target.value)}
                style={{
                  width: "100%", padding: "12px", borderRadius: "8px",
                  border: `1px solid ${tokens.borderGray}`, background: tokens.white,
                  color: tokens.black, fontSize: "14px", cursor: "pointer",
                }}
              >
                <option value="public">🌍 Public - Anyone can find and join</option>
                <option value="unlisted"> Unlisted - Only people with the link can join</option>
                <option value="private"> Private - Only invited people can join</option>
              </select>
            </div>

            {formData.visibility === "private" && (
              <div style={{ background: tokens.lightGray, padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px", color: tokens.gray }}>
                🔒 Private events are hidden from search and discovery. Only people you specifically invite will be able to see and join this event.
              </div>
            )}
            {formData.visibility === "unlisted" && (
              <div style={{ background: tokens.lightGray, padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px", color: tokens.gray }}>
                🔗 Unlisted events won't appear in search results or on your public profile. Anyone with the link can view and join.
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div style={{ background: "#fee", color: "#c0392b", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* TITLE */}
              <input
                type="text"
                placeholder="Event Name"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="event-title"
                style={{
                  fontSize: "36px", fontWeight: "bold", border: "none", outline: "none",
                  background: "transparent", color: tokens.black, marginBottom: "20px",
                  width: "100%", padding: "0",
                }}
                required
              />

              {/* CATEGORY SELECTION */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "14px", fontWeight: 500, color: tokens.black, marginBottom: "10px", display: "block" }}>
                  Category <span style={{ color: tokens.orange }}>*</span>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => handleChange("category", cat.value)}
                      className="category-button"
                      style={{
                        padding: "8px 16px",
                        borderRadius: "999px",
                        border: `1px solid ${formData.category === cat.value ? tokens.orange : tokens.borderGray}`,
                        background: formData.category === cat.value ? tokens.orange : tokens.white,
                        color: formData.category === cat.value ? tokens.white : tokens.black,
                        fontSize: "13px",
                        fontWeight: formData.category === cat.value ? 600 : 400,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* DATE */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <input
                  type="datetime-local"
                  value={formData.starts_at}
                  onChange={(e) => handleChange("starts_at", e.target.value)}
                  style={{ flex: 1, padding: "12px", borderRadius: "8px", border: `1px solid ${tokens.borderGray}`, fontSize: "14px" }}
                  required
                />
                <input
                  type="datetime-local"
                  value={formData.ends_at}
                  onChange={(e) => handleChange("ends_at", e.target.value)}
                  style={{ flex: 1, padding: "12px", borderRadius: "8px", border: `1px solid ${tokens.borderGray}`, fontSize: "14px" }}
                />
              </div>

              {/* LOCATION */}
              <input
                placeholder="Add Event Location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                style={{
                  width: "100%", padding: "12px", marginBottom: "12px",
                  borderRadius: "8px", border: `1px solid ${tokens.borderGray}`,
                  fontSize: "14px", boxSizing: "border-box",
                }}
              />

              {/* DESCRIPTION */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontWeight: 600 }}>Description</label>
                <div>
                  <button
                    type="button"
                    onClick={generateDescription}
                    disabled={aiGenerating}
                    style={{
                      background: 'none', border: '1px solid #e5e5e5', padding: '6px 10px', borderRadius: 8, cursor: 'pointer'
                    }}
                  >
                    {aiGenerating ? 'Generating…' : 'Generate description'}
                  </button>
                </div>
              </div>
              <textarea
                placeholder="Add Description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                style={{
                  width: "100%", padding: "12px", borderRadius: "8px",
                  border: `1px solid ${tokens.borderGray}`, minHeight: "100px",
                  marginBottom: "20px", fontSize: "14px", fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />

              {/* TICKETS */}
              <div style={{ marginBottom: "20px" }}>
                <p style={{ color: tokens.black, marginBottom: "10px", fontWeight: 500 }}>Ticket Type</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  {["free", "paid"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPaymentType(type)}
                      style={{
                        padding: "10px 20px", borderRadius: "8px",
                        border: `1px solid ${paymentType === type ? tokens.orange : tokens.borderGray}`,
                        background: paymentType === type ? tokens.orange : tokens.white,
                        color: paymentType === type ? tokens.white : tokens.black,
                        cursor: "pointer", fontWeight: 500, transition: "all 0.2s",
                        textTransform: "capitalize",
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {paymentType === "paid" && (
                  <input
                    type="number"
                    placeholder="Price (KES)"
                    value={formData.price_cents}
                    onChange={(e) => handleChange("price_cents", e.target.value)}
                    style={{
                      marginTop: "10px", padding: "10px", borderRadius: "8px",
                      border: `1px solid ${tokens.borderGray}`, width: "100%",
                      fontSize: "14px", boxSizing: "border-box",
                    }}
                  />
                )}
              </div>

              {/* CAPACITY */}
              <input
                type="number"
                placeholder="Capacity (optional)"
                value={formData.capacity}
                onChange={(e) => handleChange("capacity", e.target.value)}
                style={{
                  width: "100%", padding: "12px", borderRadius: "8px",
                  border: `1px solid ${tokens.borderGray}`, marginBottom: "20px",
                  fontSize: "14px", boxSizing: "border-box",
                }}
              />

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="submit-button"
                style={{
                  width: "100%", padding: "14px", borderRadius: "12px",
                  background: tokens.orange, color: tokens.white, fontWeight: "bold",
                  cursor: loading || uploadingImage ? "not-allowed" : "pointer",
                  border: "none", fontSize: "16px", transition: "background 0.2s",
                  opacity: loading || uploadingImage ? 0.6 : 1,
                }}
                onMouseEnter={(e) => { if (!loading && !uploadingImage) e.currentTarget.style.background = "#d63a00"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = tokens.orange; }}
              >
                {loading ? "Creating..." : uploadingImage ? "Uploading image..." : "Create Event"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
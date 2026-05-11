"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
// import Footer from "../../components/Footer";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
};

const tabs = ["Upcoming", "Past events", "Saved", "Settings"];

function EventRow({ event, past = false, currentUser }) {
  // Handle both booking objects and event objects
  const eventData = event.event || event.events || event;
  const bookingId = event.id;
  
  if (!eventData) return null;
  
  // Format date from ISO string if available
  const dateStr = eventData.starts_at || eventData.date;
  let month = "APR";
  let day = "22";
  let tag = eventData.category || "EVENTS";
  
  if (dateStr) {
    const d = new Date(dateStr);
    month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    day = d.getDate().toString();
  }
  
  return (
    <Link
      href={`/event/${eventData.id}`}
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        padding: "16px 0",
        borderBottom: "1px solid #f0ebe3",
        textDecoration: "none",
        color: tokens.black,
        opacity: past ? 0.65 : 1,
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "12px",
          overflow: "hidden",
          flexShrink: 0,
          background: "#e0dbd0",
        }}
      >
        {eventData.cover_image_url ? (
          <img
            src={eventData.cover_image_url}
            alt={eventData.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: past ? "grayscale(40%)" : "none" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>
            📷
          </div>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: "10px",
              letterSpacing: "1px",
              fontWeight: 700,
              color: past ? "#aaa" : tokens.orange,
            }}
          >
            {month} {day}
          </span>
          <span
            style={{
              background: past ? "#f0ebe3" : "rgba(232,68,10,0.1)",
              color: past ? "#aaa" : tokens.orange,
              borderRadius: "999px",
              padding: "2px 10px",
              fontFamily: "sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            {tag.toUpperCase()}
          </span>
        </div>
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "16px",
            fontWeight: 900,
            color: tokens.black,
            letterSpacing: "-0.3px",
            marginBottom: "2px",
          }}
        >
          {eventData.title}
        </div>
        <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#999" }}>
          📍 {eventData.location_name || eventData.venue || "Location TBA"}
        </div>
      </div>

      <div style={{ textAlign: "right", flexShrink: 0 }}>
        {eventData.price && !past && (
          <div style={{ fontFamily: "'Georgia', serif", fontSize: "15px", fontWeight: 700, color: tokens.black, marginBottom: "4px" }}>
            {eventData.currency === 'KES' ? `KES ${eventData.price}` : `$${eventData.price}`}
          </div>
        )}
        <span style={{ fontSize: "16px", color: "#ccc" }}>→</span>

        {/* If current user is the host, show Edit/Delete buttons */}
        {currentUser && eventData.host_id === currentUser.id && (
          <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
            <Link
              href={`/host/edit/${eventData.id}`}
              style={{
                background: "none",
                border: "1px solid #d8d3cb",
                padding: "8px 12px",
                borderRadius: "8px",
                fontFamily: "sans-serif",
                fontSize: "12px",
                color: tokens.black,
                textDecoration: "none",
              }}
            >
              Edit
            </Link>
            <button
              onClick={async () => {
                if (!confirm('Delete this event permanently?')) return;
                try {
                  const token = localStorage.getItem('token');
                  const res = await fetch(`/api/events/${eventData.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                  });
                  if (res.ok) {
                    // Redirect to host dashboard to see remaining events
                    window.location.href = '/host';
                  } else {
                    const data = await res.json();
                    alert(data.error || 'Failed to delete event');
                  }
                } catch (err) {
                  console.error(err);
                  alert('Network error');
                }
              }}
              style={{
                background: "none",
                color: "#c0392b",
                border: "1px solid #f5c6c0",
                padding: "8px 12px",
                borderRadius: "8px",
                fontFamily: "sans-serif",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}

function SettingsTab({ user, onUpdate }) {
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, bio })
      });

      if (response.ok) {
        setSaved(true);
        onUpdate({ name, bio });
        setTimeout(() => setSaved(false), 2000);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = () => ({
    width: "100%",
    padding: "13px 16px",
    borderRadius: "10px",
    border: "1px solid #d8d3cb",
    fontFamily: "sans-serif",
    fontSize: "14px",
    background: tokens.white,
    color: tokens.black,
    outline: "none",
    boxSizing: "border-box",
  });

  return (
    <div style={{ maxWidth: "520px" }}>
      <h3 style={{ fontFamily: "'Georgia', serif", fontSize: "22px", fontWeight: 900, color: tokens.black, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
        Account settings
      </h3>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontFamily: "sans-serif", fontSize: "13px", fontWeight: 600, color: tokens.black, marginBottom: "8px" }}>
          Full name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle()}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontFamily: "sans-serif", fontSize: "13px", fontWeight: 600, color: tokens.black, marginBottom: "8px" }}>
          Email
        </label>
        <input
          type="email"
          value={user?.email || ""}
          disabled
          style={{
            ...inputStyle(),
            background: "#f5f5f5",
            cursor: "not-allowed",
          }}
        />
      </div>

      <div style={{ marginBottom: "28px" }}>
        <label style={{ display: "block", fontFamily: "sans-serif", fontSize: "13px", fontWeight: 600, color: tokens.black, marginBottom: "8px" }}>
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          style={{
            ...inputStyle(),
            resize: "vertical",
            fontFamily: "sans-serif",
          }}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          background: saved ? "#2d9e5f" : tokens.black,
          color: tokens.white,
          padding: "14px 32px",
          borderRadius: "999px",
          border: "none",
          fontFamily: "'Georgia', serif",
          fontSize: "15px",
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.2s",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
      </button>

      <div
        style={{
          marginTop: "48px",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid #f5d5d0",
          background: "#fdf8f7",
        }}
      >
        <h4 style={{ fontFamily: "'Georgia', serif", fontSize: "16px", fontWeight: 900, color: "#c0392b", margin: "0 0 8px" }}>
          Danger zone
        </h4>
        <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#999", margin: "0 0 16px" }}>
          Deleting your account is permanent and cannot be undone.
        </p>
        <button
          style={{
            background: "none",
            color: "#c0392b",
            border: "1px solid #f5c6c0",
            padding: "10px 20px",
            borderRadius: "999px",
            fontFamily: "sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={async () => {
            if (!confirm('Delete your account? This action cannot be undone.')) return;
            const token = localStorage.getItem('token');
            try {
              const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/profile', {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });
              if (res.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
              } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete account');
              }
            } catch (err) {
              console.error(err);
              alert('Network error while deleting account');
            }
          }}
        >
          Delete account
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);

  const fetchProfile = async (token) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (token) => {
    setBookingsLoading(true);
    setError("");
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    fetchProfile(token);
    fetchBookings(token);
  }, [router]);

  const handleUpdateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        userData.name = updatedData.name;
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (e) {
        console.error('Error updating localStorage', e);
      }
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => !b.status || b.status !== 'cancelled' && b.event && new Date(b.event.starts_at) > new Date()
  );

  const pastBookings = bookings.filter(
    (b) => (b.event && new Date(b.event.starts_at) <= new Date()) || b.status === 'cancelled'
  );

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: tokens.cream }}>
        <Header />
        <div style={{ padding: "56px 48px", textAlign: "center" }}>
          Loading profile...
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: tokens.cream }}>
        <Header />
        <div style={{ padding: "56px 48px", textAlign: "center" }}>
          Error loading profile. Please try again.
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: tokens.cream }}>
      <Header />

      <main style={{ padding: "24px max(16px, 4vw) 80px" }}>
        <div
          style={{
            display: "flex",
            gap: "32px",
            alignItems: "flex-start",
            marginBottom: "56px",
            paddingBottom: "48px",
            borderBottom: "1px solid #e0dbd0",
          }}
        >
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              background: user.avatarColor || "#e8e3db",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Georgia', serif",
              fontSize: "36px",
              fontWeight: 900,
              color: tokens.black,
              flexShrink: 0,
            }}
          >
            {user.avatar || (user.name ? user.name.charAt(0) : "U")}
          </div>

          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "clamp(28px, 6vw, 64px)",
                fontWeight: 900,
                color: tokens.black,
                margin: "0 0 6px",
                letterSpacing: "-1.5px",
              }}
            >
              {user.name}
            </h1>
            <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "#888", margin: "0 0 10px" }}>
              {user.email} · Member since {user.joined || "April 2026"}
            </p>
            <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "#555", lineHeight: 1.6, margin: "0 0 20px", maxWidth: "480px" }}>
              {user.bio || "No bio yet. Click 'Edit profile' to add one."}
            </p>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {user.stats?.map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: tokens.white,
                    border: "1px solid #e0dbd0",
                    borderRadius: "999px",
                    padding: "12px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontFamily: "'Georgia', serif", fontSize: "16px", fontWeight: 900, color: tokens.black }}>
                    {s.value}
                  </span>
                  <span style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#888" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab("Settings")}
            style={{
              background: "none",
              border: "1px solid #d8d3cb",
              borderRadius: "999px",
              padding: "10px 20px",
              fontFamily: "sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: tokens.black,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Edit profile
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0",
            borderBottom: "1px solid #e0dbd0",
            marginBottom: "36px",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? `2px solid ${tokens.black}` : "2px solid transparent",
                padding: "12px 24px",
                fontFamily: "sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: activeTab === tab ? tokens.black : "#999",
                cursor: "pointer",
                letterSpacing: "0.3px",
                marginBottom: "-1px",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: "720px" }}>
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

          {activeTab === "Upcoming" && (
            <div>
              {bookingsLoading ? (
                <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: "#aaa", padding: "40px 0", textAlign: "center" }}>
                  Loading bookings...
                </p>
              ) : upcomingBookings.length > 0 ? (
                upcomingBookings.map((b) => <EventRow key={b.id} event={b} currentUser={user} />)
              ) : (
                <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: "#aaa", padding: "40px 0", textAlign: "center" }}>
                  No upcoming events. <Link href="/browse" style={{ color: tokens.orange, textDecoration: "none", fontWeight: 600 }}>Browse events →</Link>
                </p>
              )}
            </div>
          )}

          {activeTab === "Past events" && (
            <div>
              {bookingsLoading ? (
                <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: "#aaa", padding: "40px 0", textAlign: "center" }}>
                  Loading bookings...
                </p>
              ) : pastBookings.length > 0 ? (
                pastBookings.map((b) => <EventRow key={b.id} event={b} past currentUser={user} />)
              ) : (
                <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: "#aaa", padding: "40px 0", textAlign: "center" }}>
                  No past events yet.
                </p>
              )}
            </div>
          )}

          {activeTab === "Saved" && (
            <div>
              <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: "#666", marginBottom: "16px" }}>
                View all your saved events in one place.
              </p>
              <Link href="/saved" style={{ fontFamily: "sans-serif", fontSize: "14px", color: tokens.orange, fontWeight: 600, textDecoration: "none" }}>
                Go to saved events →
              </Link>
            </div>
          )}

          {activeTab === "Settings" && <SettingsTab user={user} onUpdate={handleUpdateUser} />}
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}

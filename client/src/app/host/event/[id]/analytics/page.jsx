"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Header from "../../../../../components/Header";
import Footer from "../../../../../components/Footer";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
};

export default function AnalyticsPage() {
  const params = useParams();
  const eventId = params.id;
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchAnalytics();
  }, [eventId]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch event
      const eventRes = await fetch(`/api/events/${eventId}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (eventRes.ok) {
        setEvent(await eventRes.json());
      }

      // Fetch analytics
      const analyticsRes = await fetch(`/api/host/events/${eventId}/analytics`, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (analyticsRes.ok) {
        setAnalytics(await analyticsRes.json());
      } else {
        setError("Failed to load analytics");
      }
    } catch (err) {
      setError("Network error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ label, value, unit = "" }) => (
    <div style={{
      background: tokens.white,
      border: "1px solid #e8e3db",
      borderRadius: "12px",
      padding: "24px",
      textAlign: "center",
    }}>
      <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#999", margin: "0 0 8px", fontWeight: 600 }}>
        {label}
      </p>
      <p style={{ fontFamily: "'Georgia', serif", fontSize: "42px", fontWeight: 900, color: tokens.black, margin: 0 }}>
        {value}<span style={{ fontSize: "18px", color: "#999", marginLeft: "4px" }}>{unit}</span>
      </p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: tokens.cream, display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, padding: "40px max(16px, 3vw)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
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
              ← Back to dashboard
            </Link>
            <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "48px", fontWeight: 900, color: tokens.black, margin: "0 0 12px" }}>
              Analytics
            </h1>
            {event && (
              <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: "#666", margin: 0 }}>
                {event.title}
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "#fee",
              color: "#c0392b",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "24px",
            }}>
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
              Loading analytics...
            </div>
          )}

          {/* Stats */}
          {!loading && analytics && (
            <>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
                marginBottom: "40px",
              }}>
                <StatCard label="Total Bookings" value={analytics.total_bookings} />
                <StatCard label="Checked In" value={analytics.checked_in} />
                <StatCard label="Cancelled" value={analytics.cancelled_bookings} />
                <StatCard
                  label="Total Revenue"
                  value={(analytics.total_revenue / 100).toFixed(2)}
                  unit={` ${analytics.revenue_currency}`}
                />
              </div>

              {/* Breakdown Section */}
              <div style={{
                background: tokens.white,
                border: "1px solid #e8e3db",
                borderRadius: "12px",
                padding: "24px",
              }}>
                <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "24px", fontWeight: 700, color: tokens.black, margin: "0 0 24px" }}>
                  Event Summary
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
                  <div>
                    <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#999", margin: "0 0 8px", fontWeight: 600 }}>
                      CONVERSION RATE
                    </p>
                    <p style={{ fontFamily: "'Georgia', serif", fontSize: "32px", fontWeight: 700, color: tokens.black, margin: 0 }}>
                      {analytics.total_bookings > 0
                        ? ((analytics.checked_in / analytics.total_bookings) * 100).toFixed(1)
                        : 0}%
                    </p>
                    <p style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#999", margin: "4px 0 0" }}>
                      {analytics.checked_in} checked in of {analytics.total_bookings} bookings
                    </p>
                  </div>

                  <div>
                    <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#999", margin: "0 0 8px", fontWeight: 600 }}>
                      AVERAGE TICKET PRICE
                    </p>
                    <p style={{ fontFamily: "'Georgia', serif", fontSize: "32px", fontWeight: 700, color: tokens.black, margin: 0 }}>
                      {analytics.total_bookings > 0
                        ? ((analytics.total_revenue / 100) / analytics.total_bookings).toFixed(2)
                        : 0} {analytics.revenue_currency}
                    </p>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              {event && (
                <div style={{
                  background: tokens.white,
                  border: "1px solid #e8e3db",
                  borderRadius: "12px",
                  padding: "24px",
                  marginTop: "24px",
                }}>
                  <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "24px", fontWeight: 700, color: tokens.black, margin: "0 0 24px" }}>
                    Event Details
                  </h2>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
                    <div>
                      <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#999", margin: "0 0 8px", fontWeight: 600 }}>
                        DATE & TIME
                      </p>
                      <p style={{ fontFamily: "'Georgia', serif", fontSize: "16px", fontWeight: 700, color: tokens.black, margin: 0 }}>
                        {new Date(event.starts_at).toLocaleDateString()} {new Date(event.starts_at).toLocaleTimeString()}
                      </p>
                    </div>

                    <div>
                      <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#999", margin: "0 0 8px", fontWeight: 600 }}>
                        LOCATION
                      </p>
                      <p style={{ fontFamily: "'Georgia', serif", fontSize: "16px", fontWeight: 700, color: tokens.black, margin: 0 }}>
                        {event.location_name}
                      </p>
                    </div>

                    <div>
                      <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#999", margin: "0 0 8px", fontWeight: 600 }}>
                        CATEGORY
                      </p>
                      <p style={{ fontFamily: "'Georgia', serif", fontSize: "16px", fontWeight: 700, color: tokens.black, margin: 0 }}>
                        {event.category}
                      </p>
                    </div>

                    <div>
                      <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#999", margin: "0 0 8px", fontWeight: 600 }}>
                        CAPACITY
                      </p>
                      <p style={{ fontFamily: "'Georgia', serif", fontSize: "16px", fontWeight: 700, color: tokens.black, margin: 0 }}>
                        {event.capacity ? `${analytics.total_bookings}/${event.capacity}` : "Unlimited"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

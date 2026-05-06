"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
};

function Field({ label, type = "text", placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "20px" }}>
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
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: "10px",
          border: `1px solid ${focused ? tokens.black : "#d8d3cb"}`,
          fontFamily: "sans-serif",
          fontSize: "14px",
          background: tokens.cream,
          color: tokens.black,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.15s",
        }}
      />
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Pick up ?error= from Google callback redirect
  const [error, setError] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("error") || "";
    }
    return "";
  });

  const validateForm = () => {
    if (!name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/profile');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout" style={{ display: "flex", minHeight: "100vh", background: tokens.cream }}>

      {/* ── Left panel ── */}
      <div
        className="auth-left"
        style={{
          position: "relative",
          width: "50%",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=80"
          alt="Event crowd"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(10,5,2,0.55) 0%, rgba(10,5,2,0.45) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "32px 40px 36px",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "2px" }}>
            <span style={{ fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: "22px", color: tokens.white }}>
              Eventra
            </span>
            <span style={{ color: tokens.orange, fontSize: "28px", lineHeight: 1, marginTop: "-4px" }}>.</span>
          </Link>

          {/* Headline */}
          <div>
            <h2
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "clamp(32px, 3.5vw, 50px)",
                fontWeight: 900,
                color: tokens.white,
                margin: "0 0 20px",
                lineHeight: 1.1,
                letterSpacing: "-1px",
              }}
            >
              The events worth showing up for, all in one place.
            </h2>
            <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: 0 }}>
              Save what catches your eye. Book what moves you.<br />
              Discover what you didn&apos;t know you&apos;d love.
            </p>
          </div>

          <p style={{ fontFamily: "sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.45)", margin: 0 }}>
            © Eventra 2026
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div
        className="auth-right"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 64px",
        }}
      >
        <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "2px", color: "#999", margin: "0 0 12px", fontWeight: 600 }}>
          CREATE ACCOUNT
        </p>
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "48px",
            fontWeight: 900,
            color: tokens.black,
            margin: "0 0 10px",
            letterSpacing: "-1.5px",
          }}
        >
          Join Eventra.
        </h1>
        <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: "#888", margin: "0 0 32px" }}>
          Save events, book tickets, and host your own.
        </p>

        {error && (
          <div style={{
            background: "#fee",
            color: "#c0392b",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
          }}>
            {error}
          </div>
        )}
{/* 

        {/* Google * /}
        <button
          onClick={() => window.location.href = 'https://eventra-api-bd4i.onrender.com/api/auth/google/login'}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #d8d3cb",
            background: tokens.white,
            fontFamily: "sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: tokens.black,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "8px",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.5 30.2 0 24 0 14.7 0 6.7 5.4 2.7 13.3l7.8 6C12.4 13 17.8 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"/>
            <path fill="#FBBC05" d="M10.5 28.8A14.5 14.5 0 0 1 9.5 24c0-1.7.3-3.3.8-4.8l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.7 10.7l7.8-5.9z"/>
            <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.2 0-11.5-4.2-13.4-9.8l-7.8 5.9C6.7 42.6 14.7 48 24 48z"/>
          </svg>
          Continue with Google
        </button> */}

        {/* OR divider */}
        {/* <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "#e0dbd0" }} />
          <span style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#aaa", letterSpacing: "1px" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "#e0dbd0" }} />
        </div> */}

        <form onSubmit={handleSubmit}>
          <Field
            label="Name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={handleInputChange(setName)}
          />
          <Field
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={handleInputChange(setEmail)}
          />
          <Field
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={handleInputChange(setPassword)}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "10px",
              border: "none",
              background: tokens.black,
              color: tokens.white,
              fontFamily: "'Georgia', serif",
              fontSize: "16px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "4px",
              marginBottom: "24px",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "#888", textAlign: "center", margin: 0 }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: tokens.orange, textDecoration: "none", fontWeight: 600 }}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
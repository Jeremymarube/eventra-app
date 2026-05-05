"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
  deepBlue: "#0D1B2A",
  blueBorder: "rgba(255,255,255,0.08)",
  blueMuted: "rgba(255,255,255,0.5)",
};

export default function Header() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  if (isLoggedIn) {
    return null;
  }

  return (
    <header
      style={{
        background: tokens.deepBlue,
        borderBottom: `1px solid ${tokens.blueBorder}`,
        padding: "0 max(16px, 3vw)",
        minHeight: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "2px",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 700,
            fontSize: "clamp(18px, 5vw, 22px)",
            color: tokens.cream,
            letterSpacing: "-0.5px",
          }}
        >
          Eventra
        </span>
        <span
          style={{
            color: tokens.orange,
            fontSize: "clamp(20px, 5vw, 28px)",
            lineHeight: 1,
            marginTop: "-4px",
          }}
        >
          .
        </span>
      </Link>

      {/* Desktop Nav */}
      <nav
        className="header-nav"
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "center",
          marginLeft: "32px",
          marginRight: "auto",
        }}
      >
        <NavLink href="/browse">Browse</NavLink>
        <NavLink href="/categories">Categories</NavLink>
        <NavLink href="/about">About</NavLink>
      </nav>

      {/* Right Actions */}
      <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            color: tokens.blueMuted,
            transition: "color 0.2s",
          }}
          aria-label="Search"
          onMouseEnter={(e) => (e.currentTarget.style.color = tokens.cream)}
          onMouseLeave={(e) => (e.currentTarget.style.color = tokens.blueMuted)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>

        <Link
          href="/login"
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(13px, 2vw, 15px)",
            color: tokens.blueMuted,
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = tokens.cream)}
          onMouseLeave={(e) => (e.currentTarget.style.color = tokens.blueMuted)}
        >
          Sign in
        </Link>

        <Link
          href="/register"
          style={{
            background: tokens.orange,
            border: "none",
            borderRadius: "999px",
            padding: "8px 18px",
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(12px, 2vw, 14px)",
            cursor: "pointer",
            color: tokens.white,
            textDecoration: "none",
            display: "inline-block",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Sign up
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className="header-hamburger"
        aria-label="Open menu"
        onClick={() => setIsMenuOpen((s) => !s)}
        style={{ display: "none" }}
      >
        ☰
      </button>

      {isMenuOpen && (
        <div className="mobile-header-menu" onClick={() => setIsMenuOpen(false)}>
          <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link href="/browse">Browse</Link>
            <Link href="/categories">Categories</Link>
            <Link href="/about">About</Link>
            <Link href="/login">Sign in</Link>
            <Link href="/register">Sign up</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      style={{
        fontFamily: "'Georgia', serif",
        fontSize: "clamp(13px, 2vw, 15px)",
        color: tokens.blueMuted,
        textDecoration: "none",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = tokens.cream)}
      onMouseLeave={(e) => (e.currentTarget.style.color = tokens.blueMuted)}
    >
      {children}
    </Link>
  );
}
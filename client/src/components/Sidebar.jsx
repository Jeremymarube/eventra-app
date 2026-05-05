"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Compass, Grid, Settings, User, LogOut } from "lucide-react";
import NotificationBell from "./NotificationBell";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
  deepBlue: "#0D1B2A",
  blueBorder: "rgba(255,255,255,0.08)",
  blueMuted: "rgba(255,255,255,0.45)",
  blueHover: "rgba(255,255,255,0.06)",
  blueActive: "rgba(255,255,255,0.1)",
};

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Browse", href: "/browse", icon: Compass },
  { label: "Categories", href: "/categories", icon: Grid },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userImage, setUserImage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const closeMobile = () => setIsMobileOpen(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || userData.username || "");
        setUserEmail(userData.email || "");
        setUserImage(userData.image || userData.profile_image || userData.avatar || userData.picture || "");
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [pathname]);

  if (!isLoggedIn) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };


  return (
    <>
      <button
        className="sidebar-hamburger"
        aria-label="Open navigation"
        onClick={() => setIsMobileOpen(true)}
        style={{ display: "none" }}
      >
        ☰
      </button>

      {isMobileOpen && <div className="sidebar-overlay" onClick={closeMobile} />}

      <aside
        className={`app-sidebar ${isMobileOpen ? "open" : ""}`}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "280px",
          height: "100vh",
          background: tokens.deepBlue,
          borderRight: `1px solid ${tokens.blueBorder}`,
          display: "flex",
          flexDirection: "column",
          zIndex: 1000,
          boxShadow: "2px 0 12px rgba(0,0,0,0.2)",
        }}
      >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: `1px solid ${tokens.blueBorder}`,
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span
            style={{
              fontFamily: "'Georgia', serif",
              fontWeight: 700,
              fontSize: "20px",
              color: tokens.cream,
              letterSpacing: "-0.5px",
            }}
          >
            Eventra
          </span>
          <span
            style={{
              color: tokens.orange,
              fontSize: "24px",
              lineHeight: 1,
              marginTop: "-2px",
            }}
          >
            .
          </span>
        </Link>
      </div>

      {/* User Info & Notifications Section - Improved Layout */}
      <div
        style={{
          padding: "20px 16px",
          borderBottom: `1px solid ${tokens.blueBorder}`,
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* User Avatar */}
        <div style={{ position: "relative" }}>
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                objectFit: "cover",
                border: `2px solid ${tokens.blueBorder}`,
              }}
            />
          ) : (
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${tokens.orange}, #FF8C42)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: tokens.white,
                fontWeight: 700,
                fontSize: 20,
              }}
            >
              {userName ? userName[0].toUpperCase() : "U"}
            </div>
          )}
          {/* Online Status Indicator */}
          <div
            style={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#4CAF50",
              border: `2px solid ${tokens.deepBlue}`,
            }}
          />
        </div>

        {/* User Name and Email */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: tokens.cream,
              fontWeight: 600,
              fontSize: 14,
              marginBottom: 4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {userName || "Guest User"}
          </div>
          {userEmail && (
            <div
              style={{
                color: tokens.blueMuted,
                fontSize: 11,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userEmail}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <NotificationBell />
      </div>

      {/* Navigation Links */}
        <nav
        style={{
          flex: 1,
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

            return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "10px",
                textDecoration: "none",
                background: isActive ? tokens.blueActive : "transparent",
                border: isActive ? `1px solid ${tokens.blueBorder}` : "1px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = tokens.blueHover;
                  e.currentTarget.style.transform = "translateX(4px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateX(0)";
                }
              }}
            >
              <Icon
                size={20}
                style={{
                  color: isActive ? tokens.orange : tokens.blueMuted,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? tokens.cream : tokens.blueMuted,
                  letterSpacing: "0.3px",
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  style={{
                    marginLeft: "auto",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: tokens.orange,
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out Button */}
      <div
        style={{
          padding: "16px",
          borderTop: `1px solid ${tokens.blueBorder}`,
        }}
      >
        <button
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "10px",
            background: "none",
            border: `1px solid ${tokens.blueBorder}`,
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "#ff6b6b",
          }}
          onClick={() => { handleLogout(); closeMobile(); }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,107,107,0.1)";
            e.currentTarget.style.borderColor = "#ff6b6b";
            e.currentTarget.style.transform = "translateX(4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.borderColor = tokens.blueBorder;
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <LogOut size={20} />
          Sign out
        </button>
      </div>
    </aside>
    </>
  );
}
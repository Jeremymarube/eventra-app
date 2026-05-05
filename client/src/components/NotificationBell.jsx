// components/NotificationBell.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, Check, Calendar, MapPin } from "lucide-react";

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

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Event Added!",
      message: "Summer Music Festival is now live",
      type: "event",
      time: "2 min ago",
      read: false,
      icon: Calendar,
    },
    {
      id: 2,
      title: "Booking Confirmed",
      message: "Your ticket for Jazz Night has been confirmed",
      type: "booking",
      time: "1 hour ago",
      read: false,
      icon: Check,
    },
    {
      id: 3,
      title: "Event Reminder",
      message: "Tech Conference starts in 3 days",
      type: "reminder",
      time: "5 hours ago",
      read: true,
      icon: MapPin,
    },
  ]);
  
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "relative",
          background: isOpen ? tokens.blueActive : "transparent",
          border: `1px solid ${isOpen ? tokens.blueBorder : "transparent"}`,
          borderRadius: "8px",
          padding: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          color: isOpen ? tokens.orange : tokens.blueMuted,
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.background = tokens.blueHover;
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.background = "transparent";
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: tokens.orange,
              color: "white",
              fontSize: "10px",
              fontWeight: "bold",
              borderRadius: "10px",
              padding: "2px 6px",
              minWidth: "18px",
              height: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: "-80px",
            width: "360px",
            background: tokens.deepBlue,
            border: `1px solid ${tokens.blueBorder}`,
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            overflow: "hidden",
            zIndex: 1001,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${tokens.blueBorder}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                color: tokens.cream,
                fontSize: "16px",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Notifications
            </h3>
            <div style={{ display: "flex", gap: "8px" }}>
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: "none",
                    border: "none",
                    color: tokens.orange,
                    fontSize: "12px",
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = tokens.blueHover}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  style={{
                    background: "none",
                    border: "none",
                    color: tokens.blueMuted,
                    fontSize: "12px",
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = tokens.blueHover}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: tokens.blueMuted,
                }}
              >
                <Bell size={32} style={{ marginBottom: "12px", opacity: 0.3 }} />
                <p style={{ fontSize: "14px", margin: 0 }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    style={{
                      padding: "16px 20px",
                      borderBottom: `1px solid ${tokens.blueBorder}`,
                      display: "flex",
                      gap: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      background: notification.read ? "transparent" : tokens.blueHover,
                      opacity: notification.read ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = tokens.blueActive;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = notification.read ? "transparent" : tokens.blueHover;
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        background: tokens.blueActive,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: tokens.orange,
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                          marginBottom: "4px",
                        }}
                      >
                        <h4
                          style={{
                            color: tokens.cream,
                            fontSize: "14px",
                            fontWeight: notification.read ? 500 : 600,
                            margin: 0,
                          }}
                        >
                          {notification.title}
                        </h4>
                        <span
                          style={{
                            fontSize: "11px",
                            color: tokens.blueMuted,
                          }}
                        >
                          {notification.time}
                        </span>
                      </div>
                      <p
                        style={{
                          color: tokens.blueMuted,
                          fontSize: "13px",
                          margin: 0,
                          lineHeight: 1.4,
                        }}
                      >
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: tokens.orange,
                          alignSelf: "center",
                        }}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
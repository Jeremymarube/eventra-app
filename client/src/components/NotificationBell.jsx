"use client";

import { useState } from "react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([
    "New event near you 🎉",
    "Your booking is confirmed ✅",
  ]);

  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Bell */}
      <button onClick={() => setOpen(!open)} className="relative">
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-3 z-50">
          <h4 className="font-semibold mb-2">Notifications</h4>

          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications</p>
          ) : (
            notifications.map((note, index) => (
              <div
                key={index}
                className="text-sm border-b py-2 last:border-none"
              >
                {note}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
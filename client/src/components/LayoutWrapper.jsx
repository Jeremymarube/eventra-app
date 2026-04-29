"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const hideHeaderOn = ["/login", "/register"];
  const shouldShowHeader = !isLoggedIn && !hideHeaderOn.includes(pathname);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setMounted(true);
  }, []);

  if (!mounted) {
    return children;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {isLoggedIn && <Sidebar />}
      <main
        style={{
          flex: 1,
          width: "100%",
          marginLeft: isLoggedIn ? "280px" : "0",
          transition: "margin-left 0.2s",
        }}
      >
        {shouldShowHeader && <Header />}
        {children}
      </main>
    </div>
  );
}
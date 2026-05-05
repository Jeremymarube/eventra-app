"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const hideHeaderOn = ["/login", "/register"];
  const shouldShowHeader = !isLoggedIn && !hideHeaderOn.includes(pathname);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setMounted(true);

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) return children;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {isLoggedIn && <Sidebar />}
      <main
        style={{
          flex: 1,
          width: "100%",
          marginLeft: isLoggedIn && !isMobile ? "280px" : "0",
          transition: "margin-left 0.2s",
          paddingTop: isLoggedIn && isMobile ? "64px" : "0",
          overflowX: "hidden",
          maxWidth: "100vw",
        }}
      >
        {shouldShowHeader && <Header />}
        {children}
      </main>
    </div>
  );
}
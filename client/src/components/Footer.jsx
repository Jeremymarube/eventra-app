import Link from "next/link";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  orange: "#E8440A",
  deepBlue: "#0D1B2A",
  blueBorder: "rgba(255,255,255,0.08)",
  blueMuted: "rgba(255,255,255,0.4)",
  blueSubtle: "rgba(255,255,255,0.6)",
};

const cols = [
  {
    heading: "DISCOVER",
    links: [
      { label: "Browse all", href: "/browse" },
      { label: "Categories", href: "/categories" },
      { label: "This weekend", href: "/browse?filter=weekend" },
      { label: "Free events", href: "/browse?filter=free" },
    ],
  },
  {
    heading: "COMPANY",
    links: [
      { label: "About", href: "/about" },
      { label: "Creators", href: "/creators" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "LEGAL",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: tokens.deepBlue,
        borderTop: `1px solid ${tokens.blueBorder}`,
        padding: "clamp(32px, 8vw, 64px) max(16px, 3vw)",
      }}
    >
      {/* Main content grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "clamp(32px, 5vw, 48px)",
          marginBottom: "clamp(32px, 5vw, 64px)",
        }}
      >
        {/* Brand column */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              marginBottom: "clamp(12px, 3vw, 20px)",
            }}
          >
            <span
              style={{
                fontFamily: "'Georgia', serif",
                fontWeight: 700,
                fontSize: "clamp(18px, 4vw, 22px)",
                color: tokens.cream,
              }}
            >
              Eventra
            </span>
            <span
              style={{
                color: tokens.orange,
                fontSize: "clamp(20px, 4vw, 28px)",
                lineHeight: 1,
                marginTop: "-4px",
              }}
            >
              .
            </span>
          </div>
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "clamp(12px, 2vw, 13px)",
              color: tokens.blueMuted,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Discover events worth showing up for. From intimate dinners to
            citywide festivals.
          </p>
        </div>

        {/* Link columns */}
        {cols.map((col) => (
          <div key={col.heading}>
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: "clamp(10px, 2vw, 10px)",
                letterSpacing: "2px",
                color: tokens.blueMuted,
                margin: "0 0 clamp(12px, 3vw, 20px)",
                fontWeight: 600,
              }}
            >
              {col.heading}
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(8px, 2vw, 12px)",
              }}
            >
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: "clamp(12px, 2vw, 14px)",
                    color: tokens.blueSubtle,
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = tokens.cream;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = tokens.blueSubtle;
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: `1px solid ${tokens.blueBorder}`,
          paddingTop: "clamp(16px, 3vw, 24px)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "clamp(11px, 2vw, 12px)",
            color: tokens.blueMuted,
            margin: 0,
            textAlign: "center",
          }}
        >
          © 2026 Eventra. Made for people who show up.
        </p>
      </div>
    </footer>
  );
}
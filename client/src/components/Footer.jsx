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

const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com/eventra",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/eventra",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com/eventra",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@eventra",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
      </svg>
    ),
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
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
              margin: "0 0 24px",
            }}
          >
            Discover events worth showing up for. From intimate dinners to
            citywide festivals.
          </p>

          {/* Follow us */}
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "10px",
              letterSpacing: "2px",
              color: tokens.blueMuted,
              margin: "0 0 12px",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Follow us
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                title={social.label}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${tokens.blueBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: tokens.blueMuted,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = tokens.orange;
                  e.currentTarget.style.borderColor = tokens.orange;
                  e.currentTarget.style.color = tokens.cream;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.borderColor = tokens.blueBorder;
                  e.currentTarget.style.color = tokens.blueMuted;
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {cols.map((col) => (
          <div key={col.heading}>
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: "10px",
                letterSpacing: "2px",
                color: tokens.blueMuted,
                margin: "0 0 clamp(12px, 3vw, 20px)",
                fontWeight: 600,
                textTransform: "uppercase",
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
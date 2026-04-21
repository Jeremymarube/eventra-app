const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  orange: "#E8440A",
};

const cols = [
  {
    heading: "DISCOVER",
    links: ["Browse all", "Categories", "This weekend", "Free events"],
  },
  {
    heading: "COMPANY",
    links: ["About", "Hosts", "Press", "Contact"],
  },
  {
    heading: "LEGAL",
    links: ["Terms", "Privacy", "Cookies"],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: tokens.cream, borderTop: "1px solid #e0dbd0", padding: "64px 48px 40px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "48px", marginBottom: "64px" }}>
        {/* Brand column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "2px", marginBottom: "20px" }}>
            <span
              style={{
                fontFamily: "'Georgia', serif",
                fontWeight: 700,
                fontSize: "22px",
                color: tokens.black,
              }}
            >
              Eventra
            </span>
            <span style={{ color: tokens.orange, fontSize: "28px", lineHeight: 1, marginTop: "-4px" }}>.</span>
          </div>
          <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: "#888", lineHeight: 1.6, margin: 0 }}>
            Discover events worth showing up for. From intimate dinners to citywide festivals.
          </p>
        </div>

        {/* Link columns */}
        {cols.map((col) => (
          <div key={col.heading}>
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: "10px",
                letterSpacing: "2px",
                color: "#aaa",
                margin: "0 0 20px",
                fontWeight: 600,
              }}
            >
              {col.heading}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {col.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: "14px",
                    color: tokens.black,
                    textDecoration: "none",
                    opacity: 0.8,
                  }}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid #e0dbd0",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#aaa", margin: 0 }}>
          © 2026 Eventra. Made for people who show up.
        </p>
        <p style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#aaa", margin: 0 }}>
          Issue No. 01 — Volume 2026
        </p>
      </div>
    </footer>
  );
}
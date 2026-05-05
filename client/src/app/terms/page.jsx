"use client";

const tokens = {
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
  deepBlue: "#0D1B2A",
  cream: "#F5F0E8",
  gray: "#666666",
  lightGray: "#f7f7f7",
  borderGray: "#e5e5e5",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing or using Eventra, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.",
  },
  {
    title: "2. Use of the Platform",
    content: "Eventra is a platform for discovering and hosting events. You agree to use the platform only for lawful purposes and in accordance with these terms. You must be at least 18 years old to create an account or host events.",
  },
  {
    title: "3. Account Responsibility",
    content: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. Eventra is not liable for any loss or damage arising from your failure to comply with this obligation.",
  },
  {
    title: "4. Event Listings",
    content: "Hosts are solely responsible for the accuracy of their event listings, including date, time, location, pricing, and description. Eventra reserves the right to remove any listing that violates our community guidelines or applicable laws.",
  },
  {
    title: "5. Payments & Refunds",
    content: "Ticket payments are processed through our payment partners. Refund policies are set by individual event hosts. Eventra facilitates but does not guarantee refunds. In the event of cancellation by the host, Eventra will work to ensure attendees are notified promptly.",
  },
  {
    title: "6. Intellectual Property",
    content: "All content on Eventra, including logos, design, and code, is the property of Eventra or its licensors. You may not reproduce, distribute, or create derivative works without explicit written permission.",
  },
  {
    title: "7. Limitation of Liability",
    content: "Eventra is not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid for the service in question.",
  },
  {
    title: "8. Changes to Terms",
    content: "We may update these terms from time to time. We will notify you of significant changes via email or a prominent notice on the platform. Continued use of Eventra after changes constitutes acceptance of the new terms.",
  },
  {
    title: "9. Contact",
    content: "For questions about these terms, contact us at legal@eventra.co.ke.",
  },
];

export default function TermsPage() {
  return (
    <div style={{ background: tokens.white, minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ background: tokens.deepBlue, padding: "72px max(20px, 5vw)" }}>
        <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "3px", color: tokens.orange, fontWeight: 700, textTransform: "uppercase", margin: "0 0 12px" }}>Legal</p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, color: tokens.cream, margin: "0 0 16px", letterSpacing: "-1px" }}>
          Terms of Service
        </h1>
        <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "rgba(245,240,232,0.5)", margin: 0 }}>
          Last updated: January 1, 2026
        </p>
      </section>

      {/* Content */}
      <section style={{ padding: "72px max(20px, 5vw)", maxWidth: "760px", margin: "0 auto" }}>
        <p style={{ fontFamily: "sans-serif", fontSize: "16px", color: tokens.gray, lineHeight: 1.8, margin: "0 0 48px", padding: "24px", background: tokens.lightGray, borderRadius: "12px", borderLeft: `4px solid ${tokens.orange}` }}>
          Please read these Terms of Service carefully before using Eventra. These terms govern your use of our platform and services.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {sections.map((section) => (
            <div key={section.title} style={{ borderBottom: `1px solid ${tokens.borderGray}`, paddingBottom: "40px" }}>
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "22px", fontWeight: 700, color: tokens.black, margin: "0 0 16px" }}>
                {section.title}
              </h2>
              <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: tokens.gray, lineHeight: 1.8, margin: 0 }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
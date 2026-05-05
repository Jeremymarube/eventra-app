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
    title: "1. Information We Collect",
    content: "We collect information you provide directly to us, such as your name, email address, and payment information when you create an account or purchase tickets. We also collect information about how you use our platform, including event views, searches, and bookings.",
  },
  {
    title: "2. How We Use Your Information",
    content: "We use the information we collect to provide, maintain, and improve our services; process transactions and send related information including confirmations and receipts; send you technical notices and support messages; and communicate with you about events, offers, and news.",
  },
  {
    title: "3. Information Sharing",
    content: "We do not sell your personal information. We may share your information with event hosts when you book their events (name and email for ticket delivery), payment processors to complete transactions, and service providers who assist in our operations. We may also disclose information if required by law.",
  },
  {
    title: "4. Data Storage & Security",
    content: "Your data is stored securely on servers located in the European Union. We use industry-standard encryption and security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.",
  },
  {
    title: "5. Cookies",
    content: "We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. See our Cookie Policy for more details.",
  },
  {
    title: "6. Your Rights",
    content: "You have the right to access, update, or delete your personal information at any time through your account settings. You may also request a copy of your data or ask us to restrict processing. To exercise these rights, contact us at privacy@eventra.co.ke.",
  },
  {
    title: "7. Children's Privacy",
    content: "Eventra is not directed to children under 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.",
  },
  {
    title: "8. Changes to This Policy",
    content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the 'Last updated' date. Your continued use of Eventra after changes constitutes acceptance.",
  },
  {
    title: "9. Contact Us",
    content: "If you have questions about this Privacy Policy, please contact our Data Protection Officer at privacy@eventra.co.ke.",
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ background: tokens.white, minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ background: tokens.deepBlue, padding: "72px max(20px, 5vw)" }}>
        <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "3px", color: tokens.orange, fontWeight: 700, textTransform: "uppercase", margin: "0 0 12px" }}>Legal</p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, color: tokens.cream, margin: "0 0 16px", letterSpacing: "-1px" }}>
          Privacy Policy
        </h1>
        <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "rgba(245,240,232,0.5)", margin: 0 }}>
          Last updated: January 1, 2026
        </p>
      </section>

      {/* Content */}
      <section style={{ padding: "72px max(20px, 5vw)", maxWidth: "760px", margin: "0 auto" }}>
        <p style={{ fontFamily: "sans-serif", fontSize: "16px", color: tokens.gray, lineHeight: 1.8, margin: "0 0 48px", padding: "24px", background: tokens.lightGray, borderRadius: "12px", borderLeft: `4px solid ${tokens.orange}` }}>
          Your privacy matters to us. This policy explains what data we collect, how we use it, and your rights regarding your personal information.
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
"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "../../components/Footer";

const tokens = {
  cream: "#F5F0E8",
  black: "#1a1a1a",
  white: "#ffffff",
  orange: "#E8440A",
};

const categories = [
  { n: "01", label: "Music", slug: "music", description: "Live sets, DJ nights, intimate gigs, and stadium shows.", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80" },
  { n: "02", label: "Tech", slug: "tech", description: "Conferences, hackathons, product launches, and meetups.", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" },
  { n: "03", label: "Food & Drink", slug: "food-drink", description: "Tastings, pop-up dinners, cooking classes, and markets.", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80" },
  { n: "04", label: "Art", slug: "art", description: "Gallery openings, studio tours, art fairs, and installations.", img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80" },
  { n: "05", label: "Sports", slug: "sports", description: "Runs, matches, fitness classes, and outdoor adventures.", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80" },
  { n: "06", label: "Business", slug: "business", description: "Networking events, panels, workshops, and trade shows.", img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80" },
  { n: "07", label: "Wellness", slug: "wellness", description: "Yoga, meditation, sound baths, and slow mornings.", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" },
  { n: "08", label: "Community", slug: "community", description: "Block parties, volunteer days, local markets, and talks.", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80" },
  { n: "09", label: "Nightlife", slug: "nightlife", description: "Club nights, rooftop bars, late-night sets, and afterparties.", img: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80" },
  { n: "10", label: "Other", slug: "other", description: "Everything that doesn't fit a box — but still worth your time.", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80" },
];

function CategoryCard({ cat }) {
  return (
    <Link
      href={`/browse?category=${cat.slug}`}
      style={{
        borderRadius: "20px",
        overflow: "hidden",
        textDecoration: "none",
        color: tokens.white,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "340px",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.querySelector(".overlay").style.background =
          "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.querySelector(".overlay").style.background =
          "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.05) 55%, transparent 100%)";
      }}
    >
      <img
        src={cat.img}
        alt={cat.label}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        className="overlay"
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.05) 55%, transparent 100%)",
          transition: "background 0.3s",
        }}
      />
      <div style={{ position: "absolute", top: "18px", left: "18px", fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "1px", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
        N°{cat.n}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 22px" }}>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "28px", fontWeight: 900, margin: "0 0 6px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
          {cat.label}
        </h2>
        <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.75)", margin: "0 0 14px", lineHeight: 1.5 }}>
          {cat.description}
        </p>
        <span style={{ fontFamily: "sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
          Browse all <span>›</span>
        </span>
      </div>
    </Link>
  );
}

export default function CategoriesPage() {
  return (
    <div style={{ minHeight: "100vh", background: tokens.cream }}>
      <main style={{ padding: "56px 48px 80px" }}>
        <p style={{ fontFamily: "sans-serif", fontSize: "11px", letterSpacing: "2px", color: "#999", margin: "0 0 12px", fontWeight: 600 }}>
          INDEX
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(52px, 6vw, 80px)", fontWeight: 900, color: tokens.black, margin: "0 0 16px", letterSpacing: "-2px", lineHeight: 1.0 }}>
          All{" "}
          <em style={{ color: tokens.orange, fontStyle: "italic" }}>departments</em>
          <span style={{ color: tokens.black }}>.</span>
        </h1>
        <p style={{ fontFamily: "sans-serif", fontSize: "15px", color: "#777", margin: "0 0 56px" }}>
          Pick a thread and follow it. Every category is its own little universe.
        </p>
        <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {categories.map((cat) => (
            <CategoryCard key={cat.n} cat={cat} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

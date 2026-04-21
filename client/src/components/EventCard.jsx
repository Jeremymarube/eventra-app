import Link from "next/link";
//import { CATEGORY_LABELS, formatEventDate, formatPrice } from "@/lib/format";
import { MapPin } from "lucide-react";
const CATEGORY_FALLBACK = {
  music: "/images/event-music.jpg",
  food: "/images/event-food.jpg",
  tech: "/images/event-tech.jpg",
  art: "/images/event-art.jpg",
  wellness: "/images/event-wellness.jpg",
  nightlife: "/images/event-nightlife.jpg",
  sports: "/images/hero-event.jpg",
  business: "/images/event-tech.jpg",
  community: "/images/hero-event.jpg",
  other: "/images/hero-event.jpg",
};

// const CATEGORY_FALLBACK = {
//   music: musicImg, food: foodImg, tech: techImg, art: artImg,
//   wellness: wellnessImg, nightlife: nightlifeImg,
//   sports: heroImg, business: techImg, community: heroImg, other: heroImg,
// };

export function resolveCover(url, category) {
  if (!url || url.startsWith("/src/")) return CATEGORY_FALLBACK[category] ?? heroImg;
  return url;
}

export function EventCard({ event, priority = false }) {
  const date = formatEventDate(event.starts_at);
  return (
    <Link
      href={`/event/${event.id}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-2xl"
    >
      <article className="relative overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-500 ease-smooth group-hover:-translate-y-1 group-hover:shadow-elegant">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <img
            src={resolveCover(event.cover_image_url, event.category)}
            alt={event.title}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />

          {/* Date block */}
          <div className="absolute left-4 top-4 flex flex-col items-center justify-center rounded-lg bg-background/95 px-3 py-2 shadow-card backdrop-blur">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{date.month}</span>
            <span className="display-serif text-2xl font-bold leading-none text-foreground">{date.day}</span>
          </div>

          {/* Category chip */}
          <div className="absolute right-4 top-4">
            <span className="rounded-full bg-background/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">
              {CATEGORY_LABELS[event.category] ?? event.category}
            </span>
          </div>

          {/* Title overlay */}
          <div className="absolute inset-x-0 bottom-0 p-5 text-background">
            <h3 className="display-serif text-xl font-bold leading-tight text-balance line-clamp-2">
              {event.title}
            </h3>
            {event.location_name && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-background/85">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{event.location_name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-1 pt-3">
          <span className="text-xs text-muted-foreground">{date.weekday} · {date.time}</span>
          <span className="text-sm font-bold text-foreground">{formatPrice(event.price_cents, event.currency)}</span>
        </div>
      </article>
    </Link>
  );
}
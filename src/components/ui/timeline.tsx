// Built using Hyperiux Vault & Customized for GWD Platform
"use client";

import {
  type CSSProperties,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function useGSAP(
  callback: () => void | (() => void),
  options?: {
    dependencies?: unknown[];
    scope?: { current: Element | null } | Element | null;
  }
) {
  const deps = options?.dependencies ?? [];
  const scope = options?.scope;
  const ctxRef = useRef<gsap.Context | null>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  useLayoutEffect(() => {
    const el =
      scope && typeof scope === "object" && "current" in scope
        ? scope.current
        : (scope as Element | null);
    ctxRef.current = gsap.context(() => {}, el ?? undefined);
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!ctxRef.current) return;
    cleanupRef.current?.();
    const ret = ctxRef.current.add(callback);
    cleanupRef.current = typeof ret === "function" ? ret : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

const monthOrder: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

export type JourneyItem = {
  id: string;
  year: string;
  month: string;
  headline?: string;
  content: string;
  image?: string;
  track?: "top" | "bottom";
};

export type TimelineProps = {
  title?: string;
  periodLabel?: string;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  imageUrl?: string;
  imageAlt?: string;
  duration?: number;
  scrollDuration?: number;
  items?: JourneyItem[];
  topItems?: JourneyItem[];
  bottomItems?: JourneyItem[];
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
}

// Strict Chronological Milestones (Alternating Top / Bottom along the rail)
export const DEFAULT_TOP_JOURNEY: JourneyItem[] = [
  {
    id: "2024-march",
    year: "2024",
    month: "March",
    headline: "Idea Inception at VJIT Campus",
    content: "Conceived by student founders with a single conviction: real learning happens by shipping production work.",
    image: "/img/vjit-inauguration.jpg",
    track: "top",
  },
  {
    id: "2024-november",
    year: "2024",
    month: "November",
    headline: "First 48-Hour Live Builder Sprint",
    content: "Student builders sprinted to ship 8 live prototypes with real operator feedback and panel evaluations.",
    image: "/img/img3.jpg",
    track: "top",
  },
  {
    id: "2025-august",
    year: "2025",
    month: "August",
    headline: "GWD Sports OS Powers Hyderabad League",
    content: "IT partnership launches real-time digital player passports and match operations for 10 football clubs.",
    image: "/img/visit-match.jpg",
    track: "top",
  },
  {
    id: "2026-may",
    year: "2026",
    month: "May",
    headline: "Multi-Campus Expansion & Showcase",
    content: "Expansion across Telangana engineering colleges with enterprise client delivery and tournament operations.",
    image: "/img/visit-workstation.jpg",
    track: "top",
  },
];

export const DEFAULT_BOTTOM_JOURNEY: JourneyItem[] = [
  {
    id: "2024-july",
    year: "2024",
    month: "July",
    headline: "Engineering Guild Cohort Onboarded",
    content: "Founding cohort of 30+ cross-disciplinary builders onboarded across full-stack tech, design, and media.",
    image: "/img/visit-team.jpg",
    track: "bottom",
  },
  {
    id: "2025-march",
    year: "2025",
    month: "March",
    headline: "Corporate Incorporation & CIN Grant",
    content: "GWD Global Pvt Ltd officially incorporated as a corporate entity with headquarters in Madhapur, Hyderabad.",
    image: "/img/visit-conversation.jpg",
    track: "bottom",
  },
  {
    id: "2025-november",
    year: "2025",
    month: "November",
    headline: "Global Delivery: 230+ Shipped Releases",
    content: "International client engineering pipelines cross 230 deliverables spanning North America, Europe, and Asia.",
    image: "/img/visit-behind-scenes.jpg",
    track: "bottom",
  },
];

export const DEFAULT_JOURNEY_ITEMS: JourneyItem[] = [
  ...DEFAULT_TOP_JOURNEY,
  ...DEFAULT_BOTTOM_JOURNEY,
];

export default function Timeline({
  title = "Events Storyline",
  periodLabel = "2024 — 2026",
  textColor = "var(--color-foreground, #121212)",
  mutedTextColor = "var(--color-muted-foreground, #4A4A4A)",
  activeColor = "#C41E1E",
  backgroundColor = "var(--color-background, #ffffff)",
  imageUrl = "/img/vjit-inauguration.jpg",
  imageAlt = "GWD Timeline & Milestones",
  duration,
  scrollDuration = 1.2,
  items,
  topItems,
  bottomItems,
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wholeSliderRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const animationDuration = duration ?? scrollDuration;
  const normalizedDuration = Math.max(0.2, animationDuration);

  // Lightbox modal state for viewing attached photos
  const [selectedPhoto, setSelectedPhoto] = useState<{
    src: string;
    title: string;
    caption: string;
  } | null>(null);

  const sectionStyle: CSSProperties = {
    color: textColor,
    backgroundColor,
  };
  const activeStyle: CSSProperties = {
    backgroundColor: activeColor,
  };
  const mutedTextStyle: CSSProperties = {
    color: mutedTextColor,
  };

  // 1. Gather all items into a single master pool
  const rawItems: JourneyItem[] =
    items && items.length > 0
      ? items
      : (topItems && topItems.length > 0) || (bottomItems && bottomItems.length > 0)
      ? [...(topItems || []), ...(bottomItems || [])]
      : DEFAULT_JOURNEY_ITEMS;

  // 2. Sort strictly chronologically by year then month
  const sortedItems = [...rawItems].sort((a, b) => {
    const yearDiff = Number(a.year) - Number(b.year);
    if (yearDiff !== 0) return yearDiff;
    const mA = monthOrder[a.month] || 0;
    const mB = monthOrder[b.month] || 0;
    return mA - mB;
  });

  // 3. Strictly alternate top and bottom tracks so milestones NEVER sit in a straight line
  const processedItems = sortedItems.map((item, index) => {
    const track: "top" | "bottom" = index % 2 === 0 ? "top" : "bottom";
    return {
      ...item,
      track,
    };
  });

  // GSAP Horizontal Slide & Active Rail Fill
  useGSAP(() => {
    const section = sectionRef.current;
    const slider = wholeSliderRef.current;
    if (!section || !slider) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
      defaults: {
        ease: "none",
      },
    });

    // Animate slider across total scrollWidth so all milestones are accessible
    tl.fromTo(
      slider,
      { x: 0 },
      {
        x: () => -(slider.scrollWidth - window.innerWidth + 80),
        ease: "none",
      }
    );

    if (reducedMotion) {
      gsap.set(".journey-line", { width: "100%" });
      return;
    }

    // Active red line draws progressively from start to end of section
    gsap.fromTo(
      ".journey-line",
      { width: "0%" },
      {
        width: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      }
    );
  }, { dependencies: [reducedMotion, processedItems], scope: sectionRef });

  // GSAP Milestone Reveals (Dot, Stem, Badge, Headline, Photo, Text)
  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      processedItems.forEach((item) => {
        gsap.set(`.jl-${item.id}`, { scaleY: 1 });
        gsap.set(`.jd-${item.id}`, { scale: 1 });
        gsap.set(`.badge-${item.id}`, { opacity: 1, y: 0 });
        gsap.set(`.photo-${item.id}`, { opacity: 1, scale: 1, y: 0 });
        gsap.set(`.title-${item.id}`, { opacity: 1, y: 0 });
        gsap.set(`.description-${item.id}`, { opacity: 1, y: 0 });
      });
      return;
    }

    // Initialize all items as HIDDEN before scroll reaches them
    processedItems.forEach((item) => {
      const isTop = item.track === "top";
      gsap.set(`.jl-${item.id}`, {
        scaleY: 0,
        transformOrigin: isTop ? "bottom center" : "top center",
      });
      gsap.set(`.jd-${item.id}`, { scale: 0 });
      gsap.set(`.badge-${item.id}`, { opacity: 0, y: isTop ? -10 : 10 });
      gsap.set(`.photo-${item.id}`, { opacity: 0, y: isTop ? -14 : 14, scale: 0.94 });
      gsap.set(`.title-${item.id}`, { opacity: 0, y: isTop ? -8 : 8 });
      gsap.set(`.description-${item.id}`, { opacity: 0, y: isTop ? -8 : 8 });
    });

    // Create a sequenced reveal timeline for each milestone
    const totalCount = processedItems.length;
    const startRange = 6;
    const endRange = 88;
    const step = totalCount > 1 ? (endRange - startRange) / (totalCount - 1) : 10;
    const span = 14;

    processedItems.forEach((item, index) => {
      const isTop = item.track === "top";
      const startPos = startRange + index * step;
      const endPos = Math.min(99, startPos + span);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: `${startPos}% top`,
          end: `${endPos}% top`,
          scrub: true,
        },
      });

      timeline
        // 1. Stem draws outward from the center rail
        .to(`.jl-${item.id}`, {
          scaleY: 1,
          duration: normalizedDuration * 0.35,
          ease: "power2.out",
        })
        // 2. Center rail dot pops in
        .to(
          `.jd-${item.id}`,
          {
            scale: 1,
            duration: normalizedDuration * 0.3,
            ease: "back.out(2)",
          },
          "<+=0.05"
        )
        // 3. Date badge slides in
        .to(
          `.badge-${item.id}`,
          {
            opacity: 1,
            y: 0,
            duration: normalizedDuration * 0.35,
            ease: "power2.out",
          },
          "<"
        )
        // 4. Headline reveals
        .to(
          `.title-${item.id}`,
          {
            opacity: 1,
            y: 0,
            duration: normalizedDuration * 0.4,
            ease: "power2.out",
          },
          "<+=0.05"
        )
        // 5. Photo preview smoothly scales and fades in
        .to(
          `.photo-${item.id}`,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: normalizedDuration * 0.45,
            ease: "power2.out",
          },
          "<+=0.05"
        )
        // 6. Story description reveals
        .to(
          `.description-${item.id}`,
          {
            opacity: 1,
            y: 0,
            duration: normalizedDuration * 0.4,
            ease: "power2.out",
          },
          "<+=0.05"
        );
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, { dependencies: [normalizedDuration, reducedMotion, processedItems], scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="h-[280vw] max-[600px]:h-[440vh] w-full relative"
      style={sectionStyle}
    >
      {/* 
        Sticky container pinned safely below navbar (76px)
      */}
      <div
        className="w-full sticky overflow-hidden flex items-center"
        style={{
          top: "76px",
          height: "calc(100vh - 76px)",
        }}
      >
        <div
          ref={wholeSliderRef}
          className="flex items-center gap-[4vw] max-[600px]:gap-[6vw]"
          style={{
            height: "clamp(560px, 68vh, 760px)",
            width: `${Math.max(180, 50 + processedItems.length * 28)}vw`,
            paddingLeft: "clamp(2rem, 4vw, 5rem)",
            paddingRight: "clamp(6rem, 12vw, 16rem)",
          }}
        >
          {/* Executive Editorial Cover Card */}
          <div
            className="h-full shrink-0 overflow-hidden rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 relative flex flex-col justify-between"
            style={{
              width: "clamp(280px, 22vw, 360px)",
              background: "#121212",
              position: "relative",
            }}
          >
            <img
              src={imageUrl}
              alt={imageAlt}
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover opacity-85"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30 pointer-events-none" style={{ position: "absolute", inset: 0 }} />

            <div className="relative z-10 p-6 flex flex-col justify-between h-full text-white pointer-events-none">
              <div>
                <span className="inline-block px-2.5 py-1 rounded text-xs font-mono font-bold tracking-widest uppercase bg-red-600 text-white mb-3">
                  ✦ GWD CHRONICLE
                </span>
                <h3 className="text-xl lg:text-2xl font-bold tracking-tight leading-snug">
                  Pre-Deployment & Shipped Deliverables
                </h3>
              </div>

              <div>
                <p className="text-xs text-white/75 leading-relaxed">
                  Chronicle of student initiatives, tournament software, and enterprise launches from 2024 to present.
                </p>
                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-mono text-white/60">
                  <span>GWD GLOBAL</span>
                  <span>{periodLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chronicle Intro Header */}
          <div
            className="shrink-0 pr-2 flex flex-col justify-center"
            style={{ width: "clamp(120px, 10vw, 180px)" }}
          >
            <span className="text-[11px] uppercase font-mono tracking-widest text-red-600 font-semibold block mb-1">
              Chronicle
            </span>
            <h2
              className="text-xl lg:text-2xl font-bold tracking-tight leading-tight text-foreground"
              style={{ fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)' }}
            >
              {title}
            </h2>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-2">
              {periodLabel}
            </p>
          </div>

          {/* Unified Timeline Track Area with Continuous Center Rail */}
          <div className="relative h-full flex items-center gap-[4vw] lg:gap-[5vw] flex-1">
            {/* 
              CENTER HORIZONTAL RAIL
              Continuous background guide rail across all milestones + active red fill
            */}
            <div className="w-full absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <div
                className="w-full h-[2px] rounded-full absolute left-0 top-1/2 -translate-y-1/2"
                style={{ backgroundColor: "rgba(196, 30, 30, 0.18)" }}
              />
              <div
                className="h-[2px] w-[0%] rounded-full absolute left-0 top-1/2 -translate-y-1/2 journey-line"
                style={activeStyle}
              />
            </div>

            {/* Alternating Milestone Columns (Even = Top, Odd = Bottom) */}
            {processedItems.map((item) => {
              const isTop = item.track === "top";
              return (
                <div
                  key={item.id}
                  className="relative shrink-0 flex flex-col justify-center items-center h-full"
                  style={{
                    width: "clamp(240px, 19vw, 290px)",
                  }}
                >
                  {/* Central Dot on the rail */}
                  <div
                    className={`size-3.5 rounded-full z-20 jd-${item.id} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                    style={{
                      ...activeStyle,
                      boxShadow: "0 0 0 4px rgba(196, 30, 30, 0.2)",
                    }}
                  />

                  {/* Vertical Connector Stem (extends outward from center rail to the card) */}
                  <div
                    className={`w-[2px] rounded-full jl-${item.id} absolute left-1/2 -translate-x-1/2 z-10`}
                    style={{
                      ...activeStyle,
                      ...(isTop
                        ? {
                            bottom: "calc(50% + 7px)",
                            height: "28px",
                            transformOrigin: "bottom center",
                          }
                        : {
                            top: "calc(50% + 7px)",
                            height: "28px",
                            transformOrigin: "top center",
                          }),
                    }}
                  />

                  {/* Milestone Content Card */}
                  <div
                    className="absolute left-0 right-0 flex flex-col gap-1.5"
                    style={{
                      ...(isTop
                        ? {
                            bottom: "calc(50% + 38px)",
                          }
                        : {
                            top: "calc(50% + 38px)",
                          }),
                      padding: "0 0.5rem",
                    }}
                  >
                    {/* 1. Date Badge */}
                    <div className={`badge-${item.id} flex items-center gap-2`}>
                      <span
                        className="text-[11px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: "rgba(196, 30, 30, 0.1)",
                          color: "var(--brand-red, #C41E1E)",
                        }}
                      >
                        {item.year}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.month}
                      </span>
                    </div>

                    {/* 2. Milestone Headline */}
                    <h4
                      className={`title-${item.id} text-sm lg:text-base font-bold tracking-tight leading-snug text-foreground`}
                      style={{ fontFamily: 'var(--font-display, "Space Grotesk", sans-serif)' }}
                    >
                      {item.headline || `${item.year} ${item.month}`}
                    </h4>

                    {/* 3. Photo Preview */}
                    {item.image && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedPhoto({
                            src: item.image!,
                            title: item.headline || `${item.month} ${item.year}`,
                            caption: item.content,
                          })
                        }
                        className={`photo-${item.id} group relative block overflow-hidden rounded-xl border border-black/10 dark:border-white/10 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] text-left cursor-pointer my-0.5`}
                        style={{
                          width: "clamp(200px, 18vw, 260px)",
                          height: "clamp(85px, 8vw, 110px)",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.headline || `${item.year} ${item.month}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                          <span className="text-white text-[10px] font-medium tracking-wide flex items-center gap-1">
                            <span>🔍</span> View full photo
                          </span>
                        </div>
                      </button>
                    )}

                    {/* 4. Description */}
                    <p
                      className={`description-${item.id} text-xs leading-normal text-muted-foreground max-w-[270px] line-clamp-2`}
                      style={mutedTextStyle}
                    >
                      {item.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Photo Preview Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-white/20"
          >
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="max-h-full max-w-full object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center text-sm hover:bg-black transition-colors"
                aria-label="Close photo preview"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {selectedPhoto.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

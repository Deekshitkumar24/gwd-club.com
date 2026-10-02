'use client';

import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

export interface ParallaxImageData {
  src: string;
  alt: string;
  start: number;
  end: number;
  className: string;
}

export interface SmoothScrollHeroProps {
  centerImage?: string;
  parallaxImages?: ParallaxImageData[];
  className?: string;
}

// Authentic GWD builder photographs from e:\gwd\img
const DEFAULT_CENTER_IMAGE = "/img/vjit-inauguration.jpg";

const DEFAULT_PARALLAX_IMAGES: ParallaxImageData[] = [
  {
    src: "/img/visit-conversation.jpg",
    alt: "Technical Strategy & Squad Architecture",
    start: -220,
    end: 220,
    className: "w-5/12 rounded-2xl shadow-2xl border border-white/20 overflow-hidden",
  },
  {
    src: "/img/visit-match.jpg",
    alt: "GWD Grassroots Football Tournament Matchday",
    start: 220,
    end: -260,
    className: "mx-auto w-7/12 rounded-2xl shadow-2xl border border-white/20 overflow-hidden",
  },
  {
    src: "/img/visit-workstation.jpg",
    alt: "Live Event Operations & Scoring Station",
    start: -200,
    end: 200,
    className: "ml-auto w-5/12 rounded-2xl shadow-2xl border border-white/20 overflow-hidden",
  },
  {
    src: "/img/visit-training.jpg",
    alt: "Squad Formation & Player Verification",
    start: 0,
    end: -480,
    className: "ml-16 w-1/2 rounded-2xl shadow-2xl border border-white/20 overflow-hidden",
  },
  {
    src: "/img/visit-team.jpg",
    alt: "Cross-Disciplinary Student Builder Collective",
    start: -180,
    end: 280,
    className: "mr-12 w-6/12 ml-auto rounded-2xl shadow-2xl border border-white/20 overflow-hidden",
  },
];

const SECTION_HEIGHT = 1600;

export const SmoothScrollHero: React.FC<SmoothScrollHeroProps> = ({
  centerImage = DEFAULT_CENTER_IMAGE,
  parallaxImages = DEFAULT_PARALLAX_IMAGES,
  className = "",
}) => {
  return (
    <div
      data-dye-section="gallery"
      className={`relative w-full bg-transparent text-white overflow-visible ${className}`}
    >
      <Hero centerImage={centerImage} parallaxImages={parallaxImages} />
    </div>
  );
};

interface HeroProps {
  centerImage: string;
  parallaxImages: ParallaxImageData[];
}

const Hero: React.FC<HeroProps> = ({ centerImage, parallaxImages }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Container-relative scroll tracking: starts when section hits top of viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full overflow-visible"
    >
      {/* Background Center Image with polygon clipPath expansion */}
      <CenterImage scrollProgress={scrollYProgress} centerImage={centerImage} />

      {/* Floating Parallax Images */}
      <ParallaxImagesList images={parallaxImages} />

      {/* Subtle fade to maintain depth while letting DyeWhorl fluid show through */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-black/20 to-transparent pointer-events-none" />
    </div>
  );
};

interface CenterImageProps {
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  centerImage: string;
}

const CenterImage: React.FC<CenterImageProps> = ({
  scrollProgress,
  centerImage,
}) => {
  // Polygon clip expansion: starts centered at 22% inset, expands smoothly to full bleed (0% to 100%)
  const clip1 = useTransform(scrollProgress, [0, 0.65], [22, 0]);
  const clip2 = useTransform(scrollProgress, [0, 0.65], [78, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollProgress,
    [0, 0.85],
    ["160%", "100%"]
  );
  const opacity = useTransform(
    scrollProgress,
    [0.85, 1],
    [1, 0.15]
  );

  return (
    <motion.div
      className="sticky top-0 h-screen w-full shadow-2xl"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage: `url(${centerImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Subtle vignette border inside the expanding center image */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
    </motion.div>
  );
};

interface ParallaxImagesListProps {
  images: ParallaxImageData[];
}

const ParallaxImagesList: React.FC<ParallaxImagesListProps> = ({ images }) => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[180px] pointer-events-none relative z-10 space-y-24">
      {images.map((img, idx) => (
        <ParallaxImg
          key={`${img.src}-${idx}`}
          src={img.src}
          alt={img.alt}
          start={img.start}
          end={img.end}
          className={img.className}
        />
      ))}
    </div>
  );
};

interface ParallaxImgProps {
  className?: string;
  alt: string;
  src: string;
  start: number;
  end: number;
}

const ParallaxImg: React.FC<ParallaxImgProps> = ({
  className,
  alt,
  src,
  start,
  end,
}) => {
  const ref = useRef<HTMLImageElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.7, 1], [1, 0.1]);
  const scale = useTransform(scrollYProgress, [0.7, 1], [1, 0.88]);

  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.div
      ref={ref}
      style={{ transform, opacity }}
      className={`relative backdrop-blur-[2px] ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        draggable={false}
        className="w-full h-auto object-cover rounded-2xl"
      />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
};

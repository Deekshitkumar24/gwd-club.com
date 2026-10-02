"use client";

import React from "react";
import { BsAmazon, BsGoogle, BsSpotify, BsYoutube } from "react-icons/bs";
import { CLIENT_PARTNERS, INSTITUTIONAL_PARTNERS } from "@/data/content";

export const BrandScroller = () => {
  return (
    <>
      <div className="group flex overflow-hidden py-2 [--gap:2rem] [gap:var(--gap)] flex-row max-w-full [--duration:40s] [mask-image:linear-gradient(to_right,_rgba(0,_0,_0,_0),rgba(0,_0,_0,_1)_10%,rgba(0,_0,_0,_1)_90%,rgba(0,_0,_0,_0))]">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row"
              key={i}
            >
              <div className="flex items-center w-28 gap-3">
                <BsSpotify size={24} />
                <p className="text-lg font-semibold opacity-80">Spotify</p>
              </div>
              <div className="flex items-center w-28 gap-3">
                <BsYoutube size={24} />
                <p className="text-lg font-semibold opacity-80">YouTube</p>
              </div>
              <div className="flex items-center w-28 gap-3">
                <BsAmazon size={24} />
                <p className="text-lg font-semibold opacity-80">Amazon</p>
              </div>

              <div className="flex items-center w-28 gap-3">
                <BsGoogle size={24} />
                <p className="text-lg font-semibold opacity-80">Google</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export const BrandScrollerReverse = () => {
  return (
    <>
      <div className="group flex overflow-hidden py-2 [--gap:2rem] [gap:var(--gap)] flex-row max-w-full [--duration:40s] [mask-image:linear-gradient(to_right,_rgba(0,_0,_0,_0),rgba(0,_0,_0,_1)_10%,rgba(0,_0,_0,_1)_90%,rgba(0,_0,_0,_0))]">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee-reverse flex-row"
              key={i}
            >
              <div className="flex items-center w-28 gap-3">
                <BsSpotify size={24} />
                <p className="text-lg font-semibold opacity-80">Spotify</p>
              </div>
              <div className="flex items-center w-28 gap-3">
                <BsYoutube size={24} />
                <p className="text-lg font-semibold opacity-80">YouTube</p>
              </div>
              <div className="flex items-center w-28 gap-3">
                <BsAmazon size={24} />
                <p className="text-lg font-semibold opacity-80">Amazon</p>
              </div>

              <div className="flex items-center w-28 gap-3">
                <BsGoogle size={24} />
                <p className="text-lg font-semibold opacity-80">Google</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

/**
 * GwdClientScroller
 * Dynamic two-tier infinite marquee scroller for GWD's enterprise clients
 * Crafted with dark tactile hardware keycap aesthetics from the official presentation deck
 */
export const GwdClientScroller = ({ theme = 'dark' }: { theme?: 'dark' | 'light' }) => {
  const row1 = CLIENT_PARTNERS.slice(0, 12);
  const row2 = CLIENT_PARTNERS.slice(12, 24);

  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col gap-4 w-full py-2 select-none">
      {/* Row 1: Forward Marquee */}
      <div className="group flex overflow-hidden py-1 [--gap:0.875rem] [gap:var(--gap)] flex-row max-w-full [--duration:45s] [mask-image:linear-gradient(to_right,_rgba(0,_0,_0,_0),rgba(0,_0,_0,_1)_10%,rgba(0,_0,_0,_1)_90%,rgba(0,_0,_0,_0))]">
        {Array(2)
          .fill(0)
          .map((_, loopIdx) => (
            <div
              key={loopIdx}
              className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row items-center"
            >
              {row1.map((client) => (
                <div
                  key={`${loopIdx}-${client.name}`}
                  className={
                    isDark
                      ? "min-w-[150px] px-5 py-3 h-[62px] flex flex-col justify-center items-center rounded-xl bg-gradient-to-b from-[#222226] to-[#121215] border border-white/10 shadow-[0_6px_18px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.14)] hover:border-[var(--brand-red)] hover:shadow-[0_0_24px_rgba(196,30,30,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-1 transition-all duration-200 cursor-default text-center group/key"
                      : "min-w-[140px] px-4 py-2.5 h-[58px] flex flex-col justify-center items-center rounded-xl bg-white border border-gray-200 shadow-sm hover:border-[var(--brand-red)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default text-center"
                  }
                >
                  <span className={isDark ? "font-bold text-white text-[13px] tracking-tight group-hover/key:text-white" : "font-bold text-gray-900 text-[13px]"}>
                    {client.name}
                  </span>
                  <span className={isDark ? "font-mono text-[9px] uppercase tracking-widest text-white/40 mt-0.5" : "font-mono text-[9px] uppercase tracking-wider text-gray-400 mt-0.5"}>
                    {client.tier || "CLIENT"}
                  </span>
                </div>
              ))}
            </div>
          ))}
      </div>

      {/* Row 2: Reverse Marquee */}
      <div className="group flex overflow-hidden py-1 [--gap:0.875rem] [gap:var(--gap)] flex-row max-w-full [--duration:50s] [mask-image:linear-gradient(to_right,_rgba(0,_0,_0,_0),rgba(0,_0,_0,_1)_10%,rgba(0,_0,_0,_1)_90%,rgba(0,_0,_0,_0))]">
        {Array(2)
          .fill(0)
          .map((_, loopIdx) => (
            <div
              key={loopIdx}
              className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee-reverse flex-row items-center"
            >
              {row2.map((client) => (
                <div
                  key={`${loopIdx}-${client.name}`}
                  className={
                    isDark
                      ? "min-w-[150px] px-5 py-3 h-[62px] flex flex-col justify-center items-center rounded-xl bg-gradient-to-b from-[#222226] to-[#121215] border border-white/10 shadow-[0_6px_18px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.14)] hover:border-[var(--brand-red)] hover:shadow-[0_0_24px_rgba(196,30,30,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-1 transition-all duration-200 cursor-default text-center group/key"
                      : "min-w-[140px] px-4 py-2.5 h-[58px] flex flex-col justify-center items-center rounded-xl bg-white border border-gray-200 shadow-sm hover:border-[var(--brand-red)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default text-center"
                  }
                >
                  <span className={isDark ? "font-bold text-white text-[13px] tracking-tight group-hover/key:text-white" : "font-bold text-gray-900 text-[13px]"}>
                    {client.name}
                  </span>
                  <span className={isDark ? "font-mono text-[9px] uppercase tracking-widest text-white/40 mt-0.5" : "font-mono text-[9px] uppercase tracking-wider text-gray-400 mt-0.5"}>
                    {client.tier || "CLIENT"}
                  </span>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

/**
 * EcosystemScroller
 * Smooth marquee for institutional ecosystem partners ("Who we build with")
 */
export const EcosystemScroller = ({ theme = 'dark' }: { theme?: 'dark' | 'light' }) => {
  const isDark = theme === 'dark';

  return (
    <div className="group flex overflow-hidden py-1 [--gap:3rem] [gap:var(--gap)] flex-row max-w-full [--duration:35s] [mask-image:linear-gradient(to_right,_rgba(0,_0,_0,_0),rgba(0,_0,_0,_1)_10%,rgba(0,_0,_0,_1)_90%,rgba(0,_0,_0,_0))]">
      {Array(3)
        .fill(0)
        .map((_, loopIdx) => (
          <div
            key={loopIdx}
            className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row items-center"
          >
            {INSTITUTIONAL_PARTNERS.map((partner) => (
              <span
                key={`${loopIdx}-${partner.id}`}
                className={
                  isDark
                    ? "text-[13px] font-bold text-white/85 hover:text-[var(--brand-red)] whitespace-nowrap transition-colors tracking-wider font-display uppercase cursor-default flex items-center gap-3"
                    : "text-[13px] font-bold text-gray-800 hover:text-[var(--brand-red)] whitespace-nowrap transition-colors tracking-wider font-display uppercase cursor-default flex items-center gap-3"
                }
              >
                {partner.name}
                <span className="w-1 h-1 rounded-full bg-white/20 inline-block" />
              </span>
            ))}
          </div>
        ))}
    </div>
  );
};


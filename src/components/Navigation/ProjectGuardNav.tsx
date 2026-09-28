'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Activity, Play, Layers, BarChart3, Lock, Menu, X, CheckCircle2 } from 'lucide-react';

export default function ProjectGuardNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Platform', href: '/#platform' },
    { label: 'Autonomous Agents', href: '/#agents' },
    { label: 'Run Execution', href: '/run', badge: 'Live Swarm' },
    { label: 'Release Gates', href: '/#release-gate' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Pricing', href: '/#pricing' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#07090e]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 text-cyan-400 group-hover:border-cyan-400 group-hover:scale-105 transition-all">
                <Shield className="w-5 h-5 text-cyan-400" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#07090e] animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  ProjectGuard
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                    Release Gate
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 tracking-wider">FULL QA REPLACEMENT</span>
              </div>
            </Link>

            {/* Current Workspace Pill */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-white/10 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-400">Workspace:</span>
              <span className="font-medium text-slate-200">Acme Cloud / Staging Gate</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-800/50'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/auth"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/run"
              className="relative group px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch QA Swarm</span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-6 space-y-2 border-b border-white/10 bg-[#07090e]/98 backdrop-blur-2xl">
          <div className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-300 mb-3 flex items-center justify-between">
            <span>Workspace: Acme Cloud Staging</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono text-[10px]">
              Active Gate
            </span>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5"
            >
              <div className="flex items-center justify-between">
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {link.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/run"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg text-center text-sm font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Launch QA Swarm
            </Link>
            <Link
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg text-center text-sm font-semibold text-slate-300 border border-white/10 hover:bg-white/5 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

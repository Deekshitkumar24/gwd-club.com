'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Terminal, CheckCircle2, Lock, ExternalLink } from 'lucide-react';

export default function ProjectGuardFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#05070a] text-slate-400 text-xs py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                ProjectGuard
              </span>
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The autonomous pre-deployment QA platform that fully replaces manual QA testing for web applications with a specialized agent swarm and an authoritative release gate.
            </p>

            {/* Live Operational Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-white/10 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">All 6 Agent Swarms Operational</span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400 font-semibold">99.99% Uptime</span>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div className="space-y-3">
            <div className="font-mono text-[11px] uppercase tracking-wider text-white font-semibold">
              Platform
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/#platform" className="hover:text-cyan-400 transition-colors">
                  Scope of QA Replacement
                </Link>
              </li>
              <li>
                <Link href="/run" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  Live Swarm Execution
                  <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 text-[9px] font-mono border border-cyan-800">
                    LIVE
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-cyan-400 transition-colors">
                  Release Gate Reports
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
                  Project Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Autonomous Agents */}
          <div className="space-y-3">
            <div className="font-mono text-[11px] uppercase tracking-wider text-white font-semibold">
              QA Agent Squad
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/#agents" className="hover:text-cyan-400 transition-colors">
                  Agent Astra (Functional)
                </Link>
              </li>
              <li>
                <Link href="/#agents" className="hover:text-cyan-400 transition-colors">
                  Agent Kinesis (Visual/WebKit)
                </Link>
              </li>
              <li>
                <Link href="/#agents" className="hover:text-cyan-400 transition-colors">
                  Agent Sentinel (Regression)
                </Link>
              </li>
              <li>
                <Link href="/#agents" className="hover:text-cyan-400 transition-colors">
                  Agent Aegis (Security)
                </Link>
              </li>
              <li>
                <Link href="/#agents" className="hover:text-cyan-400 transition-colors">
                  Agent Chronos (Hydration)
                </Link>
              </li>
              <li>
                <Link href="/#agents" className="hover:text-cyan-400 transition-colors">
                  Agent Cerberus (Release Gate)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Governance */}
          <div className="space-y-3">
            <div className="font-mono text-[11px] uppercase tracking-wider text-white font-semibold">
              Compliance & Security
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                SOC2 Type II Certified
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Zero Test Data Retention
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Cryptographic Gate Tokens
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                OWASP Web Top 10 Compliant
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="text-slate-500">
            © {new Date().getFullYear()} ProjectGuard Technologies Inc. Pre-Deployment Release Gate Authority. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="font-mono text-slate-500">v3.4.1-prod</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Whitepaper</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

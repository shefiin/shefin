'use client';

import React from 'react';
import { X, Calendar, Clock, Video, ArrowUpRight } from 'lucide-react';

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  calLink: string;
}

export function BookCallModal({ isOpen, onClose, calLink }: BookCallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 transition p-1 rounded-full hover:bg-neutral-100"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-neutral-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold">
              B
            </span>
            <h3 className="text-base font-semibold text-neutral-900 font-sans">
              Book a call with Shefin
            </h3>
          </div>
          <p className="text-xs font-mono text-neutral-500">
            Choose an option to chat about your product or engineering needs.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <a
            href={`${calLink}/15min`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 font-sans group-hover:text-amber-600 transition">
                  15 Min Quick Intro
                </h4>
                <p className="text-[11px] font-mono text-neutral-500">
                  Quick alignment on requirements & timeline
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition" />
          </a>

          <a
            href={`${calLink}/30min`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 font-sans group-hover:text-amber-600 transition">
                  30 Min Deep Dive
                </h4>
                <p className="text-[11px] font-mono text-neutral-500">
                  Technical scope, architecture & sprint planning
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition" />
          </a>

          <a
            href={calLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 font-sans group-hover:text-amber-600 transition">
                  Open Cal.com Calendar
                </h4>
                <p className="text-[11px] font-mono text-neutral-500">
                  Browse all available open slots
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition" />
          </a>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <span className="text-[11px] font-mono text-neutral-400">
            Press <kbd className="px-1 py-0.5 bg-neutral-100 rounded text-neutral-600 border border-neutral-200">Esc</kbd> to exit
          </span>
          <button
            onClick={onClose}
            className="text-xs font-mono text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


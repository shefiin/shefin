import React from 'react';

export function TechIcon({ name, className = "w-3.5 h-3.5" }: { name: string; className?: string }) {
  switch (name.toLowerCase()) {
    case 'react':
      return (
        <svg viewBox="-11.5 -10.23174 23 20.46348" className={className} fill="none">
          <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
          <g stroke="#00d8ff" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );
    case 'nextjs':
    case 'next.js':
      return (
        <svg viewBox="0 0 180 180" className={className} fill="none">
          <circle cx="90" cy="90" r="90" fill="#000000" />
          <path d="M149.508 157.438L69.147 54H54V125.979H66.8436V69.3831L139.989 164.845C143.322 162.614 146.509 160.134 149.508 157.438Z" fill="white" />
          <path d="M115.617 54H128.461V103.5H115.617V54Z" fill="white" />
        </svg>
      );
    case 'tanstack':
    case 'tanstack start':
    case 'tanstack query':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="currentColor">
          <circle cx="50" cy="50" r="16" fill="#f59e0b" />
          <circle cx="28" cy="38" r="12" fill="#ef4444" />
          <circle cx="72" cy="38" r="12" fill="#3b82f6" />
          <circle cx="50" cy="74" r="12" fill="#10b981" />
        </svg>
      );
    case 'typescript':
      return (
        <svg viewBox="0 0 128 128" className={className}>
          <path fill="#3178c6" d="M0 0h128v128H0z"/>
          <path fill="#fff" d="M63.5 98.4c-4.4 7.6-12.7 10.9-22.1 10.9-15.7 0-25.9-9.9-25.9-25.7 0-16.7 11.2-26.6 27-26.6 8.3 0 15.3 2.8 19.3 7.8l-8.7 6.8c-2.4-3.5-6-5.4-10.7-5.4-8.8 0-14.7 5.9-14.7 16.2 0 10.5 5.7 16.4 14.8 16.4 4.5 0 8.1-1.8 10.8-5l10.2 4.6zm50-39.7H86.2v10.3h12.1v38.8h13.1V69h12.1V58.7z"/>
        </svg>
      );
    case 'betterauth':
    case 'better auth':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case 'node':
    case 'nodejs':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="#539e43">
          <path d="M16 2.3l12.1 7v14l-12.1 7-12.1-7v-14l12.1-7z" fill="#333" />
          <path d="M16 4.3l10.4 6v12l-10.4 6-10.4-6v-12l10.4-6z" fill="#539e43" />
        </svg>
      );
    case 'express':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5v-2h-2v2H9v-5h4c1.1 0 2 .9 2 2v1c0 1.1-.9 2-2 2zm0-4h-2v1h2v-1z"/>
        </svg>
      );
    case 'fastify':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#000" stroke="#000" />
        </svg>
      );
    case 'nest':
    case 'nestjs':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#ea2845">
          <path d="M12 2L2 9.5l3.5 12.5h13L22 9.5 12 2zm0 4.2l6.5 4.8-2.3 8.2h-8.4L5.5 11 12 6.2z"/>
        </svg>
      );
    case 'postgres':
    case 'postgresql':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#336791">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1.2 14.5h-2.4V11h2.4v5.5zm0-7.3h-2.4V6.8h2.4v2.4z"/>
        </svg>
      );
    case 'mongodb':
    case 'mongo':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#13aa52">
          <path d="M12 1.5s-4.5 4-4.5 9.5c0 4 3 7.5 4.5 9 1.5-1.5 4.5-5 4.5-9 0-5.5-4.5-9.5-4.5-9.5zm-.5 16.5c-.3 0-.6-.3-.6-.6 0-2.4-1.4-4.3-1.4-6.4 0-2.8 1.9-5.1 2-5.3.1.2.1 12.3 0 12.3z"/>
        </svg>
      );
    case 'prisma':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#2d3748">
          <path d="M12.67 2.15a1 1 0 0 0-1.34 0L2.4 10.63a1 1 0 0 0-.25 1.05l5.24 9.94a1 1 0 0 0 .88.54h11.46a1 1 0 0 0 .88-.54l1.24-2.36a1 1 0 0 0-.17-1.16L12.67 2.15z"/>
        </svg>
      );
    case 'supabase':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#3ecf8e">
          <path d="M21.36 10.42a1 1 0 0 0-.86-.54h-7.7V3a1 1 0 0 0-1.7-.71l-8.5 8.5a1 1 0 0 0 .7 1.71h7.7V20a1 1 0 0 0 1.7.71l8.5-8.5a1 1 0 0 0 .16-1.09z"/>
        </svg>
      );
    case 'docker':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#2496ed">
          <path d="M13 8h2v2h-2zm-3 0h2v2h-2zm-3 0h2v2H7zm6-3h2v2h-2zm-3 0h2v2h-2zm12 7.5c-.4-.3-1.2-.4-2-.2-.2-.8-.7-1.4-1.4-1.8l-.5-.3-.4.4c-.6.6-1.5 1-2.5 1h-12c-.6 0-1.1.2-1.6.6C2.2 14.6 2 15.3 2 16c0 3.3 2.7 6 6 6 5.2 0 9.8-3.3 11.2-7.5.9.1 1.8-.2 2.4-.7l.4-.3-.4-.5z"/>
        </svg>
      );
    case 'turborepo':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#ef4444" strokeWidth="2.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      );
    case 'shadcn':
    case 'shadcn/ui':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="16" y1="4" x2="8" y2="20" />
        </svg>
      );
    case 'tailwind':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#38bdf8">
          <path d="M12 6c-3 0-4.8 1.5-5.4 4.5 1.2-1.5 2.7-2.1 4.5-1.8 1 .2 1.8 1 2.6 1.8C15 11.8 16.7 13.5 20.4 13.5c3 0 4.8-1.5 5.4-4.5-1.2 1.5-2.7 2.1-4.5 1.8-1-.2-1.8-1-2.6-1.8C17.4 7.7 15.7 6 12 6zM6.6 12C3.6 12 1.8 13.5 1.2 16.5c1.2-1.5 2.7-2.1 4.5-1.8 1 .2 1.8 1 2.6 1.8C9.6 17.8 11.3 19.5 15 19.5c3 0 4.8-1.5 5.4-4.5-1.2 1.5-2.7 2.1-4.5 1.8-1-.2-1.8-1-2.6-1.8C12 13.7 10.3 12 6.6 12z"/>
        </svg>
      );
    case 'aisdk':
    case 'ai sdk':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z"/>
        </svg>
      );
    default:
      return (
        <span className="w-2 h-2 rounded-full bg-neutral-400 inline-block" />
      );
  }
}


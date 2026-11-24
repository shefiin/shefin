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
    case 'node':
    case 'nodejs':
    case 'node.js':
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
    case 'mongo':
    case 'mongodb':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#13aa52">
          <path d="M12 1.5s-4.5 4-4.5 9.5c0 4 3 7.5 4.5 9 1.5-1.5 4.5-5 4.5-9 0-5.5-4.5-9.5-4.5-9.5zm-.5 16.5c-.3 0-.6-.3-.6-.6 0-2.4-1.4-4.3-1.4-6.4 0-2.8 1.9-5.1 2-5.3.1.2.1 12.3 0 12.3z"/>
        </svg>
      );
    case 'postgres':
    case 'postgress':
    case 'postgresql':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#336791">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1.2 14.5h-2.4V11h2.4v5.5zm0-7.3h-2.4V6.8h2.4v2.4z"/>
        </svg>
      );
    case 'javascript':
    case 'javascripts':
    case 'js':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <rect width="24" height="24" rx="3" fill="#F7DF1E" />
          <path d="M12.75 16.5c0 1.25-.75 1.75-1.75 1.75-1.1 0-1.7-.65-1.7-1.55h1.2c.05.45.2.75.5.75.3 0 .5-.2.5-.55v-4.9h1.25v4.55zm4.85-2.1c-.3-.2-.75-.4-1.25-.6-.6-.25-1-.5-1-.95 0-.45.35-.75.9-.75.5 0 .8.25.95.65h1.15c-.2-.8-.85-1.45-2.1-1.45-1.2 0-2.15.7-2.15 1.75 0 1 .6 1.45 1.5 1.8.65.25 1.15.5 1.15 1 0 .5-.4.8-1.05.8-.75 0-1.2-.4-1.35-.95H15.1c.15 1.05.9 1.75 2.5 1.75 1.45 0 2.3-.7 2.3-1.85 0-1.05-.75-1.5-1.3-1.7z" fill="#000000" />
        </svg>
      );
    case 'typescript':
    case 'ts':
      return (
        <svg viewBox="0 0 128 128" className={className}>
          <path fill="#3178c6" d="M0 0h128v128H0z"/>
          <path fill="#fff" d="M63.5 98.4c-4.4 7.6-12.7 10.9-22.1 10.9-15.7 0-25.9-9.9-25.9-25.7 0-16.7 11.2-26.6 27-26.6 8.3 0 15.3 2.8 19.3 7.8l-8.7 6.8c-2.4-3.5-6-5.4-10.7-5.4-8.8 0-14.7 5.9-14.7 16.2 0 10.5 5.7 16.4 14.8 16.4 4.5 0 8.1-1.8 10.8-5l10.2 4.6zm50-39.7H86.2v10.3h12.1v38.8h13.1V69h12.1V58.7z"/>
        </svg>
      );
    case 'docker':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#2496ed">
          <path d="M13 8h2v2h-2zm-3 0h2v2h-2zm-3 0h2v2H7zm6-3h2v2h-2zm-3 0h2v2h-2zm12 7.5c-.4-.3-1.2-.4-2-.2-.2-.8-.7-1.4-1.4-1.8l-.5-.3-.4.4c-.6.6-1.5 1-2.5 1h-12c-.6 0-1.1.2-1.6.6C2.2 14.6 2 15.3 2 16c0 3.3 2.7 6 6 6 5.2 0 9.8-3.3 11.2-7.5.9.1 1.8-.2 2.4-.7l.4-.3-.4-.5z"/>
        </svg>
      );
    case 'html':
    case 'html5':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path fill="#E34F26" d="M3 2l1.65 18.5L12 23l7.35-2.5L21 2H3z"/>
          <path fill="#EF652A" d="M12 3.8v17l5.7-1.95L19.2 3.8H12z"/>
          <path fill="#ECECEC" d="M12 8.4H8.2l.2 2.2h3.6V8.4zm0 4.4H8.6l.2 2.2h3.2v-2.2zm0 4.2v-2h-.1l-1.9-.5-.1-1.3H6.8l.3 3.3 4.9 1.4v-.9z"/>
          <path fill="#fff" d="M12 8.4h3.8l-.4 4.4H12v-2.2h1.5l.2-2.2H12V8.4zm0 4.4h3.6l-.3 3.7-3.3.9v-.9l1.9-.5.2-1.8H12v-1.4z"/>
        </svg>
      );
    case 'css':
    case 'css3':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path fill="#1572B6" d="M3 2l1.65 18.5L12 23l7.35-2.5L21 2H3z"/>
          <path fill="#33A9DC" d="M12 3.8v17l5.7-1.95L19.2 3.8H12z"/>
          <path fill="#ECECEC" d="M12 8.4H8.2l.2 2.2h3.6V8.4zm0 4.4H8.6l.2 2.2h3.2v-2.2zm0 4.2v-2h-.1l-1.9-.5-.1-1.3H6.8l.3 3.3 4.9 1.4v-.9z"/>
          <path fill="#fff" d="M12 8.4h3.8l-.4 4.4H12v-2.2h1.5l.2-2.2H12V8.4zm0 4.4h3.6l-.3 3.7-3.3.9v-.9l1.9-.5.2-1.8H12v-1.4z"/>
        </svg>
      );
    case 'tailwind':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#38bdf8">
          <path d="M12 6c-3 0-4.8 1.5-5.4 4.5 1.2-1.5 2.7-2.1 4.5-1.8 1 .2 1.8 1 2.6 1.8C15 11.8 16.7 13.5 20.4 13.5c3 0 4.8-1.5 5.4-4.5-1.2 1.5-2.7 2.1-4.5 1.8-1-.2-1.8-1-2.6-1.8C17.4 7.7 15.7 6 12 6zM6.6 12C3.6 12 1.8 13.5 1.2 16.5c1.2-1.5 2.7-2.1 4.5-1.8 1 .2 1.8 1 2.6 1.8C9.6 17.8 11.3 19.5 15 19.5c3 0 4.8-1.5 5.4-4.5-1.2 1.5-2.7 2.1-4.5 1.8-1-.2-1.8-1-2.6-1.8C12 13.7 10.3 12 6.6 12z"/>
        </svg>
      );
    case 'supabase':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#3ecf8e">
          <path d="M21.36 10.42a1 1 0 0 0-.86-.54h-7.7V3a1 1 0 0 0-1.7-.71l-8.5 8.5a1 1 0 0 0 .7 1.71h7.7V20a1 1 0 0 0 1.7.71l8.5-8.5a1 1 0 0 0 .16-1.09z"/>
        </svg>
      );
    case 'rabbitmq':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#FF6600">
          <path d="M20.5 13.5c-.3-1.6-1.5-2.7-2.9-3.2.3-.9.4-1.9.1-2.9-.6-2.1-2.5-3.4-4.6-3.4-.6 0-1.2.1-1.7.3-.8-1.5-2.4-2.3-4-2.3-2.6 0-4.6 2.1-4.6 4.7 0 .5.1 1 .3 1.5-1.2.9-1.9 2.4-1.9 3.9 0 2.2 1.5 4.1 3.5 4.6.4 2.2 2.3 3.9 4.6 3.9 1.5 0 2.9-.7 3.8-1.8.8.4 1.7.6 2.6.6 2.8 0 5-2.2 5-5 0-.3 0-.6-.2-.9.1 0 .2 0 .3 0 .2 0 .4 0 .5-.1.8-.4 1.3-1.1 1.4-1.9.1-1.1-.9-2-2-2zm-3.2 2.8c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"/>
        </svg>
      );
    case 'kafka':
    case 'apache kafka':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#231F20">
          <circle cx="12" cy="12" r="3" fill="#231F20"/>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <circle cx="6" cy="12" r="1.5" fill="#231F20"/>
          <circle cx="18" cy="8" r="1.5" fill="#231F20"/>
          <circle cx="18" cy="16" r="1.5" fill="#231F20"/>
        </svg>
      );
    case 'redis':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#DC382D">
          <path d="M21.5 8.5L12 3.5 2.5 8.5v7l9.5 5 9.5-5v-7zm-9.5-3.2l7.2 3.8-7.2 3.8-7.2-3.8 7.2-3.8zm-7.7 5.7l7 3.7v6.6l-7-3.7v-6.6zm8.4 10.3v-6.6l7-3.7v6.6l-7 3.7z"/>
        </svg>
      );
    default:
      return (
        <span className="w-2 h-2 rounded-full bg-neutral-400 inline-block" />
      );
  }
}

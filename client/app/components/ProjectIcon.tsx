import React from 'react';
import { Mic, Database, Activity } from 'lucide-react';

export function ProjectIcon({ iconKey = 'curehome', className = "w-4 h-4 text-neutral-800" }: { iconKey?: string; className?: string }) {
  switch ((iconKey || 'curehome').toLowerCase()) {
    case 'curehome':
    case 'telehealth':
    case 'activity':
      return <Activity className={className} />;
    case 'mic':
      return <Mic className={className} />;
    case 'cat':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 2a4 4 0 0 0-4 4c0 .88.29 1.69.78 2.34L7.5 9.5 5 7l-.5 3.5 2.1 2.1c-.38.83-.6 1.76-.6 2.73 0 4.05 3.13 7.33 7 7.33s7-3.28 7-7.33c0-.97-.22-1.9-.6-2.73L22 10.5 21.5 7l-2.5 2.5-1.28-1.16c.49-.65.78-1.46.78-2.34a4 4 0 0 0-4-4h-2.5zm-2.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
        </svg>
      );
    case 'bluesky':
      return (
        <svg viewBox="0 0 568 501" className={className} fill="#0285FF">
          <path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.209C492.376-1.956 568 -27.818 568 58.788c0 17.305-9.875 145.47-15.688 166.236-20.219 72.222-93.85 90.627-159.206 79.524 114.28 19.467 143.515 83.743 80.609 148.067-75.765 77.472-167.319-38.309-183.097-78.718-2.617-6.702-3.87-9.897-6.618-9.897-2.748 0-4.001 3.195-6.618 9.897-15.778 40.409-107.332 156.19-183.097 78.718-62.906-64.324-33.671-128.6-80.609-148.067C136.738 315.651 63.107 297.246 42.888 225.024 37.075 204.258 27.2 76.093 27.2 58.788 27.2-27.818 102.824-1.956 123.121 33.664Z"/>
        </svg>
      );
    case 'database':
      return <Database className={className} />;
    default:
      return <Activity className={className} />;
  }
}

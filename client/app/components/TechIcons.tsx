import React from 'react';
import {
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiReact,
  SiDocker,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiSupabase,
  SiRabbitmq,
  SiApachekafka,
  SiRedis,
  SiPrometheus,
  SiGrafana,
  SiGooglecloud,
  SiKubernetes
} from 'react-icons/si';

export function TechIcon({ name, className = "w-3.5 h-3.5" }: { name: string; className?: string }) {
  switch (name.toLowerCase()) {
    case 'react':
      return <SiReact className={className} style={{ color: '#61DAFB' }} />;
    case 'nextjs':
    case 'next.js':
      return <SiNextdotjs className={className} />;
    case 'node':
    case 'nodejs':
    case 'node.js':
      return <SiNodedotjs className={className} style={{ color: '#5FA04E' }} />;
    case 'express':
      return <SiExpress className={className} />;
    case 'mongo':
    case 'mongodb':
      return <SiMongodb className={className} style={{ color: '#47A248' }} />;
    case 'postgres':
    case 'postgress':
    case 'postgresql':
      return <SiPostgresql className={className} style={{ color: '#4169E1' }} />;
    case 'javascript':
    case 'javascripts':
    case 'js':
      return <SiJavascript className={className} style={{ color: '#F7DF1E' }} />;
    case 'typescript':
    case 'ts':
      return <SiTypescript className={className} style={{ color: '#3178C6' }} />;
    case 'docker':
      return <SiDocker className={className} style={{ color: '#2496ED' }} />;
    case 'html':
    case 'html5':
      return <SiHtml5 className={className} style={{ color: '#E34F26' }} />;
    case 'css':
    case 'css3':
      return <SiCss className={className} style={{ color: '#1572B6' }} />;
    case 'tailwind':
    case 'tailwindcss':
      return <SiTailwindcss className={className} style={{ color: '#06B6D4' }} />;
    case 'supabase':
      return <SiSupabase className={className} style={{ color: '#3ECF8E' }} />;
    case 'rabbitmq':
      return <SiRabbitmq className={className} style={{ color: '#FF6600' }} />;
    case 'kafka':
      return <SiApachekafka className={className} style={{ color: '#231F20' }} />;
    case 'redis':
      return <SiRedis className={className} style={{ color: '#FF4438' }} />;
    case 'prometheus':
      return <SiPrometheus className={className} style={{ color: '#E6522C' }} />;
    case 'grafana':
      return <SiGrafana className={className} style={{ color: '#F46800' }} />;
    case 'gcp':
    case 'google cloud':
      return <SiGooglecloud className={className} style={{ color: '#4285F4' }} />;
    case 'kubernetes':
    case 'k8s':
      return <SiKubernetes className={className} style={{ color: '#326CE5' }} />;
    default:
      return <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />;
  }
}

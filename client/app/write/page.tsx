import React, { Suspense } from 'react';
import WritingStudio from './WritingStudio';

export const metadata = {
  title: 'Writing Studio • Shefin',
  description: 'Author and publish engineering articles to MongoDB.',
};

export default function WritePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
          <p className="font-mono text-xs text-neutral-400 animate-pulse">
            Loading Writing Studio...
          </p>
        </div>
      }
    >
      <WritingStudio />
    </Suspense>
  );
}


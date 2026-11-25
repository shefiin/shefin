import React, { Suspense } from 'react';
import ArticleView from './ArticleView';

export function generateStaticParams() {
  return [
    { slug: 'designing-scalable-distributed-systems-nodejs-mongodb' },
    { slug: 'fullstack-architecture-nextjs-express' },
    { slug: 'building-microservices-without-over-engineering' },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa]" />}>
      <ArticleView slug={slug} />
    </Suspense>
  );
}

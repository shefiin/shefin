import React, { Suspense } from 'react';
import ArticleView from './ArticleView';

export function generateStaticParams() {
  return [
    { slug: 'designing-scalable-distributed-systems-nodejs-mongodb' },
    { slug: 'fullstack-architecture-nextjs-express' },
    { slug: 'building-microservices-without-over-engineering' },
  ];
}

async function ArticleContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArticleView slug={slug} />;
}

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ArticleContent params={params} />
    </Suspense>
  );
}

"use client";

import Link from "next/link";

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({ title, subtitle, children }: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen pt-20 pb-40 px-6 md:px-12 bg-white antialiased">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-20">
          <Link 
            href="/" 
            className="font-mono text-[10px] tracking-[0.2em] opacity-30 hover:opacity-100 transition-opacity no-underline uppercase mb-4"
          >
            ‹ Back To Home
          </Link>
          <p className="font-mono text-[10px] text-gold-primary tracking-[0.3em] uppercase mb-2">Legal // Archives</p>
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter uppercase">{title}</h1>
          <p className="font-mono text-[11px] opacity-40 uppercase tracking-wider leading-relaxed max-w-sm">
            {subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-sm prose-nxst max-w-none">
          {children}
        </div>
      </div>
    </main>
  );
}

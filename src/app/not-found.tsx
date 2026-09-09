"use client";

import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";

export default function NotFound() {
  return (
    <main className="max-shell flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <div className="font-mono text-sm uppercase tracking-widest text-accent">404</div>
      <h1 className="mt-3 text-3xl font-medium tracking-tight text-fg md:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-[45ch] text-base text-fg-muted">
        The requested trace or resource does not exist in this deployment.
      </p>
      <Link
        href="/"
        className="press mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-fg hover:bg-accent-hover"
      >
        <ArrowLeft size={16} weight="bold" />
        Return home
      </Link>
    </main>
  );
}

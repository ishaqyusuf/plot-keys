"use client";

import { AnimatedOrbs } from "./animated-orbs";
import { EarlyAccessForm } from "./early-access-form";
import { NewsletterForm } from "./newsletter-form";

export function ComingSoonPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-16 text-foreground">
      <AnimatedOrbs variant="hero" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        {/* Wordmark */}
        <p
          className="animate-fade-in text-xs font-medium uppercase tracking-[0.5em] text-primary"
          style={{ animationDelay: "0.1s", animationFillMode: "both" }}
        >
          PlotKeys
        </p>

        {/* Main heading — staggered line reveal */}
        <h1 className="mt-8 font-serif text-4xl leading-[1.1] tracking-[-0.04em] text-foreground sm:text-5xl md:text-7xl">
          <span
            className="animate-fade-in-up block"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          >
            Something remarkable
          </span>
          <span
            className="animate-fade-in-up block"
            style={{ animationDelay: "0.5s", animationFillMode: "both" }}
          >
            is taking shape.
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="animate-fade-in-up mx-auto mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg md:text-xl"
          style={{ animationDelay: "0.7s", animationFillMode: "both" }}
        >
          The operating system for modern real-estate companies.
          <br className="hidden sm:block" />
          Listings, CRM, websites, and AI workflows — unified.
        </p>

        {/* Decorative divider */}
        <div
          className="animate-fade-in mx-auto mt-10 h-px w-24 bg-border"
          style={{ animationDelay: "0.9s", animationFillMode: "both" }}
        />

        {/* Forms */}
        <div
          className="animate-fade-in-up mt-10 grid w-full gap-5 md:grid-cols-2"
          style={{ animationDelay: "1s", animationFillMode: "both" }}
        >
          <EarlyAccessForm />
          <NewsletterForm />
        </div>

        {/* Footer */}
        <p
          className="animate-fade-in mt-14 text-xs uppercase tracking-[0.35em] text-muted-foreground/60"
          style={{ animationDelay: "1.3s", animationFillMode: "both" }}
        >
          Built for agencies, developers &amp; property teams
        </p>
      </div>
    </main>
  );
}

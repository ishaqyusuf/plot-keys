import { Button } from "@plotkeys/ui/button";
import Link from "next/link";

export default function MarketingHomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(160deg,#082f49_0%,#0f172a_42%,#f8fafc_42%,#f8fafc_100%)] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-between gap-10 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur md:p-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-200">
              PlotKeys
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight text-white md:text-7xl">
              One platform to run your agency and launch your website instantly.
            </h1>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-[1.75rem] bg-white p-8 text-slate-900 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Why it matters
            </p>
            <p className="mt-4 text-xl text-slate-700">
              Manage listings, leads, agents, CRM, AI content, and tenant
              websites without piecing together separate tools.
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild>
                <Link href="/signup">Start Free</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/docs">View Structure</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">
              Tenant websites
            </p>
            <p className="mt-4 font-serif text-3xl">company.plotkeys.app</p>
            <p className="mt-3 text-slate-300">
              Structured sections, shared design system, and clean multi-tenant
              rendering from day one.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

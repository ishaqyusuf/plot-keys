import { Button } from "@plotkeys/ui/button";

export default function DashboardHomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(17,24,39,0.08),_transparent_45%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-6 py-16">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white/85 p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Dashboard
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl text-slate-950">
          The operating system for modern real-estate companies.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          This starter dashboard follows the Midday monorepo shape while keeping
          the first implementation intentionally lean.
        </p>
        <div className="mt-8 flex gap-4">
          <Button>Start Building Modules</Button>
          <Button variant="secondary">Review Project Brain</Button>
        </div>
      </div>
    </main>
  );
}

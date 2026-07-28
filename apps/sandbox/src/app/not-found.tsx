import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-muted/20 px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-1 text-2xl font-semibold">
          Sandbox preview not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The profile may have been archived, or this template does not support
          the requested page.
        </p>
        <Link className="mt-5 inline-block text-sm underline" href="/">
          Return to Sandbox
        </Link>
      </div>
    </main>
  );
}

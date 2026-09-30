import { buildSitefrontHostname } from "@plotkeys/utils";

type Props = { company?: string; email: string; subdomain?: string };

export function VerificationIntro({ company, email, subdomain }: Props) {
  return (
    <>
      <div className="flow-verification">
        <svg
          width="42"
          height="42"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m2 5 10 8L22 5" />
        </svg>
        <div>
          <p className="flow-eyebrow">Verification pending</p>
          <strong>{email}</strong>
          <p>Use the verification link sent to this address.</p>
        </div>
      </div>
      <ol className="flow-verification-steps">
        <li>Open the email from PlotKeys.</li>
        <li>Follow the verification link.</li>
        <li>Continue directly into your company setup.</li>
      </ol>
      {company || subdomain ? (
        <div className="flow-domain-preview border border-border p-4 text-sm">
          {company ? (
            <p>
              Company: <strong>{company}</strong>
            </p>
          ) : null}
          {subdomain ? (
            <p>
              Website: <strong>{buildSitefrontHostname(subdomain)}</strong>
            </p>
          ) : null}
        </div>
      ) : null}
      <p className="text-xs text-muted-foreground">
        Keep this tab open while you check your inbox.
      </p>
    </>
  );
}

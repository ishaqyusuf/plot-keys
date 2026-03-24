"use client";

if (process.env.NODE_ENV === "production") {
  throw new Error("DevSignupFab must not be imported in production.");
}

/**
 * Dev-only FAB for the sign-up page.
 *
 * Shows preset accounts + a random-generator option. Clicking any row
 * calls `onFill(values)` so the parent can reset the react-hook-form
 * instance with all 6 fields pre-populated.
 *
 * The parent is responsible for calling `addAccount` after a successful
 * sign-up mutation so future sessions can log in via DevLoginFab.
 */

import { DevFabShell } from "./dev-fab-shell";

export type SignUpPresetValues = {
  company: string;
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  subdomain: string;
};

type Props = {
  /** Called with form values when the user picks a preset. */
  onFill: (values: SignUpPresetValues) => void;
};

const STATIC_PRESETS: { label: string; values: SignUpPresetValues }[] = [
  {
    label: "Amara · Aster Grove",
    values: {
      company: "Aster Grove Realty",
      email: "amara@astergrove.com",
      name: "Amara Okafor",
      password: "lorem-ipsum",
      phoneNumber: "+2348012345678",
      subdomain: "aster-grove",
    },
  },
  {
    label: "James · Sunrise Props",
    values: {
      company: "Sunrise Properties",
      email: "james@sunrise.com",
      name: "James Adeyemi",
      password: "lorem-ipsum",
      phoneNumber: "+2348098765432",
      subdomain: "sunrise-props",
    },
  },
  {
    label: "Fatima · Pearl Estates",
    values: {
      company: "Pearl Estates",
      email: "fatima@pearlestate.com",
      name: "Fatima Al-Hassan",
      password: "lorem-ipsum",
      phoneNumber: "+2348011122233",
      subdomain: "pearl-estates",
    },
  },
];

function makeRandomPreset(): SignUpPresetValues {
  const id = Math.random().toString(36).slice(2, 7);
  return {
    company: `Test Co ${id}`,
    email: `dev-${id}@test.plotkeys.com`,
    name: `Dev User ${id}`,
    password: "lorem-ipsum",
    phoneNumber: "+2348000000000",
    subdomain: `dev-${id}`,
  };
}

export function DevSignupFab({ onFill }: Props) {
  return (
    <DevFabShell label="Quick fill">
      <div className="divide-y divide-amber-100 dark:divide-amber-900/50">
        {STATIC_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onFill(preset.values)}
            className="w-full px-4 py-2.5 text-left transition hover:bg-amber-50 active:bg-amber-100 dark:hover:bg-amber-950/30"
          >
            <p className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-100">
              {preset.label}
            </p>
            <p className="font-mono text-[10px] text-amber-700 dark:text-amber-400">
              {preset.values.email}
            </p>
            <p className="font-mono text-[10px] text-slate-400">
              {preset.values.subdomain}
            </p>
          </button>
        ))}

        {/* Random unique user */}
        <button
          type="button"
          onClick={() => onFill(makeRandomPreset())}
          className="w-full px-4 py-2.5 text-left transition hover:bg-amber-50 active:bg-amber-100 dark:hover:bg-amber-950/30"
        >
          <p className="font-mono text-xs font-semibold text-amber-700 dark:text-amber-400">
            ✦ Random new user
          </p>
          <p className="font-mono text-[10px] text-slate-400">
            Generates a unique email + subdomain
          </p>
        </button>
      </div>
    </DevFabShell>
  );
}

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
 * sign-up mutation so future sessions can log in via the dev login picker.
 */

import { Button } from "@plotkeys/ui/button";
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
      <div className="divide-y divide-border">
        {STATIC_PRESETS.map((preset) => (
          <Button
            variant="ghost"
            key={preset.label}
            type="button"
            onClick={() => onFill(preset.values)}
            className="h-auto w-full flex-col items-start rounded-none px-4 py-2.5 text-left hover:bg-muted active:bg-muted"
          >
            <p className="font-mono text-xs font-semibold text-foreground">
              {preset.label}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              {preset.values.email}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              {preset.values.subdomain}
            </p>
          </Button>
        ))}

        {/* Random unique user */}
        <Button
          variant="ghost"
          type="button"
          onClick={() => onFill(makeRandomPreset())}
          className="h-auto w-full flex-col items-start rounded-none px-4 py-2.5 text-left hover:bg-muted active:bg-muted"
        >
          <p className="font-mono text-xs font-semibold text-foreground">
            Random new user
          </p>
          <p className="font-mono text-[10px] text-muted-foreground">
            Generates a unique email + subdomain
          </p>
        </Button>
      </div>
    </DevFabShell>
  );
}

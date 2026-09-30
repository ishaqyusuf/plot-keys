import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./flow-shell.module.css";
import { OnboardingBrandAvatar } from "./onboarding/onboarding-brand-avatar";

type Props = {
  badge: string;
  brandEditable?: boolean;
  brandLogoUrl?: string | null;
  brandName?: string;
  children: ReactNode;
  description: string;
  eyebrow?: string;
  headerAction?: ReactNode;
  sidePanel: ReactNode;
  step?: number;
  totalSteps?: number;
  title: string;
};

export function FlowShell({
  badge,
  brandEditable = false,
  brandLogoUrl = null,
  brandName = "PlotKeys",
  children,
  description,
  eyebrow = "Your company starts here",
  headerAction,
  sidePanel,
  step = 1,
  totalSteps = 3,
  title,
}: Props) {
  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link aria-label="Go to PlotKeys homepage" href="/">
          <Image
            alt="PlotKeys logo"
            className={styles.logoLight}
            src="/onboarding/logo-light.png"
            width={116}
            height={40}
            priority
          />
          <Image
            alt="PlotKeys logo"
            className={styles.logoDark}
            src="/onboarding/logo-dark.png"
            width={116}
            height={40}
            priority
          />
        </Link>
        <div className={styles.headerActions}>
          {brandName !== "PlotKeys" ? (
            <span className={styles.company}>{brandName}</span>
          ) : null}
          {headerAction}
        </div>
      </header>
      <div className={styles.layout}>
        <aside className={styles.rail}>{sidePanel}</aside>
        <section className={styles.content} aria-labelledby="flow-title">
          <div className={styles.progress}>
            <span>{badge}</span>
            <span className={styles.segments} aria-hidden="true">
              {Array.from({ length: totalSteps }, (_, index) => index + 1).map(
                (number) => (
                  <span key={number} data-complete={number <= step} />
                ),
              )}
            </span>
          </div>
          <div className={styles.heading}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1 id="flow-title">{title}</h1>
            <p className={styles.description}>{description}</p>
          </div>
          {brandEditable ? (
            <div className={styles.logoUpload}>
              <OnboardingBrandAvatar
                brandName={brandName}
                editable
                logoUrl={brandLogoUrl}
              />
              <div>
                <p>
                  Add your company logo <span>(optional)</span>
                </p>
                <small>You can add or change it later.</small>
              </div>
            </div>
          ) : null}
          {children}
        </section>
      </div>
    </main>
  );
}

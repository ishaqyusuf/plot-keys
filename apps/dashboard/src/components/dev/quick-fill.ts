"use client";

import {
  createQuickFillAdapter,
  fillQuickFillProfile,
  type QuickFillArgs,
  type QuickFillFormAdapter,
  type QuickFillProfile,
  runQuickFill,
} from "@/lib/quick-fill";

export {
  createQuickFillAdapter,
  type QuickFillArgs,
  type QuickFillFormAdapter,
  type QuickFillProfile,
  runQuickFill,
};

type QuickFillValues = Record<string, unknown>;

export class QuickFill<
  TValues extends QuickFillValues = QuickFillValues,
  TProfile extends QuickFillProfile = QuickFillProfile,
> {
  constructor(private readonly form: QuickFillFormAdapter<TValues>) {}

  fill(profile: TProfile) {
    return fillQuickFillProfile({
      args: { form: this.form } as QuickFillArgs[TProfile],
      name: profile,
    });
  }

  onboardingBusinessIdentity() {
    return this.fill("onboarding-business-identity" as TProfile);
  }

  authSignUp() {
    return this.fill("auth-sign-up" as TProfile);
  }

  connectDomain() {
    return this.fill("connect-domain" as TProfile);
  }

  onboardingMarketFocus() {
    return this.fill("onboarding-market-focus" as TProfile);
  }

  onboardingBrandStyle() {
    return this.fill("onboarding-brand-style" as TProfile);
  }

  onboardingContactOperations() {
    return this.fill("onboarding-contact-operations" as TProfile);
  }

  onboardingContentReadiness() {
    return this.fill("onboarding-content-readiness" as TProfile);
  }

  onboardingLaunch() {
    return this.fill("onboarding-launch" as TProfile);
  }

  newAgent() {
    return this.fill("new-agent" as TProfile);
  }

  newEstate() {
    return this.fill("new-estate" as TProfile);
  }

  newProject() {
    return this.fill("new-project" as TProfile);
  }

  newProperty() {
    return this.fill("new-property" as TProfile);
  }

  inviteMember() {
    return this.fill("invite-member" as TProfile);
  }

  inviteSignUp() {
    return this.fill("invite-sign-up" as TProfile);
  }

  inviteProfileComplete() {
    return this.fill("invite-profile-complete" as TProfile);
  }

  inviteEmployee() {
    return this.fill("invite-employee" as TProfile);
  }

  publishConfiguration() {
    return this.fill("publish-configuration" as TProfile);
  }

  generic() {
    return this.fill("generic" as TProfile);
  }
}

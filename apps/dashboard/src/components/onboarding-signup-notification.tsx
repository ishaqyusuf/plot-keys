"use client";

import {
  createNotificationFromType,
  createUserNotificationContact,
  plotKeysNotificationTypes,
} from "@plotkeys/notifications";
import { useNotifications } from "@plotkeys/notifications-react";
import { useEffect, useRef } from "react";

type OnboardingSignupNotificationProps = {
  companyName: string;
  dashboardHostname: string;
  email: string;
  fullName: string;
  show: boolean;
  siteHostname: string;
  subdomain: string;
};

export function OnboardingSignupNotification({
  companyName,
  dashboardHostname,
  email,
  fullName,
  show,
  siteHostname,
  subdomain,
}: OnboardingSignupNotificationProps) {
  const { notify } = useNotifications();
  const hasNotified = useRef(false);

  useEffect(() => {
    if (!show || hasNotified.current) {
      return;
    }

    hasNotified.current = true;

    notify(
      createNotificationFromType(
        plotKeysNotificationTypes,
        "signup_successful",
        {
          companyName,
          dashboardHostname,
          email,
          fullName,
          siteHostname,
          subdomain,
        },
        {
          description: `Your account is ready. Continue onboarding ${companyName} and claim ${siteHostname}.`,
          recipients: [
            createUserNotificationContact({
              displayName: fullName,
              email,
              userId: email,
            }),
          ],
        },
      ),
    );
  }, [
    companyName,
    dashboardHostname,
    email,
    fullName,
    notify,
    show,
    siteHostname,
    subdomain,
  ]);

  return null;
}

"use client";

import {
  makeUserRecipients,
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
  const { service } = useNotifications();
  const hasNotified = useRef(false);

  useEffect(() => {
    if (!show || hasNotified.current) {
      return;
    }

    hasNotified.current = true;

    service.send("signup_successful", {
      payload: {
        companyName,
        dashboardHostname,
        email,
        fullName,
        siteHostname,
        subdomain,
      },
      recipients: makeUserRecipients({
        displayName: fullName,
        email,
        userId: email,
      }),
    });
  }, [
    companyName,
    dashboardHostname,
    email,
    fullName,
    service,
    show,
    siteHostname,
    subdomain,
  ]);

  return null;
}

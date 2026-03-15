export type EmailPayload = {
  subject: string;
  to: string;
};

export function createEmailPayload(subject: string, to: string): EmailPayload {
  return {
    subject,
    to,
  };
}

export * from "../defaults";

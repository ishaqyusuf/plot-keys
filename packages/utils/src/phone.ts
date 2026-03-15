const phoneNumberPattern = /^\+[1-9]\d{7,14}$/;

export function normalizePhoneNumber(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const normalized = trimmed.startsWith("+")
    ? `+${trimmed.slice(1).replace(/\D/g, "")}`
    : `+${trimmed.replace(/\D/g, "")}`;

  return normalized;
}

export function isNormalizedPhoneNumber(value: string) {
  return phoneNumberPattern.test(value);
}

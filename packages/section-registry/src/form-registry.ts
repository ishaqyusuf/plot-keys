/**
 * Form action registry.
 *
 * Maps section types to the public tRPC form procedure that should be called
 * when a visitor submits a form on the tenant public site.
 *
 * This registry is used by the tenant-site app to resolve which API endpoint
 * to call for a given section without hard-coding procedure names in section
 * components.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The known public form action identifiers. */
export type FormActionKind =
  | "contact"
  | "newsletter_signup"
  | "property_inquiry"
  | "seller_inquiry"
  | "buyer_inquiry";

/** A resolved form action descriptor used by the site renderer. */
export type FormAction = {
  /** The form action kind — maps to a tRPC procedure in `forms` router. */
  kind: FormActionKind;
  /**
   * Optional display label for the submit button.
   * Falls back to sensible per-kind defaults when omitted.
   */
  submitLabel?: string;
};

/** Section types that contain a form and their default action. */
export type SectionFormBinding = {
  action: FormAction;
  /** The section `type` string as used in `SectionDefinition.type`. */
  sectionType: string;
};

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

/**
 * Default form action bindings for known form-bearing section types.
 *
 * Add a new entry here whenever a new form section is introduced so the
 * tenant-site renderer can resolve the correct submission endpoint.
 */
export const sectionFormBindings: SectionFormBinding[] = [
  {
    action: { kind: "contact", submitLabel: "Send message" },
    sectionType: "contact_section",
  },
  {
    action: { kind: "property_inquiry", submitLabel: "Request viewing" },
    sectionType: "property_inquiry_form",
  },
  {
    action: { kind: "newsletter_signup", submitLabel: "Subscribe" },
    sectionType: "newsletter_section",
  },
  {
    action: { kind: "seller_inquiry", submitLabel: "Get a valuation" },
    sectionType: "seller_form",
  },
  {
    action: { kind: "buyer_inquiry", submitLabel: "Find my home" },
    sectionType: "buyer_form",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the `FormAction` bound to a section type, or `undefined` when the
 * section type does not include a form.
 */
export function getFormAction(sectionType: string): FormAction | undefined {
  return sectionFormBindings.find((b) => b.sectionType === sectionType)?.action;
}

/**
 * Returns `true` when the given section type has a form action bound to it.
 */
export function isSectionFormBound(sectionType: string): boolean {
  return sectionFormBindings.some((b) => b.sectionType === sectionType);
}

/**
 * Returns the tRPC procedure path for a given `FormActionKind`.
 *
 * Maps to the procedures in `apps/api/src/routers/forms.route.ts`.
 */
export function getFormProcedurePath(kind: FormActionKind): string {
  const paths: Record<FormActionKind, string> = {
    buyer_inquiry: "forms.submitContact",
    contact: "forms.submitContact",
    newsletter_signup: "forms.submitNewsletterSignup",
    property_inquiry: "forms.submitInquiry",
    seller_inquiry: "forms.submitContact",
  };
  return paths[kind];
}

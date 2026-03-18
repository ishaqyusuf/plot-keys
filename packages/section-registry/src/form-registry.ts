/**
 * Form action registry.
 *
 * Maps section types to their corresponding tRPC form procedure paths.
 * Used by section components to know which API endpoint to submit to
 * without hard-coding procedure paths in render logic.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FormActionKind =
  | "contact"
  | "inquiry"
  | "newsletter"
  | "seller"
  | "buyer";

export type FormAction = {
  /** The tRPC procedure path (e.g. "forms.submitContact"). */
  procedure: string;
  /** Semantic kind for analytics and notification routing. */
  kind: FormActionKind;
  /** Human-readable label for the submit button. */
  label: string;
};

export type SectionFormBinding = {
  /** The section component type identifier. */
  sectionType: string;
  formAction: FormAction;
};

// ---------------------------------------------------------------------------
// Default bindings
// ---------------------------------------------------------------------------

/** Default map of section types to form procedures. */
export const sectionFormBindings: Record<string, FormAction> = {
  contact_section: {
    kind: "contact",
    label: "Send message",
    procedure: "forms.submitContact",
  },
  property_inquiry_form: {
    kind: "inquiry",
    label: "Request information",
    procedure: "forms.submitInquiry",
  },
  newsletter_section: {
    kind: "newsletter",
    label: "Subscribe",
    procedure: "forms.submitNewsletterSignup",
  },
  seller_form: {
    kind: "seller",
    label: "Get a valuation",
    procedure: "forms.submitContact",
  },
  buyer_form: {
    kind: "buyer",
    label: "Start your search",
    procedure: "forms.submitContact",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the FormAction for a given section type, or undefined when the
 * section type has no registered form binding.
 */
export function getFormAction(sectionType: string): FormAction | undefined {
  return sectionFormBindings[sectionType];
}

/**
 * Returns true when the section type has a registered form binding.
 */
export function isSectionFormBound(sectionType: string): boolean {
  return sectionType in sectionFormBindings;
}

/**
 * Returns the tRPC procedure path for a section type, or undefined when
 * no binding exists.
 */
export function getFormProcedurePath(sectionType: string): string | undefined {
  return sectionFormBindings[sectionType]?.procedure;
}

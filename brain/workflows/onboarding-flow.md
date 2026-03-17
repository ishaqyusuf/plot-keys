# Onboarding Flow

## Purpose
This workflow defines how a tenant moves from first signup to the first editable website draft.

## Workflow

### Step 1: Business Identity
- Collect:
  - `businessName`
  - optional `tagline`
  - `businessType`
  - `primaryGoal`
- System actions:
  - save onboarding progress
  - generate initial business summary
  - prepare tenant profile base

### Step 2: Market Focus
- Collect:
  - `locations`
  - `propertyTypes`
  - optional `targetAudience`
- System actions:
  - enrich tenant profile
  - classify segment
  - prepare template scoring context

### Step 3: Brand Style
- Collect:
  - `tone`
  - `stylePreference`
  - optional `preferredColorHint`
- System actions:
  - infer `designIntent`
  - select default font
  - select default color system
  - select default style preset

### Step 4: Contact And Operations
- Collect:
  - `phone`
  - `email`
  - `whatsapp`
  - `officeAddress`
- System actions:
  - prefill contact page defaults
  - prefill footer details
  - prefill inquiry and CTA sections

### Step 5: Content Readiness
- Collect:
  - `hasLogo`
  - `hasListings`
  - `hasExistingContent`
  - optional `hasAgents`
  - optional `hasProjects`
  - optional `hasTestimonials`
  - optional `hasBlogContent`
- System actions:
  - decide which sections should be hidden initially
  - determine whether AI content generation is needed
  - determine whether placeholder content is needed

### Step 6: Tenant Profile Generation
- Build internal profile fields:
  - `segment`
  - `complexity`
  - `designIntent`
  - `conversionFocus`

### Step 7: Template Recommendation
- Score templates against the derived tenant profile.
- Outputs:
  - top recommended templates
  - fallback templates
  - optional premium upgrade suggestions

### Step 8: Default Config Generation
- Select:
  - `font`
  - `colorSystem`
  - `stylePreset`
  - default page composition rules

### Step 9: AI Content Bootstrapping
- If content readiness is low, generate:
  - hero title
  - hero subtitle
  - CTA text
  - company intro
  - section intros
  - contact descriptions

### Step 10: Draft Website Creation
- Create draft website
- Install selected template
- Copy pages
- Copy section instances
- Apply personalized config
- Apply contact information
- Save initial theme settings

### Step 11: Open Editor
- User lands in either:
  - recommended template preview
  - initialized draft editor

## UX Goal
- The system should feel like:
  - `Your website is ready`
- Not:
  - `Now start building your website from scratch`

## Important Logic Rules
- onboarding must be resumable
- onboarding must save progress step-by-step
- onboarding data must remain editable later
- template recommendation should be repeatable
- design defaults should be re-runnable if the user changes core identity inputs

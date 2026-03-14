# API Contracts

## Purpose
This file tracks request and response shape conventions.

## How To Use
- Update when public or internal API contract patterns become concrete.
- Keep examples short and schema-oriented.

## Initial Contract Rules
- Validate input and output at service boundaries.
- Preserve tenant scoping in all contracts.
- Prefer explicit enums for status-driven workflows.
- Use structured payloads for website sections and AI outputs.

## Planned Enums
- `LeadStatus`: `NEW`, `CONTACTED`, `NEGOTIATING`, `CLOSED`
- `ClientStage`: `NEW_LEAD`, `INTERESTED`, `NEGOTIATING`, `CLOSED`
- `PaymentMethod`: `PAYSTACK`, `FLUTTERWAVE`, `STRIPE`, `BANK_TRANSFER`, `CASH`

## Structured Builder Contract Example
```json
{
  "page": "home",
  "sections": [
    {
      "type": "hero_banner",
      "config": {
        "title": "Luxury Apartments",
        "subtitle": "Find your dream home",
        "backgroundImage": "hero.jpg"
      }
    }
  ]
}
```

## AI Output Contract Rules
- JSON only for structured website generation flows
- Validate against section schema before persistence
- Reject unrecognized section types

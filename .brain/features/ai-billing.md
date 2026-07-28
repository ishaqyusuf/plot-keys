# AI Billing

## Purpose
This file documents the AI credit and usage billing system.

## Goal
Enable tenant-safe monetization of AI features through credits, usage tracking, and top-up purchases.

## Scope
- Monthly plan credit allowances
- Purchased credit packs
- Promotional credits
- Usage tracking
- Credit deduction
- AI feature disabling when credits are exhausted

## AI Features That Consume Credits
- Website content generation
- Property description generation
- Blog post generation
- Lead reply assistant
- Email generation
- Marketing copy generation
- SEO content generation
- Website redesign suggestions
- Property landing page generation

## Example Credit Costs
- Property description: 5 credits
- Homepage content: 20 credits
- Full website: 50 credits
- Blog article: 25 credits
- Lead response: 3 credits

## Required Usage Fields
- `companyId`
- `userId`
- `feature`
- `tokensUsed`
- `creditsUsed`
- `timestamp`

## Architectural Rule
- Every AI call must go through a centralized AI service such as `aiService.generate()`.
- That service owns usage logging, credit calculation, deduction, and analytics recording.

## Open Items
- TODO: Ledger model vs balance snapshot
- TODO: Credit expiry policy
- TODO: Refund and retry behavior for failed generations

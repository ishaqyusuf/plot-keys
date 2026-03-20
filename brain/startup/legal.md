# Legal & Compliance

## Purpose
Track legal requirements, compliance obligations, and policy documents needed before and after launch.

## How To Use
- Update as legal matters are researched or resolved.
- Mark items as done when documents are drafted and reviewed.

## Company Formation
- [ ] Register business entity (Nigeria — LLC or LTD)
- [ ] Obtain CAC registration certificate
- [ ] Open business bank account
- [ ] Trademark "PlotKeys" name and logo

## Terms & Policies (Required Before Launch)
- [ ] Terms of Service — governs tenant (company) use of the platform
- [ ] Privacy Policy — data collection, processing, retention, and sharing
- [ ] Acceptable Use Policy — prohibited content and behavior on tenant sites
- [ ] Cookie Policy — cookie usage on platform and tenant sites
- [ ] Data Processing Agreement (DPA) — for tenants handling customer data through the platform
- [ ] Refund/Cancellation Policy — subscription cancellation, prorated refunds, template purchases

## Data Protection & Privacy
- **NDPR (Nigeria Data Protection Regulation)**
  - [ ] Register as a data controller with NITDA
  - [ ] Appoint a Data Protection Officer (DPO)
  - [ ] Conduct Data Protection Impact Assessment (DPIA)
  - [ ] Maintain Records of Processing Activities (ROPA)
  - [ ] Implement data subject rights (access, rectification, deletion, portability)
  - [ ] Define lawful basis for processing (consent, contract, legitimate interest)
  - [ ] Establish data breach notification procedures (72-hour rule)
- **GDPR Considerations** (if serving EU/UK customers)
  - [ ] Determine if GDPR applies (EU-based tenants or customers)
  - [ ] EU representative appointment if required
  - [ ] Cross-border data transfer mechanisms (SCCs)

## Multi-Tenant Legal Considerations
- PlotKeys is both data controller (platform data) and data processor (tenant customer data)
- Tenant companies are data controllers for their own customers
- DPA must clearly delineate responsibilities
- Tenant sites must display their own privacy policies — platform should provide a default template
- Customer data isolation between tenants is a legal requirement, not just a feature

## Payment & Financial Compliance
- [ ] Register with relevant financial regulators if processing payments
- [ ] PCI DSS compliance scope assessment (likely SAQ-A if using Paystack/Flutterwave hosted checkout)
- [ ] Anti-money laundering (AML) considerations for property transactions
- [ ] Define dispute resolution and chargeback handling procedures

## Intellectual Property
- [ ] Contributor/employee IP assignment agreements
- [ ] Open-source license audit for dependencies
- [ ] Template and stock image licensing terms for tenants
- [ ] AI-generated content ownership terms (who owns AI output — tenant or platform?)

## Insurance
- [ ] Professional indemnity / errors & omissions insurance
- [ ] Cyber liability insurance

## Open Questions
- What jurisdiction governs the Terms of Service?
- Do we need separate terms for tenant companies vs. their end customers?
- How do we handle tenant sites that collect sensitive data (ID documents, financial info)?
- What are the tax implications of AI credit sales vs. subscription revenue?

"use client"

import { useState } from "react"

type ContactInquiryConfig = {
  title: string
  submitText: string
  successMessage: string
  errorMessage: string
  actionType: "contact.lead.create" | "property.inquiry.create"
  propertyId?: string
}

type Props = {
  config: ContactInquiryConfig
  isVisible?: boolean
}

export function ContactInquirySection({
  config,
  isVisible = true,
}: Props) {
  const [success, setSuccess] = useState<string | null>(null)

  if (!isVisible) return null

  return (
    <section>
      <h2>{config.title}</h2>
      <button type="button" onClick={() => setSuccess(config.successMessage)}>
        {config.submitText}
      </button>
      {success ? <p>{success}</p> : null}
    </section>
  )
}

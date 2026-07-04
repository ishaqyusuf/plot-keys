export interface WhatsAppMessageInput {
  to: string;
  body?: string;
  template?: {
    name: string;
    variables: Record<string, string>;
  };
}

export class WhatsAppService {
  #accountSid: string;
  #authToken: string;
  #fromNumber: string;

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.#accountSid = accountSid;
    this.#authToken = authToken;
    this.#fromNumber = fromNumber;
  }

  async send(input: WhatsAppMessageInput) {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.#accountSid}/Messages.json`;

    const params = new URLSearchParams();
    params.append("To", `whatsapp:${input.to}`);
    params.append("From", `whatsapp:${this.#fromNumber}`);

    if (input.body) {
      params.append("Body", input.body);
    }

    const auth = btoa(`${this.#accountSid}:${this.#authToken}`);

    const response = await fetch(url, {
      body: params.toString(),
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Twilio API Error: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const data = (await response.json()) as {
      sid?: string;
      status?: string;
    };

    return { providerId: data.sid, status: data.status };
  }
}

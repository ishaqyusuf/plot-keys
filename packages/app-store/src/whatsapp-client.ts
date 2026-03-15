const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0";

type WhatsAppClientOptions = {
  accessToken: string;
  phoneNumberId: string;
};

export class WhatsAppClient {
  constructor(private readonly options: WhatsAppClientOptions) {}

  async sendMessage(to: string, message: string) {
    return this.request("/messages", {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      text: {
        body: message,
      },
      to,
      type: "text",
    });
  }

  private async request(path: string, body: unknown) {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${this.options.phoneNumberId}${path}`,
      {
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${this.options.accessToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `WhatsApp request failed with ${response.status}: ${errorText}`,
      );
    }

    return response.json();
  }
}

export function createWhatsAppClient() {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    throw new Error(
      "Missing WhatsApp configuration: WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN are required.",
    );
  }

  return new WhatsAppClient({
    accessToken,
    phoneNumberId,
  });
}

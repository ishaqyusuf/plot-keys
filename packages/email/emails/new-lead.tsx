import {
  Body,
  Button,
  Container,
  Heading,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Footer } from "../components/footer";
import { Logo } from "../components/logo";
import {
  EmailThemeProvider,
  getEmailInlineStyles,
  getEmailThemeClasses,
} from "../components/theme";

type NewLeadEmailProps = {
  companyName: string;
  dashboardUrl: string;
  fullName: string;
  leadEmail: string;
  leadMessage?: string;
  leadName: string;
};

export function NewLeadEmail({
  companyName = "Aster Grove Realty",
  dashboardUrl = "https://dashboard.plotkeys.com/leads",
  fullName = "Amara Okafor",
  leadEmail = "visitor@example.com",
  leadMessage = "I'm interested in your listings in Victoria Island.",
  leadName = "Chidi Ezekwesili",
}: NewLeadEmailProps) {
  const themeClasses = getEmailThemeClasses();
  const styles = getEmailInlineStyles();
  const firstName = fullName.split(" ").at(0) ?? fullName;
  const previewText = `New lead for ${companyName}: ${leadName}`;

  return (
    <EmailThemeProvider preview={<Preview>{previewText}</Preview>}>
      <Body
        className={`mx-auto my-auto ${themeClasses.body}`}
        style={styles.body}
      >
        <Container
          className={`mx-auto my-[40px] max-w-[600px] p-[20px] ${themeClasses.container}`}
          style={{
            borderColor: styles.container.borderColor,
            borderRadius: styles.container.borderRadius,
            borderStyle: "solid",
            borderWidth: 1,
          }}
        >
          <Logo />

          <Heading
            className={`my-[30px] p-0 text-center text-[24px] font-normal ${themeClasses.heading}`}
          >
            New lead captured
          </Heading>

          <Text
            className={`text-[16px] font-medium ${themeClasses.text}`}
            style={styles.text}
          >
            {firstName ? `Hi ${firstName},` : "Hello,"}
          </Text>

          <Text className={themeClasses.text} style={styles.text}>
            A new lead has been captured on your {companyName} website. Here are
            the details:
          </Text>

          <Section
            style={{
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              marginBottom: "24px",
              padding: "16px 20px",
            }}
          >
            <Text
              className={themeClasses.text}
              style={{ ...styles.text, margin: "4px 0" }}
            >
              <strong>Name:</strong> {leadName}
            </Text>
            <Text
              className={themeClasses.text}
              style={{ ...styles.text, margin: "4px 0" }}
            >
              <strong>Email:</strong> {leadEmail}
            </Text>
            {leadMessage ? (
              <Text
                className={themeClasses.text}
                style={{ ...styles.text, margin: "4px 0" }}
              >
                <strong>Message:</strong> {leadMessage}
              </Text>
            ) : null}
          </Section>

          <Section className="mb-[32px] mt-[28px] text-center">
            <Button
              className="rounded-[999px] bg-[#0f766e] px-[18px] py-[12px] text-[14px] font-semibold text-white"
              href={dashboardUrl}
            >
              View all leads
            </Button>
          </Section>

          <Footer />
        </Container>
      </Body>
    </EmailThemeProvider>
  );
}

export default NewLeadEmail;

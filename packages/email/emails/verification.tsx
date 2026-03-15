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
import {
  DEFAULT_VERIFICATION_BUTTON_TEXT,
  defaultVerificationBody,
  defaultVerificationHeading,
  defaultVerificationSubject,
} from "../defaults";

type VerificationEmailProps = {
  companyName: string;
  fullName: string;
  verificationUrl: string;
};

export function VerificationEmail({
  companyName = "Aster Grove Realty",
  fullName = "Amara Okafor",
  verificationUrl = "https://dashboard.plotkeys.com/verify-email?token=demo-token",
}: VerificationEmailProps) {
  const themeClasses = getEmailThemeClasses();
  const styles = getEmailInlineStyles();
  const firstName = fullName.split(" ").at(0) ?? fullName;
  const previewText = defaultVerificationSubject(companyName);

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
            {defaultVerificationHeading(companyName)}
          </Heading>

          <Text
            className={`text-[16px] font-medium ${themeClasses.text}`}
            style={styles.text}
          >
            {firstName ? `Hi ${firstName},` : "Hello,"}
          </Text>

          <Text className={themeClasses.text} style={styles.text}>
            {defaultVerificationBody(companyName)}
          </Text>

          <Text className={themeClasses.text} style={styles.text}>
            Use the button below to verify your email address. This link is
            time-limited for security and should only be used by the person who
            created the workspace.
          </Text>

          <Section className="mb-[32px] mt-[28px] text-center">
            <Button
              className="rounded-[999px] bg-[#0f766e] px-[18px] py-[12px] text-[14px] font-semibold text-white"
              href={verificationUrl}
            >
              {DEFAULT_VERIFICATION_BUTTON_TEXT}
            </Button>
          </Section>

          <Footer />
        </Container>
      </Body>
    </EmailThemeProvider>
  );
}

export default VerificationEmail;

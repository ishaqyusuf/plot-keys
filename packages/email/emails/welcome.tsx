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
  DEFAULT_WELCOME_BUTTON_TEXT,
  defaultWelcomeBody,
  defaultWelcomeHeading,
  defaultWelcomeSubject,
} from "../defaults";

type WelcomeEmailProps = {
  companyName: string;
  ctaUrl: string;
  fullName: string;
  siteHostname: string;
};

export function WelcomeEmail({
  companyName = "Aster Grove Realty",
  ctaUrl = "https://dashboard.plotkeys.com/onboarding",
  fullName = "Amara Okafor",
  siteHostname = "aster-grove.plotkeys.com",
}: WelcomeEmailProps) {
  const themeClasses = getEmailThemeClasses();
  const styles = getEmailInlineStyles();
  const firstName = fullName.split(" ").at(0) ?? fullName;
  const previewText = defaultWelcomeSubject(companyName);

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
            {defaultWelcomeHeading(companyName)}
          </Heading>

          <Text
            className={`text-[16px] font-medium ${themeClasses.text}`}
            style={styles.text}
          >
            {firstName ? `Hi ${firstName},` : "Hello,"}
          </Text>

          <Text className={themeClasses.text} style={styles.text}>
            {defaultWelcomeBody(companyName, siteHostname)}
          </Text>

          <Text className={themeClasses.text} style={styles.text}>
            Your first tenant website hostname is{" "}
            <strong>{siteHostname}</strong>. Finish onboarding to activate the
            workspace, publish content, and get your branded experience ready
            for launch.
          </Text>

          <Section className="mb-[32px] mt-[28px] text-center">
            <Button
              className="rounded-[999px] bg-[#0f766e] px-[18px] py-[12px] text-[14px] font-semibold text-white"
              href={ctaUrl}
            >
              {DEFAULT_WELCOME_BUTTON_TEXT}
            </Button>
          </Section>

          <Footer />
        </Container>
      </Body>
    </EmailThemeProvider>
  );
}

export default WelcomeEmail;

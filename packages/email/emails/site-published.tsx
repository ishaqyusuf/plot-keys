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

type SitePublishedEmailProps = {
  companyName: string;
  configName: string;
  fullName: string;
  siteUrl: string;
};

export function SitePublishedEmail({
  companyName = "Aster Grove Realty",
  configName = "Coastal Living v2",
  fullName = "Amara Okafor",
  siteUrl = "https://aster-grove.plotkeys.com",
}: SitePublishedEmailProps) {
  const themeClasses = getEmailThemeClasses();
  const styles = getEmailInlineStyles();
  const firstName = fullName.split(" ").at(0) ?? fullName;
  const previewText = `${companyName} website published: ${configName}`;

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
            Your site is live!
          </Heading>

          <Text
            className={`text-[16px] font-medium ${themeClasses.text}`}
            style={styles.text}
          >
            {firstName ? `Hi ${firstName},` : "Hello,"}
          </Text>

          <Text className={themeClasses.text} style={styles.text}>
            Great news — your {companyName} website configuration{" "}
            <strong>{configName}</strong> has been published and is now live.
          </Text>

          <Text className={themeClasses.text} style={styles.text}>
            Visitors can now see your latest content, listings, and branding.
            You can continue editing in the builder — changes won't go live
            until you publish again.
          </Text>

          <Section className="mb-[32px] mt-[28px] text-center">
            <Button
              className="rounded-[999px] bg-[#0f766e] px-[18px] py-[12px] text-[14px] font-semibold text-white"
              href={siteUrl}
            >
              View your live site
            </Button>
          </Section>

          <Footer />
        </Container>
      </Body>
    </EmailThemeProvider>
  );
}

export default SitePublishedEmail;

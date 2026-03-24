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
  DEFAULT_WORKSPACE_INVITATION_BUTTON_TEXT,
  defaultWorkspaceInvitationBody,
  defaultWorkspaceInvitationHeading,
  defaultWorkspaceInvitationSubject,
} from "../defaults";

type WorkspaceInvitationEmailProps = {
  companyName: string;
  inviteUrl: string;
  inviterName: string;
  roleLabel: string;
};

export function WorkspaceInvitationEmail({
  companyName = "Aster Grove Realty",
  inviteUrl = "https://dashboard.plotkeys.com/join/demo-token",
  inviterName = "Amara Okafor",
  roleLabel = "an agent",
}: WorkspaceInvitationEmailProps) {
  const themeClasses = getEmailThemeClasses();
  const styles = getEmailInlineStyles();
  const previewText = defaultWorkspaceInvitationSubject(companyName);

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
            {defaultWorkspaceInvitationHeading(companyName)}
          </Heading>

          <Text
            className={`text-[16px] font-medium ${themeClasses.text}`}
            style={styles.text}
          >
            Hello,
          </Text>

          <Text className={themeClasses.text} style={styles.text}>
            {defaultWorkspaceInvitationBody({ companyName, roleLabel })}
          </Text>

          <Text className={themeClasses.text} style={styles.text}>
            {inviterName} invited you to join the workspace. Once you accept,
            you can complete your profile directly on the site.
          </Text>

          <Section className="mb-[32px] mt-[28px] text-center">
            <Button
              className="rounded-[999px] bg-[#0f766e] px-[18px] py-[12px] text-[14px] font-semibold text-white"
              href={inviteUrl}
            >
              {DEFAULT_WORKSPACE_INVITATION_BUTTON_TEXT}
            </Button>
          </Section>

          <Text className={themeClasses.text} style={styles.text}>
            If the button does not work, copy and paste this link into your
            browser:
          </Text>

          <Text className={themeClasses.text} style={styles.text}>
            {inviteUrl}
          </Text>

          <Footer />
        </Container>
      </Body>
    </EmailThemeProvider>
  );
}

export default WorkspaceInvitationEmail;

import {
  BuilderWorkspaceErrorNotice,
  BuilderWorkspaceLockedTemplateNotice,
  BuilderWorkspaceStatusNotice,
} from "./builder-workspace-notice-alerts";

export type BuilderWorkspaceNoticeState = {
  error?: string;
  generated?: string;
  onboarding?: string;
  saved?: string;
};

type Props = {
  activeTemplateLabel: string;
  isTemplateLocked: boolean;
  lockedTemplateMessage: string;
  notices?: BuilderWorkspaceNoticeState;
};

export function BuilderWorkspaceNotices({
  activeTemplateLabel,
  isTemplateLocked,
  lockedTemplateMessage,
  notices,
}: Props) {
  const statusMessage = getBuilderWorkspaceStatusMessage(notices);

  return (
    <>
      {notices?.error ? (
        <BuilderWorkspaceErrorNotice message={notices.error} />
      ) : null}

      {isTemplateLocked ? (
        <BuilderWorkspaceLockedTemplateNotice
          activeTemplateLabel={activeTemplateLabel}
          lockedTemplateMessage={lockedTemplateMessage}
        />
      ) : null}

      {statusMessage ? (
        <BuilderWorkspaceStatusNotice message={statusMessage} />
      ) : null}
    </>
  );
}

function getBuilderWorkspaceStatusMessage(
  notices?: BuilderWorkspaceNoticeState,
) {
  if (notices?.onboarding) {
    return "Step 06 continues here. Configure your website look and text, then use Publish current configuration when you are ready to launch the live site.";
  }

  if (notices?.generated) {
    return "A smart-fill suggestion was applied to the field.";
  }

  if (notices?.saved) {
    return "Your field update was saved.";
  }

  return null;
}

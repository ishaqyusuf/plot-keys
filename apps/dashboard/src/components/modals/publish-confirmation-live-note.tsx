type Props = {
  currentLiveName?: string;
};

export function PublishConfirmationLiveNote({ currentLiveName }: Props) {
  if (!currentLiveName) {
    return null;
  }

  return (
    <p className="text-xs text-muted-foreground">
      Currently live:{" "}
      <span className="text-xs font-medium text-foreground">
        {currentLiveName}
      </span>{" "}
      — it will be archived and can be re-published from the configuration list.
    </p>
  );
}

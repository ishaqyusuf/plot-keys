import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  frameHeader?: ReactNode;
  isCanvas: boolean;
  readOnlyNotice?: ReactNode;
};

export function BuilderPreviewShell({
  children,
  frameHeader,
  isCanvas,
  readOnlyNotice,
}: Props) {
  return (
    <div
      className={
        isCanvas
          ? "flex h-full min-h-0 flex-col overflow-hidden bg-background"
          : "mx-auto overflow-hidden border bg-background"
      }
    >
      {frameHeader}
      {readOnlyNotice}
      {children}
    </div>
  );
}

import {
  ClickGuardProvider,
  InlineOverview,
  SmartFillProvider,
} from "@plotkeys/section-registry";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className: string;
  onSmartFill: (contentKey: string) => Promise<void>;
  readOnly: boolean;
  style: CSSProperties;
};

export function BuilderPreviewGuardedFrame({
  children,
  className,
  onSmartFill,
  readOnly,
  style,
}: Props) {
  const frame = (
    <ClickGuardProvider>
      <div className={className} style={style}>
        {children}
      </div>
      <InlineOverview />
    </ClickGuardProvider>
  );

  if (readOnly) {
    return frame;
  }

  return (
    <SmartFillProvider onSmartFill={onSmartFill}>{frame}</SmartFillProvider>
  );
}

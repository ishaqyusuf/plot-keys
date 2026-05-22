import { Img, Section } from "@react-email/components";

const PLOTKEYS_LOGO_SRC = "https://plotkeys.com/logo-horizontal.png";

export function Logo() {
  return (
    <Section>
      <Img
        alt="PlotKeys logo"
        className="mx-auto h-12 w-auto"
        src={PLOTKEYS_LOGO_SRC}
      />
    </Section>
  );
}

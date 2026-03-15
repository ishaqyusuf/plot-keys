import { Hr, Section, Text } from "@react-email/components";

export function Footer() {
  return (
    <Section className="mt-[32px]">
      <Hr className="border-slate-200" />
      <Text className="mt-[16px] text-[12px] leading-[20px] text-slate-500">
        PlotKeys helps real-estate companies manage operations and launch
        branded websites from one workspace.
      </Text>
    </Section>
  );
}

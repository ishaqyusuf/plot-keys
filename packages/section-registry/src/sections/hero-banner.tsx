type HeroBannerConfig = {
  ctaText: string;
  subtitle: string;
  title: string;
};

type ThemeConfig = {
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
};

export function HeroBannerSection({
  config,
  theme,
}: {
  config: HeroBannerConfig;
  theme: ThemeConfig;
}) {
  return (
    <section
      className="px-8 py-20 md:px-16"
      style={{
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
      }}
    >
      <p
        className="text-sm uppercase tracking-[0.35em]"
        style={{ color: theme.accentColor }}
      >
        Premium Real Estate
      </p>
      <h1 className="mt-4 max-w-3xl text-5xl font-semibold text-slate-950 md:text-7xl">
        {config.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-slate-600">{config.subtitle}</p>
      <div
        className="mt-8 inline-flex rounded-full px-5 py-3 text-sm font-medium text-white"
        style={{ backgroundColor: theme.accentColor }}
      >
        {config.ctaText}
      </div>
    </section>
  );
}

export type { HeroBannerConfig, ThemeConfig };

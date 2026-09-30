const diagramPlots = [
  { code: "A12", left: 22, top: 20, width: 100 },
  { code: "A13", left: 133, top: 20, width: 100 },
  { code: "A14", left: 244, top: 20, width: 77 },
  { code: "A15", left: 332, top: 20, width: 100 },
  { code: "B01", left: 22, top: 160, width: 100 },
  { code: "B02", left: 133, top: 160, width: 100 },
  { code: "B03", left: 244, top: 160, width: 100 },
  { code: "B04", left: 355, top: 160, width: 77 },
] as const;

export function SocialPreviewImage({ logoSrc }: { logoSrc: string }) {
  return (
    <div
      style={{
        background: "#18334F",
        color: "#FFFFFF",
        display: "flex",
        fontFamily: "Arial, Helvetica, sans-serif",
        height: "100%",
        overflow: "hidden",
        padding: "54px 62px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          borderLeft: "1px solid #315671",
          height: 630,
          left: 665,
          position: "absolute",
          top: 0,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          position: "relative",
          width: 575,
        }}
      >
        {/* ImageResponse renders standard image elements instead of next/image. */}
        {/* biome-ignore lint/performance/noImgElement: ImageResponse requires a plain image element. */}
        <img
          alt="PlotKeys"
          height={69}
          src={logoSrc}
          style={{
            height: 69,
            objectFit: "contain",
            objectPosition: "left",
            width: 202,
          }}
          width={202}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: "#B7D0DF",
              display: "flex",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 3,
            }}
          >
            PROPERTY BUSINESS, ON THE SAME PAGE
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 62,
              fontWeight: 500,
              letterSpacing: -3.4,
              lineHeight: 1.02,
            }}
          >
            <span>From the</span>
            <span>ground up.</span>
            <span style={{ color: "#AFCBDD" }}>Every detail</span>
            <span style={{ color: "#AFCBDD" }}>connected.</span>
          </div>
          <div
            style={{
              color: "#D5E2EB",
              display: "flex",
              fontSize: 21,
              lineHeight: 1.35,
              maxWidth: 515,
            }}
          >
            A professional company website. A connected workspace behind it.
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            borderTop: "1px solid #4E7089",
            color: "#BED0DF",
            display: "flex",
            fontSize: 17,
            height: 38,
            justifyContent: "space-between",
            width: 540,
          }}
        >
          <span>plotkeys.com</span>
          <span>Request early access</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          left: 720,
          position: "absolute",
          top: 93,
          width: 443,
        }}
      >
        <div
          style={{
            color: "#C3D8E5",
            display: "flex",
            fontSize: 14,
            justifyContent: "space-between",
            letterSpacing: 1.2,
            width: "100%",
          }}
        >
          <span>PALM COURT / SAMPLE ESTATE</span>
          <span>N ↑</span>
        </div>
        <div
          style={{
            border: "1px dashed #61829B",
            display: "flex",
            height: 266,
            position: "relative",
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              borderBottom: "1px dashed #7799AF",
              borderTop: "1px dashed #7799AF",
              color: "#B7D0DF",
              display: "flex",
              fontSize: 12,
              height: 35,
              justifyContent: "center",
              left: 0,
              letterSpacing: 4,
              position: "absolute",
              top: 111,
              width: "100%",
            }}
          >
            PALM AVENUE
          </div>
          {diagramPlots.map((plot) => (
            <div
              key={plot.code}
              style={{
                alignItems: "center",
                background: plot.code === "A12" ? "#D9E7ED" : "#234560",
                border:
                  plot.code === "A12"
                    ? "2px solid #FFFFFF"
                    : "1px solid #9FBFD2",
                color: plot.code === "A12" ? "#18334F" : "#E2EEF4",
                display: "flex",
                fontSize: 17,
                height: 75,
                justifyContent: "center",
                left: plot.left,
                position: "absolute",
                top: plot.top,
                width: plot.width,
              }}
            >
              {plot.code}
            </div>
          ))}
        </div>
        <div
          style={{
            background: "#EAF1F5",
            color: "#18334F",
            display: "flex",
            flexDirection: "column",
            gap: 9,
            padding: "18px 22px",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "#526575",
              display: "flex",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            A PROPERTY IN CONTEXT
          </div>
          <div
            style={{
              alignItems: "baseline",
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span style={{ fontSize: 32, fontWeight: 500 }}>Plot A12</span>
            <span style={{ fontSize: 17 }}>500 m² · Residential land</span>
          </div>
        </div>
        <div style={{ color: "#AFCBDD", display: "flex", fontSize: 12 }}>
          Illustrative layout · No live availability or reservation
        </div>
      </div>
    </div>
  );
}

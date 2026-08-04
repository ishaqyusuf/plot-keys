const pipelineRows = [
  ["Listings", "Published", "12"],
  ["New interest", "Ready to follow up", "28"],
  ["Site templates", "Brand aligned", "04"],
] as const;

function PlotKeysMark() {
  return (
    <div
      style={{
        background: "#0F6B61",
        borderRadius: 18,
        display: "flex",
        height: 70,
        overflow: "hidden",
        position: "relative",
        width: 70,
      }}
    >
      <div
        style={{
          background: "#F8F5EF",
          display: "flex",
          height: 18,
          left: 11,
          position: "absolute",
          top: 16,
          transform: "skewY(-28deg)",
          width: 20,
        }}
      />
      <div
        style={{
          background: "#D9E3DE",
          display: "flex",
          height: 18,
          left: 38,
          position: "absolute",
          top: 16,
          transform: "skewY(28deg)",
          width: 20,
        }}
      />
      <div
        style={{
          background: "#F8F5EF",
          bottom: 14,
          display: "flex",
          height: 20,
          left: 11,
          position: "absolute",
          width: 20,
        }}
      />
      <div
        style={{
          background: "#C9A45B",
          borderRadius: 999,
          bottom: 14,
          display: "flex",
          height: 20,
          position: "absolute",
          right: 12,
          width: 20,
        }}
      />
    </div>
  );
}

export function SocialPreviewImage() {
  return (
    <div
      style={{
        alignItems: "stretch",
        background: "#F8F5EF",
        color: "#121B24",
        display: "flex",
        fontFamily: "Arial, Helvetica, sans-serif",
        height: "100%",
        overflow: "hidden",
        padding: 58,
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          backgroundImage:
            "linear-gradient(rgba(18,27,36,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(18,27,36,0.055) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
          display: "flex",
          inset: 0,
          position: "absolute",
        }}
      />
      <div
        style={{
          background: "rgba(15,107,97,0.13)",
          borderRadius: 999,
          display: "flex",
          height: 500,
          position: "absolute",
          right: -160,
          top: -250,
          width: 500,
        }}
      />

      <div
        style={{
          display: "flex",
          gap: 52,
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: "1 1 0",
            flexDirection: "column",
            justifyContent: "space-between",
            minWidth: 0,
          }}
        >
          <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
            <PlotKeysMark />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 36,
                  fontWeight: 900,
                  letterSpacing: -1.5,
                }}
              >
                PlotKeys
              </div>
              <div
                style={{
                  color: "#56636D",
                  display: "flex",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                Real-estate operating system
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
              maxWidth: 670,
            }}
          >
            <div
              style={{
                color: "#0F6B61",
                display: "flex",
                fontSize: 23,
                fontWeight: 900,
              }}
            >
              One operating record
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 65,
                fontWeight: 900,
                letterSpacing: -3,
                lineHeight: 0.98,
              }}
            >
              The operating layer behind serious property companies.
            </div>
            <div
              style={{
                color: "#52606B",
                display: "flex",
                fontSize: 27,
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              Listings, customer interest, team follow-up, and branded property
              websites in one calm system.
            </div>
          </div>

          <div
            style={{
              alignItems: "center",
              display: "flex",
              fontSize: 22,
              fontWeight: 900,
              gap: 12,
            }}
          >
            <div
              style={{
                background: "#0F6B61",
                borderRadius: 999,
                display: "flex",
                height: 11,
                width: 11,
              }}
            />
            plotkeys.com
          </div>
        </div>

        <div
          style={{
            alignSelf: "center",
            background: "#FFFFFF",
            border: "1px solid rgba(18,27,36,0.1)",
            borderRadius: 28,
            boxShadow: "0 28px 70px rgba(18,27,36,0.17)",
            display: "flex",
            flex: "0 0 390px",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#121B24",
              color: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: "23px 25px",
            }}
          >
            <div style={{ display: "flex", fontSize: 18, fontWeight: 900 }}>
              Company workspace
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.58)",
                display: "flex",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Website and operations connected
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              padding: 23,
            }}
          >
            {pipelineRows.map(([label, detail, value]) => (
              <div
                key={label}
                style={{
                  alignItems: "center",
                  background: "#F8F5EF",
                  border: "1px solid rgba(18,27,36,0.08)",
                  borderRadius: 17,
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "17px 18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 7,
                  }}
                >
                  <div
                    style={{ display: "flex", fontSize: 17, fontWeight: 900 }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      color: "#68737B",
                      display: "flex",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {detail}
                  </div>
                </div>
                <div
                  style={{
                    alignItems: "center",
                    background: "#D9E3DE",
                    borderRadius: 13,
                    color: "#0F6B61",
                    display: "flex",
                    fontSize: 18,
                    fontWeight: 900,
                    height: 45,
                    justifyContent: "center",
                    width: 48,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
            <div
              style={{
                alignItems: "center",
                background: "#0F6B61",
                borderRadius: 16,
                color: "#FFFFFF",
                display: "flex",
                fontSize: 16,
                fontWeight: 900,
                justifyContent: "center",
                padding: 16,
              }}
            >
              Choose a template. Launch your site.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

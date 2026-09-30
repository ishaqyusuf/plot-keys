"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EarlyAccessForm } from "../early-access-form";
import "./plotkeys-landing.css";

const plots = {
  A12: {
    area: "500 m²",
    path: "M55 68 L162 62 L167 132 L58 139 Z",
    x: 88,
    y: 108,
  },
  A13: {
    area: "540 m²",
    path: "M177 61 L281 56 L286 127 L182 132 Z",
    x: 214,
    y: 102,
  },
  A14: {
    area: "450 m²",
    path: "M296 55 L368 51 L374 123 L302 126 Z",
    x: 319,
    y: 98,
  },
  B03: {
    area: "500 m²",
    path: "M433 176 L544 170 L553 255 L440 261 Z",
    x: 474,
    y: 227,
  },
} as const;
type PlotId = keyof typeof plots;
const otherPlots = [
  { id: "A15", path: "M422 47 L530 42 L537 115 L428 120 Z", x: 465, y: 91 },
  { id: "A16", path: "M546 41 L661 36 L670 109 L552 114 Z", x: 590, y: 87 },
  { id: "B01", path: "M61 195 L171 190 L175 274 L64 279 Z", x: 96, y: 242 },
  { id: "B02", path: "M187 189 L290 184 L295 268 L191 273 Z", x: 220, y: 236 },
  { id: "B04", path: "M306 183 L379 179 L384 264 L311 267 Z", x: 326, y: 232 },
  { id: "B05", path: "M560 169 L677 163 L687 249 L569 254 Z", x: 605, y: 222 },
];
const scenes = [
  {
    tab: "01 Website",
    kicker: "A clear first impression",
    title: "Give the property a place to be discovered.",
    description:
      "Present the listing on your company website, with the location, plot area and a clear way to get in touch.",
    label: "Company website",
    next: "Enquire with the team",
  },
  {
    tab: "02 Enquiry",
    kicker: "Interest with context",
    title: "Keep the property in the conversation.",
    description:
      "An enquiry connects a prospective customer and the listing they asked about, so the team can respond with context.",
    label: "Customer enquiry",
    next: "Review the enquiry",
  },
  {
    tab: "03 Follow-up",
    kicker: "A clearer next action",
    title: "Help the right person follow through.",
    description:
      "Bring the property, customer conversation and responsible team member into one operating workspace.",
    label: "Team workspace",
    next: "Team follow-up",
  },
];
const styles = [
  { name: "Coastal", color: "#183e42" },
  { name: "Slate", color: "#16324f" },
  { name: "Clay", color: "#775143" },
];
const roles = [
  {
    name: "Company owners",
    kicker: "For company owners",
    title: "A company that looks as organised as it is.",
    description:
      "Build a credible public presence while keeping estates, listings and client conversations in view.",
    rows: [
      ["Public presence", "Company website"],
      ["Behind the scenes", "Team workspace"],
    ],
  },
  {
    name: "Estate & land-sales teams",
    kicker: "For estate and land-sales teams",
    title: "See the details behind every plot.",
    description:
      "Keep estate records and plot details in context as your team works through land enquiries.",
    rows: [
      ["Estate", "Palm Court"],
      ["Property context", "Plot A12 · 500 m²"],
    ],
  },
  {
    name: "Agencies & agents",
    kicker: "For agencies and agents",
    title: "Make each enquiry easier to act on.",
    description:
      "Connect public listings to customer interest and give agents a clearer starting point for follow-up.",
    rows: [
      ["Listing", "Palm Court · A12"],
      ["Next step", "Team follow-up"],
    ],
  },
  {
    name: "Website & marketing teams",
    kicker: "For website and marketing teams",
    title: "Publish with your company in mind.",
    description:
      "Choose a curated template, adapt the available content and branding, then preview before publishing.",
    rows: [
      ["Starting point", "Curated template"],
      ["Publishing", "Draft preview"],
    ],
  },
  {
    name: "Project operations",
    kicker: "For project operations",
    title: "Keep project progress in context.",
    description:
      "Organise internal phases and milestones alongside the property business your team is running.",
    rows: [
      ["Project view", "Phases and milestones"],
      ["Audience", "Internal team"],
    ],
  },
];
const questions = [
  [
    "Who is PlotKeys for?",
    "PlotKeys is for real-estate companies, estate developers, agencies and the teams behind them. The company gets an operating workspace and a branded public website.",
  ],
  [
    "Is this a property marketplace?",
    "Your listings belong on your company's own website. PlotKeys provides the platform behind that website and your internal operations.",
  ],
  [
    "Can I design my website from scratch?",
    "The website experience is template-led. Choose a curated structure and customise the content and branding available within it.",
  ],
  [
    "What happens when I edit my website?",
    "Draft changes and the published website are separate. Preview the draft before choosing to publish it.",
  ],
  [
    "Does selecting a plot reserve it?",
    "No. This illustrative plot selection only shows property information. It is not a reservation, payment, allocation or proof of ownership.",
  ],
  [
    "How do I get access?",
    "Request early access with your name and work email. We will follow up with setup details if your team is a fit.",
  ],
];

export function PremiumLandingPage(_props: {
  createWorkspaceHref?: string;
  showEarlyAccessCta?: boolean;
}) {
  const [plot, setPlot] = useState<PlotId>("A12");
  const [scene, setScene] = useState(0);
  const [style, setStyle] = useState(0);
  const [role, setRole] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("hashchange", closeMenu);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("hashchange", closeMenu);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);
  return (
    <div className="pk02" id="top">
      <div className="pk-dark-top">
        <header className="pk-nav pk-wrap">
          <a href="#top" aria-label="PlotKeys home">
            <Image
              src="/logo-horizontal-dark.png"
              alt="PlotKeys"
              width={1936}
              height={664}
              priority
            />
          </a>
          <button
            className="pk-menu"
            type="button"
            aria-controls="pk-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
          <nav
            className={menuOpen ? "pk-navlinks open" : "pk-navlinks"}
            id="pk-navigation"
            aria-label="Main navigation"
          >
            <Link href="#platform" onClick={() => setMenuOpen(false)}>
              The platform
            </Link>
            <Link href="#website" onClick={() => setMenuOpen(false)}>
              Your website
            </Link>
            <Link href="#people" onClick={() => setMenuOpen(false)}>
              For your team
            </Link>
            <Link
              className="pk-button pk-light"
              href="#access"
              onClick={() => setMenuOpen(false)}
            >
              Request early access
            </Link>
          </nav>
        </header>
        <section className="pk-hero pk-wrap" aria-labelledby="pk-hero-title">
          <div className="pk-hero-heading">
            <div className="pk-entrance">
              <p className="pk-eyebrow">Property business, on the same page</p>
              <h1 id="pk-hero-title">
                From the ground up.
                <br />
                <span>Every detail connected.</span>
              </h1>
            </div>
            <div className="pk-entrance">
              <p>
                Bring your estates, listings and team into focus. Then give your
                property business a website of its own.
              </p>
              <div className="pk-actions">
                <a className="pk-button pk-light" href="#access">
                  Request early access
                </a>
                <a className="pk-textlink" href="#platform">
                  Explore the platform
                </a>
              </div>
            </div>
          </div>
          <div className="pk-estate-stage pk-entrance">
            <div className="pk-map-wrap">
              <div className="pk-map-heading">
                <span>PALM &amp; PLACE / PALM COURT</span>
                <span>Illustrative estate layout &nbsp; N ↑</span>
              </div>
              <svg
                className="pk-estate-map"
                viewBox="0 0 740 320"
                role="img"
                aria-label="Illustrative Palm Court estate layout. Choose a sample plot using the buttons in the details panel."
              >
                <path
                  className="pk-boundary"
                  d="M25 52 L680 18 L713 282 L32 299 Z"
                />
                <path
                  className="pk-road"
                  d="M32 168 L705 138 M390 30 L404 287"
                />
                <text
                  className="pk-road-label"
                  x="130"
                  y="166"
                  transform="rotate(-2 130 166)"
                >
                  PALM AVENUE
                </text>
                <text
                  className="pk-road-label"
                  x="460"
                  y="159"
                  transform="rotate(-2 460 159)"
                >
                  PALM AVENUE
                </text>
                {otherPlots.map((item) => (
                  <g key={item.id}>
                    <path className="pk-parcel" d={item.path} />
                    <text x={item.x} y={item.y}>
                      {item.id}
                    </text>
                  </g>
                ))}
                {(
                  Object.entries(plots) as [PlotId, (typeof plots)[PlotId]][]
                ).map(([id, item]) => (
                  <g key={id}>
                    <path
                      className={
                        plot === id ? "pk-parcel selected" : "pk-parcel"
                      }
                      d={item.path}
                    />
                    <text
                      className={plot === id ? "selected-text" : ""}
                      x={item.x}
                      y={item.y}
                    >
                      {id}
                    </text>
                  </g>
                ))}
              </svg>
              <fieldset
                className="pk-mobile-plots"
                aria-label="Illustrative plot layout"
              >
                {(Object.keys(plots) as PlotId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={plot === id}
                    onClick={() => setPlot(id)}
                  >
                    <span>Plot {id}</span>
                    <small>{plots[id].area}</small>
                  </button>
                ))}
              </fieldset>
              <div className="pk-map-legend">
                <span>
                  <i />
                  Plot boundary
                </span>
                <span>
                  <i />
                  Selected plot
                </span>
              </div>
            </div>
            <div className="pk-plot-panel" aria-live="polite">
              <p className="pk-eyebrow">A property in context</p>
              <h2>Plot {plot}</h2>
              <p>
                Palm Court
                <br />
                Ibeju-Lekki, Lagos
              </p>
              <dl>
                <div>
                  <dt>Area</dt>
                  <dd>{plots[plot].area}</dd>
                </div>
                <div>
                  <dt>Use</dt>
                  <dd>Residential</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>Land</dd>
                </div>
              </dl>
              <a className="pk-textlink" href="#platform">
                Follow this property
              </a>
              <fieldset
                className="pk-plot-picker"
                aria-label="Choose an illustrative plot"
              >
                {(Object.keys(plots) as PlotId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={plot === id}
                    onClick={() => setPlot(id)}
                  >
                    {id}
                  </button>
                ))}
              </fieldset>
            </div>
          </div>
          <div className="pk-map-foot">
            <span>Select a plot to explore its details.</span>
            <span>
              Fictional sample · Not a survey plan or availability record
            </span>
          </div>
        </section>
      </div>
      <main>
        <section className="pk-section pk-connected" id="platform">
          <div className="pk-wrap">
            <div className="pk-section-head">
              <div>
                <p className="pk-eyebrow">From first impression to follow-up</p>
                <h2>
                  One property.
                  <br />A more connected story.
                </h2>
              </div>
              <p>
                A great website is the beginning. Keep the property context
                close when the conversation moves to your team.
              </p>
            </div>
            <div className="pk-story-shell">
              <div className="pk-story-visual">
                <div className="pk-record">
                  <div className="pk-record-head">
                    <span>PALM &amp; PLACE</span>
                    <span className="pk-tag">{scenes[scene]!.label}</span>
                  </div>
                  <div className="pk-record-body">
                    <Image
                      src="/palm-court-illustration.jpg"
                      alt="Illustrative architecture for fictional Palm Court"
                      width={1536}
                      height={1024}
                      loading="lazy"
                    />
                    <h3>Palm Court · A12</h3>
                    <p>Residential land in Ibeju-Lekki, Lagos.</p>
                    <div className="pk-record-line">
                      <span>Plot area</span>
                      <strong>500 m²</strong>
                    </div>
                    <div className="pk-record-line">
                      <span>Next step</span>
                      <strong>{scenes[scene]!.next}</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pk-story-copy">
                <fieldset
                  className="pk-story-tabs"
                  aria-label="Follow a property"
                >
                  {scenes.map((item, index) => (
                    <button
                      key={item.tab}
                      type="button"
                      aria-pressed={scene === index}
                      onClick={() => setScene(index)}
                    >
                      {item.tab}
                    </button>
                  ))}
                </fieldset>
                <div aria-live="polite" key={scene} className="pk-state-enter">
                  <p className="pk-eyebrow">{scenes[scene]!.kicker}</p>
                  <h3>{scenes[scene]!.title}</h3>
                  <p>{scenes[scene]!.description}</p>
                </div>
                <p className="pk-scene-note">
                  Illustrative workflow. Sample records are not real customer
                  activity.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="pk-section pk-studio" id="website">
          <div className="pk-wrap pk-studio-grid">
            <div
              className="pk-studio-preview"
              style={
                {
                  "--sample-accent": styles[style]!.color,
                } as React.CSSProperties
              }
            >
              <div className="pk-website">
                <div className="pk-website-nav">
                  <strong>PALM &amp; PLACE</strong>
                  <span>Our estates &nbsp; · &nbsp; About us</span>
                </div>
                <Image
                  src="/palm-court-illustration.jpg"
                  width="1536"
                  height="1024"
                  alt="Illustrative architectural vision of a fictional estate"
                  loading="lazy"
                />
                <div className="pk-website-caption">
                  <p className="pk-eyebrow">Palm Court · Ibeju-Lekki, Lagos</p>
                  <h3>A place to put down roots.</h3>
                  <p>
                    Explore residential plots at Palm Court. Find the details,
                    then talk to our team.
                  </p>
                  <div>
                    <strong>Plot A12 &nbsp; / &nbsp; 500 m²</strong>
                    <span>Residential land</span>
                  </div>
                </div>
              </div>
              <p className="pk-preview-note">
                Draft preview · Your live website stays separate until you
                publish.
              </p>
            </div>
            <div className="pk-studio-copy">
              <p className="pk-eyebrow">
                A website that feels like your company
              </p>
              <h2>
                Choose a template.
                <br />
                Launch your site.
              </h2>
              <p>
                Start with a considered structure. Add your identity, adapt the
                content and preview your changes before you publish.
              </p>
              <fieldset
                className="pk-style-controls"
                aria-label="Explore illustrative brand styles"
              >
                {styles.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    aria-label={`${item.name} brand style`}
                    aria-pressed={style === index}
                    onClick={() => setStyle(index)}
                    style={{ "--swatch": item.color } as React.CSSProperties}
                  />
                ))}
              </fieldset>
              <p className="pk-style-name">
                {styles[style]!.name} · Preview a brand treatment
              </p>
              <p className="pk-disclaimer">
                Illustrative style previews, not a released template catalogue.
              </p>
            </div>
          </div>
        </section>
        <section className="pk-section pk-roles-section" id="people">
          <div className="pk-wrap">
            <div className="pk-section-head">
              <div>
                <p className="pk-eyebrow">
                  Built around the people doing the work
                </p>
                <h2>
                  Different responsibilities.
                  <br />A shared picture.
                </h2>
              </div>
              <p>
                From the first listing to the next team conversation, give each
                role the context it needs.
              </p>
            </div>
            <div className="pk-roles">
              <fieldset
                className="pk-role-buttons"
                aria-label="Explore by role"
              >
                {roles.map((item, index) => (
                  <button
                    type="button"
                    key={item.name}
                    aria-pressed={role === index}
                    onClick={() => setRole(index)}
                  >
                    {item.name}
                    <span aria-hidden="true">{role === index ? "−" : "+"}</span>
                  </button>
                ))}
              </fieldset>
              <div
                className="pk-role-panel pk-state-enter"
                aria-live="polite"
                key={role}
              >
                <p className="pk-eyebrow">{roles[role]!.kicker}</p>
                <h3>{roles[role]!.title}</h3>
                <p>{roles[role]!.description}</p>
                <div className="pk-role-example">
                  <div>
                    <span>Company</span>
                    <strong>Palm &amp; Place</strong>
                  </div>
                  {roles[role]!.rows.map(([label, value]) => (
                    <div key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="pk-section pk-onboarding">
          <div className="pk-wrap">
            <p className="pk-eyebrow">A considered start</p>
            <h2>Make room for your business.</h2>
            <div className="pk-onboard-grid">
              <article>
                <small>01</small>
                <h3>Set your foundation.</h3>
                <p>
                  Add your company identity and bring your property information
                  into your workspace.
                </p>
              </article>
              <article>
                <small>02</small>
                <h3>Make it your own.</h3>
                <p>
                  Choose a website template. Shape the available content and
                  branding around your company.
                </p>
              </article>
              <article>
                <small>03</small>
                <h3>Open your front door.</h3>
                <p>
                  Preview, publish and give visitors a clear path from the
                  listing to your team.
                </p>
              </article>
            </div>
          </div>
        </section>
        <section className="pk-section pk-faq" id="questions">
          <div className="pk-wrap pk-faq-grid">
            <div>
              <p className="pk-eyebrow">A few things to know</p>
              <h2>
                Clarity, before
                <br />
                you begin.
              </h2>
            </div>
            <div>
              {questions.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="pk-cta" id="access">
          <div className="pk-wrap pk-cta-grid">
            <div>
              <p className="pk-eyebrow">Your next chapter</p>
              <h2>
                Give your property
                <br />
                business a place
                <br />
                to come together.
              </h2>
              <p>
                Tell us a little about yourself. We will follow up with setup
                details if your team is a fit.
              </p>
            </div>
            <EarlyAccessForm className="pk-access-form" />
          </div>
        </section>
      </main>
      <footer className="pk-footer pk-wrap">
        <a href="#top" aria-label="PlotKeys home">
          <Image
            src="/logo-horizontal-light.png"
            alt="PlotKeys"
            width={1936}
            height={664}
          />
        </a>
        <span>
          © PlotKeys · Fictional records and illustrative estate imagery.
        </span>
        <a href="#questions">Questions &amp; answers</a>
      </footer>
    </div>
  );
}

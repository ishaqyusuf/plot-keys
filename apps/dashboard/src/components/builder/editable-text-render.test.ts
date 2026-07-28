import { describe, expect, test } from "bun:test";
import {
  EditableText,
  RegistryProvider,
  resolveWebsitePresentation,
} from "@plotkeys/section-registry";
import { type ComponentType, createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

type TestRegistryProviderProps = {
  children?: ReactNode;
  renderMode: "draft" | "live";
};

const TestRegistryProvider =
  RegistryProvider as ComponentType<TestRegistryProviderProps>;

function renderEditableText(renderMode: "draft" | "live") {
  return renderToStaticMarkup(
    createElement(
      TestRegistryProvider,
      { renderMode },
      createElement(EditableText, {
        contentKey: "hero.title",
        value: "Find a better home",
      }),
    ),
  );
}

function renderPresentationSection(
  sectionType: string,
  options: Parameters<typeof resolveWebsitePresentation>[0],
) {
  const presentation = resolveWebsitePresentation(options);
  const section = presentation.page.sections.find(
    (item) => item.type === sectionType,
  );

  expect(section).toBeDefined();
  const SectionComponent = section!.component as ComponentType<{
    config: unknown;
    theme: unknown;
  }>;

  return renderToStaticMarkup(
    createElement(
      TestRegistryProvider,
      { renderMode: "draft" },
      createElement(SectionComponent, {
        config: section!.config,
        theme: presentation.theme,
      }),
    ),
  );
}

describe("builder editable text rendering", () => {
  test("exposes inline edit affordances only in draft mode", () => {
    const draftMarkup = renderEditableText("draft");
    const liveMarkup = renderEditableText("live");

    expect(draftMarkup).toContain("Find a better home");
    expect(draftMarkup).toContain('contentEditable="false"');
    expect(draftMarkup).toContain('tabindex="0"');
    expect(draftMarkup).toContain("Click to edit text");

    expect(liveMarkup).toContain("Find a better home");
    expect(liveMarkup).not.toContain("contentEditable");
    expect(liveMarkup).not.toContain("Click to edit text");
  });

  test("renders dynamic blog item text without inline edit markup in draft mode", () => {
    const markup = renderPresentationSection("blog_list", {
      companyName: "Sandbox Estates",
      liveBlogPosts: [
        {
          excerpt: "A dynamic market update pulled from blog records.",
          id: "post-1",
          publishedAt: "2026-07-01T00:00:00.000Z",
          slug: "market-update",
          title: "Dynamic market update",
        },
      ],
      pageKey: "blog",
      renderMode: "draft",
      templateKey: "riwaq-starter",
    });

    expect(markup).toContain("Dynamic market update");
    expect(markup).toContain(
      "A dynamic market update pulled from blog records.",
    );
    expect(markup).not.toContain("contentEditable");
    expect(markup).not.toContain("Click to edit text");
  });

  test("renders dynamic listing and property text without inline edit markup", () => {
    const listingInput = {
      companyName: "Sandbox Estates",
      liveListings: [
        {
          id: "listing-1",
          location: "Ikoyi",
          price: "NGN 900M",
          slug: "ikoyi-house",
          specs: "4 bed",
          title: "Dynamic listing title",
        },
      ],
      renderMode: "draft" as const,
      templateKey: "template-1",
    };
    const listingMarkup = renderPresentationSection(
      "listing_spotlight",
      listingInput,
    );
    const propertyMarkup = renderPresentationSection("property_grid", {
      ...listingInput,
      pageKey: "listings",
    });

    expect(listingMarkup).toContain("Dynamic listing title");
    expect(propertyMarkup).toContain("Dynamic listing title");
    expect(`${listingMarkup}${propertyMarkup}`).not.toContain(
      "contentEditable",
    );
    expect(`${listingMarkup}${propertyMarkup}`).not.toContain(
      "Click to edit text",
    );
  });

  test("renders dynamic agent text without inline edit markup", () => {
    const markup = renderPresentationSection("agent_showcase", {
      companyName: "Sandbox Estates",
      liveAgents: [
        {
          bio: "Specialist in waterfront homes.",
          id: "agent-1",
          name: "Dynamic Agent",
          slug: "dynamic-agent",
          title: "Lead agent",
        },
      ],
      pageKey: "about",
      renderMode: "draft",
      templateKey: "template-1",
    });

    expect(markup).toContain("Dynamic Agent");
    expect(markup).toContain("Specialist in waterfront homes.");
    expect(markup).not.toContain("contentEditable");
    expect(markup).not.toContain("Click to edit text");
  });
});

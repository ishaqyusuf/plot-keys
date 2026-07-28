"use client";

import {
  getTemplatePageInventoryStrict,
  templateCatalog,
} from "@plotkeys/section-registry";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useTRPC } from "@/trpc/client";

export type BuilderTemplateGroup = "starter" | "plus" | "pro";

type UseBuilderTemplateSelectionOptions = {
  currentTemplateKey: string;
};

type UseBuilderPageSelectionOptions = {
  currentPageKey: string;
  currentTemplateKey: string;
};

export function useBuilderTemplateSelection({
  currentTemplateKey,
}: UseBuilderTemplateSelectionOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trpc = useTRPC();
  const { data: catalogData } = useQuery(trpc.templates.catalog.queryOptions());
  const createDraftMutation = useMutation(
    trpc.website.createDraft.mutationOptions(),
  );
  const currentTemplate = templateCatalog.find(
    (template) => template.key === currentTemplateKey,
  );
  const [group, setGroup] = useState<BuilderTemplateGroup>(
    (currentTemplate?.tier as BuilderTemplateGroup) ?? "starter",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const usageMap = new Map(
    catalogData?.map((template) => [template.key, template.usageCount]) ?? [],
  );

  function handleSelectTemplate(templateKey: string) {
    if (templateKey === currentTemplateKey) {
      return;
    }

    startTransition(async () => {
      setErrorMessage(null);

      try {
        const result = await createDraftMutation.mutateAsync({ templateKey });
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.set("configId", result.configId);
        nextParams.set("page", "home");
        nextParams.delete("error");
        router.replace(`/builder?${nextParams.toString()}`);
        router.refresh();
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to create draft.",
        );
      }
    });
  }

  return {
    currentTemplate,
    errorMessage,
    group,
    handleSelectTemplate,
    setGroup,
    usageMap,
  };
}

export function useBuilderPageSelection({
  currentPageKey,
  currentTemplateKey,
}: UseBuilderPageSelectionOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pages = getTemplatePageInventoryStrict(currentTemplateKey).pages;
  const currentPage =
    pages.find((page) => page.pageKey === currentPageKey) ?? pages[0];

  function handleSelectPage(pageKey: string) {
    if (pageKey === currentPage?.pageKey) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("page", pageKey);
    router.replace(`/builder?${nextParams.toString()}`);
    router.refresh();
  }

  return {
    currentPage,
    handleSelectPage,
    pages,
  };
}

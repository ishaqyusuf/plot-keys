"use client";

import { Button } from "@plotkeys/ui/button";
import { Textarea } from "@plotkeys/ui/textarea";
import { useRef, useState } from "react";

type BlogRichTextEditorProps = {
  defaultValue?: string;
  name: string;
};

const tools = [
  {
    label: "H2",
    prefix: "## ",
    placeholder: "Section heading",
    suffix: "",
  },
  {
    label: "Bold",
    prefix: "**",
    placeholder: "bold text",
    suffix: "**",
  },
  {
    label: "Italic",
    prefix: "_",
    placeholder: "emphasis",
    suffix: "_",
  },
  {
    label: "List",
    prefix: "- ",
    placeholder: "List item",
    suffix: "",
  },
  {
    label: "Link",
    prefix: "[",
    placeholder: "Link text",
    suffix: "](https://example.com)",
  },
] as const;

export function BlogRichTextEditor({
  defaultValue = "",
  name,
}: BlogRichTextEditorProps) {
  const [value, setValue] = useState(defaultValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function insertSnippet(prefix: string, suffix: string, placeholder: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selectionStart = textarea.selectionStart ?? 0;
    const selectionEnd = textarea.selectionEnd ?? 0;
    const selectedText = value.slice(selectionStart, selectionEnd);
    const replacement = `${prefix}${selectedText || placeholder}${suffix}`;
    const nextValue =
      value.slice(0, selectionStart) + replacement + value.slice(selectionEnd);

    setValue(nextValue);

    requestAnimationFrame(() => {
      const cursorPosition =
        selectionStart + prefix.length + (selectedText || placeholder).length;
      textarea.focus();
      textarea.selectionStart = cursorPosition;
      textarea.selectionEnd = cursorPosition;
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <Button
            key={tool.label}
            size="sm"
            type="button"
            variant="outline"
            onClick={() =>
              insertSnippet(tool.prefix, tool.suffix, tool.placeholder)
            }
          >
            {tool.label}
          </Button>
        ))}
      </div>
      <Textarea
        ref={textareaRef}
        className="min-h-[320px] text-sm leading-7"
        name={name}
        placeholder="Write your article using headings, short paragraphs, lists, and links."
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <p className="text-xs text-muted-foreground">
        Supports a lightweight markdown format: headings, bullet lists, bold,
        italics, and links.
      </p>
    </div>
  );
}

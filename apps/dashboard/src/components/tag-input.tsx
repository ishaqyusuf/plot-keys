"use client";

import { Button } from "@plotkeys/ui/button";
import { Input } from "@plotkeys/ui/input";
import { type KeyboardEvent, useEffect, useState } from "react";

export const TAG_INPUT_SYSTEM_SUGGESTIONS = [
  "First-time buyers",
  "Investors",
  "Diaspora clients",
  "Luxury buyers",
  "Mid-market renters",
  "Commercial tenants",
  "Families",
  "Young professionals",
  "Corporate relocations",
  "HNW individuals",
] as const;

export function TagInput({
  defaultValue = [],
  id,
  name,
  onChange,
  value,
}: {
  defaultValue?: string[];
  id?: string;
  name?: string;
  onChange?: (tags: string[]) => void;
  value?: string[];
}) {
  const [internalTags, setInternalTags] = useState<string[]>(defaultValue);
  const [inputValue, setInputValue] = useState("");
  const tags = value ?? internalTags;

  useEffect(() => {
    if (value !== undefined) {
      return;
    }

    setInternalTags(defaultValue);
  }, [defaultValue, value]);

  const updateTags = (nextTags: string[]) => {
    if (value === undefined) {
      setInternalTags(nextTags);
    }

    onChange?.(nextTags);
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      updateTags([...tags, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    updateTags(tags.filter((currentTag) => currentTag !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]!);
    }
  };

  const availableSuggestions = TAG_INPUT_SYSTEM_SUGGESTIONS.filter(
    (s) => !tags.includes(s),
  );

  return (
    <div className="space-y-2">
      {/* Hidden inputs for form submission */}
      {name
        ? tags.map((tag) => (
            <input key={tag} type="hidden" name={name} value={tag} />
          ))
        : null}

      {/* Selected tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Button
              key={tag}
              data-dev-tag-selected="true"
              data-tag-value={tag}
              type="button"
              size="sm"
              aria-label={`Remove ${tag}`}
              variant="secondary"
              className="cursor-pointer gap-1 pr-1"
              onClick={() => removeTag(tag)}
            >
              {tag}
              <span className="ml-0.5 text-muted-foreground hover:text-foreground">
                ×
              </span>
            </Button>
          ))}
        </div>
      )}

      {/* Text input for custom tags */}
      <Input
        id={id}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter to add…"
      />

      {/* Suggestion chips */}
      {availableSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {availableSuggestions.map((suggestion) => (
            <Button
              key={suggestion}
              data-dev-tag-suggestion="true"
              data-tag-value={suggestion}
              type="button"
              size="sm"
              aria-label={`Add ${suggestion}`}
              variant="outline"
              className="cursor-pointer transition-colors hover:bg-accent"
              onClick={() => addTag(suggestion)}
            >
              + {suggestion}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

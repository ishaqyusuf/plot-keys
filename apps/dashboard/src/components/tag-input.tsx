"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Input } from "@plotkeys/ui/input";
import { useState, type KeyboardEvent } from "react";

const SYSTEM_SUGGESTIONS = [
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
  name,
  defaultValue = [],
}: {
  name: string;
  defaultValue?: string[];
}) {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
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

  const availableSuggestions = SYSTEM_SUGGESTIONS.filter(
    (s) => !tags.includes(s),
  );

  return (
    <div className="space-y-2">
      {/* Hidden inputs for form submission */}
      {tags.map((tag) => (
        <input key={tag} type="hidden" name={name} value={tag} />
      ))}

      {/* Selected tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer gap-1 pr-1"
              onClick={() => removeTag(tag)}
            >
              {tag}
              <span className="ml-0.5 text-muted-foreground hover:text-foreground">
                ×
              </span>
            </Badge>
          ))}
        </div>
      )}

      {/* Text input for custom tags */}
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter to add…"
      />

      {/* Suggestion chips */}
      {availableSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {availableSuggestions.map((suggestion) => (
            <Badge
              key={suggestion}
              variant="outline"
              className="cursor-pointer transition-colors hover:bg-accent"
              onClick={() => addTag(suggestion)}
            >
              + {suggestion}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

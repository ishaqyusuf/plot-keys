"use client";

import { cn } from "@plotkeys/ui/cn";
import type { Header } from "@tanstack/react-table";

interface ResizeHandleProps<TData> {
  header: Header<TData, unknown>;
  className?: string;
}

export function ResizeHandle<TData>({
  header,
  className,
}: ResizeHandleProps<TData>) {
  if (!header.column.getCanResize()) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label={`Resize ${header.column.id} column`}
      onDoubleClick={() => header.column.resetSize()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          header.column.resetSize();
        }
      }}
      onMouseDown={(e) => {
        e.stopPropagation(); // Prevent drag from triggering
        header.getResizeHandler()(e);
      }}
      onTouchStart={(e) => {
        e.stopPropagation(); // Prevent drag from triggering
        header.getResizeHandler()(e);
      }}
      onPointerDown={(e) => e.stopPropagation()} // Stop dnd-kit from capturing
      className={cn(
        "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none",
        "bg-transparent",
        className,
      )}
      style={{
        transform: "translateX(50%)",
      }}
    />
  );
}

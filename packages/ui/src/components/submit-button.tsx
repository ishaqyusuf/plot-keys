import { useFormStatus } from "react-dom";

import { cn } from "../lib/utils";
import { Button } from "./button";
import type { ButtonProps } from "./button";
import { Spinner } from "./spinner";

type SubmitButtonProps = Omit<ButtonProps, "type"> & {
  loadingLabel?: string;
};

/**
 * A Button that automatically disables and shows a loading spinner while a
 * parent React server action form is pending.  Uses `useFormStatus` so it
 * must be rendered inside a `<form>` element.
 *
 * @example
 * ```tsx
 * <form action={someServerAction}>
 *   <SubmitButton>Save changes</SubmitButton>
 * </form>
 * ```
 */
function SubmitButton({
  children,
  className,
  disabled,
  loadingLabel,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <Button
      className={cn("relative", className)}
      disabled={isDisabled}
      type="submit"
      {...props}
    >
      {pending && (
        <Spinner
          aria-hidden="true"
          className="mr-1 size-4 shrink-0"
        />
      )}
      {pending && loadingLabel ? loadingLabel : children}
    </Button>
  );
}

export { SubmitButton };
export type { SubmitButtonProps };

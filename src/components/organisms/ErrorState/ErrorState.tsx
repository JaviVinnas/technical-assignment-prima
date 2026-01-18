import type { HTMLAttributes } from "react";

import { Button } from "../../atoms/Button";

import "./ErrorState.css";

/**
 * ErrorState component for displaying error messages with optional retry action.
 *
 * A reusable organism component that displays a styled error message when
 * something goes wrong. Similar to EmptyState but specifically for error scenarios.
 * Provides an optional retry button for user-triggered error recovery.
 *
 * This is a reusable component that can be used in any context where an
 * error state needs to be displayed (failed API calls, data fetching errors,
 * operation failures).
 *
 * @param props - ErrorState configuration
 * @param props.message - Error message text to display (defaults to "Something went wrong. Please try again.")
 * @param props.onRetry - Optional callback for retry action (if provided, displays retry button)
 * @param props.className - Additional CSS classes
 */
export interface ErrorStateProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
  className = "",
  ...rest
}: ErrorStateProps) {
  const errorStateClassName = `error-state ${className}`.trim();

  return (
    <section className={errorStateClassName} role="alert" aria-live="assertive" {...rest}>
      <p className="error-state__message">{message}</p>
      {onRetry && (
        <div className="error-state__action">
          <Button variant="small" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </section>
  );
}

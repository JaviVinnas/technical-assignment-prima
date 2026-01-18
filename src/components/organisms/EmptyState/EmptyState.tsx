import type { HTMLAttributes } from "react";

import "./EmptyState.css";

/**
 * EmptyState component for displaying empty state messages.
 *
 * A reusable organism component that displays a styled empty state message
 * when there is no content to show. Commonly used in lists, filters, and
 * search results to provide feedback when no items match the criteria.
 *
 * This is a reusable component that can be used in any context where an
 * empty state is needed (search results, filtered lists, empty collections).
 *
 * @param props - EmptyState configuration
 * @param props.message - Message text to display (required)
 * @param props.className - Additional CSS classes
 */
export interface EmptyStateProps extends HTMLAttributes<HTMLElement> {
  message: string;
}

export function EmptyState({ message, className = "", ...rest }: EmptyStateProps) {
  const emptyStateClassName = `empty-state ${className}`.trim();

  return (
    <section className={emptyStateClassName} {...rest}>
      <p className="empty-state__message">{message}</p>
    </section>
  );
}

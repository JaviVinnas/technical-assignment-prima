import type { HTMLAttributes, ReactNode } from "react";

import "./Card.css";

/**
 * Generic Card compound component for displaying structured information.
 *
 * A flexible compound component following the compound component pattern,
 * allowing composition of card elements (root, badge, title, subtitle,
 * key-value pairs, and action buttons).
 *
 * Components:
 * - Card.Root: Main container with rounded corners and border
 * - Card.BadgeSlot: Container slot for Badge component (positioned top-left)
 * - Card.Title: Primary heading with bold typography
 * - Card.Subtitle: Secondary heading with regular typography
 * - Card.KeyValuePair: Key-value pair with support for links (e.g., email)
 * - Card.Action: Container for action button (full-width)
 *
 * @example
 * ```tsx
 * <Card.Root>
 *   <Card.BadgeSlot>
 *     <Badge variant="accent-1">ADMIN</Badge>
 *   </Card.BadgeSlot>
 *   <Card.Title>John Doe</Card.Title>
 *   <Card.Subtitle>Software Engineer</Card.Subtitle>
 *   <Card.KeyValuePair label="Team:" value="Engineering" />
 *   <Card.KeyValuePair label="Contact:" value="john@example.com" valueType="email" />
 *   <Card.Action>
 *     <Button variant="big">View details</Button>
 *   </Card.Action>
 * </Card.Root>
 * ```
 */

export interface CardRootProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

function CardRoot({ children, className = "", ...rest }: CardRootProps) {
  const rootClassName = `card ${className}`.trim();

  return (
    <article className={rootClassName} {...rest}>
      {children}
    </article>
  );
}

export interface CardBadgeSlotProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function CardBadgeSlot({ children, className = "", ...rest }: CardBadgeSlotProps) {
  const badgeSlotClassName = `card__badge-slot ${className}`.trim();

  return (
    <div className={badgeSlotClassName} {...rest}>
      {children}
    </div>
  );
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

function CardTitle({ children, className = "", ...rest }: CardTitleProps) {
  const titleClassName = `card__title ${className}`.trim();

  return (
    <h3 className={titleClassName} {...rest}>
      {children}
    </h3>
  );
}

export interface CardSubtitleProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

function CardSubtitle({ children, className = "", ...rest }: CardSubtitleProps) {
  const subtitleClassName = `card__subtitle ${className}`.trim();

  return (
    <p className={subtitleClassName} {...rest}>
      {children}
    </p>
  );
}

export interface CardKeyValuePairProps {
  label: string;
  value: string;
  valueType?: "text" | "email";
  className?: string;
}

function CardKeyValuePair({
  label,
  value,
  valueType = "text",
  className = "",
}: CardKeyValuePairProps) {
  const keyValuePairClassName = `card__key-value-pair ${className}`.trim();

  const renderValue = () => {
    if (valueType === "email") {
      return (
        <a href={`mailto:${value}`} className="card__value card__value--link">
          {value}
        </a>
      );
    }

    return <span className="card__value">{value}</span>;
  };

  return (
    <div className={keyValuePairClassName}>
      <span className="card__key">{label}</span>
      {renderValue()}
    </div>
  );
}

export interface CardActionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function CardAction({ children, className = "", ...rest }: CardActionProps) {
  const actionClassName = `card__action ${className}`.trim();

  return (
    <div className={actionClassName} {...rest}>
      {children}
    </div>
  );
}

export const Card = Object.assign(CardRoot, {
  Root: CardRoot,
  BadgeSlot: CardBadgeSlot,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  KeyValuePair: CardKeyValuePair,
  Action: CardAction,
});

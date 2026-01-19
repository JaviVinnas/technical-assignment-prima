import type { HTMLAttributes, ReactNode } from "react";

import { ExternalLink } from "../../atoms/ExternalLink";

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
 * - Card.KeyValuePair.Root: Container for key-value pair
 * - Card.KeyValuePair.Key: Label/key portion of the pair
 * - Card.KeyValuePair.Value: Value portion with support for links (type="email")
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
 *   <Card.KeyValuePair.Root>
 *     <Card.KeyValuePair.Key>Team:</Card.KeyValuePair.Key>
 *     <Card.KeyValuePair.Value>Engineering</Card.KeyValuePair.Value>
 *   </Card.KeyValuePair.Root>
 *   <Card.KeyValuePair.Root>
 *     <Card.KeyValuePair.Key>Contact:</Card.KeyValuePair.Key>
 *     <Card.KeyValuePair.Value type="email">john@example.com</Card.KeyValuePair.Value>
 *   </Card.KeyValuePair.Root>
 *   <Card.Action>
 *     <Button variant="big">View details</Button>
 *   </Card.Action>
 * </Card.Root>
 * ```
 */

/**
 * Generic utility type for card element props with children.
 */
type CardElementProps<T extends HTMLElement> = HTMLAttributes<T> & {
  children: ReactNode;
};

export type CardRootProps = CardElementProps<HTMLElement>;

function CardRoot({ children, className = "", ...rest }: CardRootProps) {
  const rootClassName = `card ${className}`.trim();

  return (
    <article className={rootClassName} {...rest}>
      {children}
    </article>
  );
}

export type CardBadgeSlotProps = CardElementProps<HTMLDivElement>;

function CardBadgeSlot({ children, className = "", ...rest }: CardBadgeSlotProps) {
  const badgeSlotClassName = `card__badge-slot ${className}`.trim();

  return (
    <div className={badgeSlotClassName} {...rest}>
      {children}
    </div>
  );
}

export type CardTitleProps = CardElementProps<HTMLHeadingElement>;

function CardTitle({ children, className = "", ...rest }: CardTitleProps) {
  const titleClassName = `card__title ${className}`.trim();

  return (
    <h3 className={titleClassName} {...rest}>
      {children}
    </h3>
  );
}

export type CardSubtitleProps = CardElementProps<HTMLParagraphElement>;

function CardSubtitle({ children, className = "", ...rest }: CardSubtitleProps) {
  const subtitleClassName = `card__subtitle ${className}`.trim();

  return (
    <p className={subtitleClassName} {...rest}>
      {children}
    </p>
  );
}

export type CardKeyValuePairRootProps = CardElementProps<HTMLDivElement>;

function CardKeyValuePairRoot({ children, className = "", ...rest }: CardKeyValuePairRootProps) {
  const keyValuePairClassName = `card__key-value-pair ${className}`.trim();

  return (
    <div className={keyValuePairClassName} {...rest}>
      {children}
    </div>
  );
}

export type CardKeyValuePairKeyProps = CardElementProps<HTMLSpanElement>;

function CardKeyValuePairKey({ children, className = "", ...rest }: CardKeyValuePairKeyProps) {
  const keyClassName = `card__key ${className}`.trim();

  return (
    <span className={keyClassName} {...rest}>
      {children}
    </span>
  );
}

/**
 * Props for CardKeyValuePairValue when rendering as text span.
 *
 * Accepts any ReactNode as children and spreads remaining HTML span attributes.
 */
export interface CardKeyValuePairValueTextProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  children: ReactNode;
  type?: "text";
}

/**
 * Props for CardKeyValuePairValue when rendering as email link.
 *
 * Enforces string children (email address) and spreads remaining HTML anchor attributes.
 */
export interface CardKeyValuePairValueEmailProps
  extends Omit<HTMLAttributes<HTMLAnchorElement>, "children"> {
  children: string;
  type: "email";
}

/**
 * Discriminated union for CardKeyValuePairValue props.
 *
 * Type-safe variant props that enforce string children when type is "email".
 * This prevents runtime errors by catching type mismatches at compile time.
 */
export type CardKeyValuePairValueProps =
  | CardKeyValuePairValueTextProps
  | CardKeyValuePairValueEmailProps;

function CardKeyValuePairValue(props: CardKeyValuePairValueProps) {
  if (props.type === "email") {
    const { children, className = "", ...rest } = props;
    const valueClassName = `card__value ${className}`.trim();

    return (
      <ExternalLink href={children} variant="email" className={valueClassName} {...rest}>
        {children}
      </ExternalLink>
    );
  }

  const { children, className = "", ...rest } = props;
  const valueClassName = `card__value ${className}`.trim();

  return (
    <span className={valueClassName} {...rest}>
      {children}
    </span>
  );
}

const CardKeyValuePair = Object.assign(CardKeyValuePairRoot, {
  Root: CardKeyValuePairRoot,
  Key: CardKeyValuePairKey,
  Value: CardKeyValuePairValue,
});

export type CardActionProps = CardElementProps<HTMLDivElement>;

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

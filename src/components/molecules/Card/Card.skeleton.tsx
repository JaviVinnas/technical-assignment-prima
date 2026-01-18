import type { HTMLAttributes, ReactNode } from "react";

import { BadgeSkeleton } from "../../atoms/Badge/Badge.skeleton";
import { ButtonSkeleton } from "../../atoms/Button/Button.skeleton";

import "./Card.skeleton.css";

/**
 * Card skeleton compound component for loading states.
 *
 * A skeleton placeholder that matches the structure and dimensions of the Card
 * component. Follows the compound component pattern with all card parts
 * (Root, BadgeSlot, Title, Subtitle, KeyValuePair, Action) for flexible composition.
 *
 * Used during loading states to prevent layout shift. All skeleton parts display
 * as light grey rectangles matching the dimensions of their real counterparts.
 *
 * @example
 * ```tsx
 * <Card.Skeleton.Root>
 *   <Card.Skeleton.BadgeSlot />
 *   <Card.Skeleton.Title />
 *   <Card.Skeleton.Subtitle />
 *   <Card.Skeleton.KeyValuePair.Root>
 *     <Card.Skeleton.KeyValuePair.Key />
 *     <Card.Skeleton.KeyValuePair.Value />
 *   </Card.Skeleton.KeyValuePair.Root>
 *   <Card.Skeleton.Action />
 * </Card.Skeleton.Root>
 * ```
 */

export interface CardSkeletonRootProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

function CardSkeletonRoot({ children, className = "", ...rest }: CardSkeletonRootProps) {
  const rootClassName = `card-skeleton ${className}`.trim();

  return (
    <article className={rootClassName} {...rest}>
      {children}
    </article>
  );
}

export interface CardSkeletonBadgeSlotProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function CardSkeletonBadgeSlot({ className = "", ...rest }: CardSkeletonBadgeSlotProps) {
  const badgeSlotClassName = `card-skeleton__badge-slot ${className}`.trim();

  return (
    <div className={badgeSlotClassName} {...rest}>
      <BadgeSkeleton />
    </div>
  );
}

export interface CardSkeletonTitleProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function CardSkeletonTitle({ className = "", ...rest }: CardSkeletonTitleProps) {
  const titleClassName = `card-skeleton__title ${className}`.trim();

  return <div className={titleClassName} {...rest} />;
}

export interface CardSkeletonSubtitleProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function CardSkeletonSubtitle({ className = "", ...rest }: CardSkeletonSubtitleProps) {
  const subtitleClassName = `card-skeleton__subtitle ${className}`.trim();

  return <div className={subtitleClassName} {...rest} />;
}

export interface CardSkeletonKeyValuePairRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function CardSkeletonKeyValuePairRoot({
  children,
  className = "",
  ...rest
}: CardSkeletonKeyValuePairRootProps) {
  const keyValuePairClassName = `card-skeleton__key-value-pair ${className}`.trim();

  return (
    <div className={keyValuePairClassName} {...rest}>
      {children}
    </div>
  );
}

export interface CardSkeletonKeyValuePairKeyProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function CardSkeletonKeyValuePairKey({
  className = "",
  ...rest
}: CardSkeletonKeyValuePairKeyProps) {
  const keyClassName = `card-skeleton__key ${className}`.trim();

  return <div className={keyClassName} {...rest} />;
}

export interface CardSkeletonKeyValuePairValueProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function CardSkeletonKeyValuePairValue({
  className = "",
  ...rest
}: CardSkeletonKeyValuePairValueProps) {
  const valueClassName = `card-skeleton__value ${className}`.trim();

  return <div className={valueClassName} {...rest} />;
}

const CardSkeletonKeyValuePair = Object.assign(CardSkeletonKeyValuePairRoot, {
  Root: CardSkeletonKeyValuePairRoot,
  Key: CardSkeletonKeyValuePairKey,
  Value: CardSkeletonKeyValuePairValue,
});

export interface CardSkeletonActionProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function CardSkeletonAction({ className = "", ...rest }: CardSkeletonActionProps) {
  const actionClassName = `card-skeleton__action ${className}`.trim();

  return (
    <div className={actionClassName} {...rest}>
      <ButtonSkeleton variant="small" />
    </div>
  );
}

export const CardSkeleton = Object.assign(CardSkeletonRoot, {
  Root: CardSkeletonRoot,
  BadgeSlot: CardSkeletonBadgeSlot,
  Title: CardSkeletonTitle,
  Subtitle: CardSkeletonSubtitle,
  KeyValuePair: CardSkeletonKeyValuePair,
  Action: CardSkeletonAction,
});

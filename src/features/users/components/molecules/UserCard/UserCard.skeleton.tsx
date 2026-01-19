import { CardSkeleton } from "../../../../../components/molecules/Card/Card.skeleton";

/**
 * UserCard skeleton component for loading states.
 *
 * A skeleton placeholder that matches the structure and dimensions of the UserCard
 * component. Composes Card.Skeleton with the exact layout used in UserCard
 * (badge, title, subtitle, two key-value pairs, and action button).
 *
 * Used during loading states to prevent layout shift when user data is being fetched.
 */
export function UserCardSkeleton() {
  return (
    <CardSkeleton.Root>
      <CardSkeleton.BadgeSlot />
      <CardSkeleton.Title />
      <CardSkeleton.Subtitle />
      <CardSkeleton.KeyValuePair.Root>
        <CardSkeleton.KeyValuePair.Key />
        <CardSkeleton.KeyValuePair.Value />
      </CardSkeleton.KeyValuePair.Root>
      <CardSkeleton.KeyValuePair.Root>
        <CardSkeleton.KeyValuePair.Key />
        <CardSkeleton.KeyValuePair.Value />
      </CardSkeleton.KeyValuePair.Root>
      <CardSkeleton.Action />
    </CardSkeleton.Root>
  );
}

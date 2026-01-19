import { Button } from "../../../../../components/atoms/Button";
import { Card } from "../../../../../components/molecules/Card";

import type { User } from "../../../types";
import { UserPermissionBadge } from "../../atoms/UserPermissionBadge";

/**
 * UserCard component for displaying user information in a card layout.
 *
 * Displays user information including permission badge, name, role, team,
 * and contact information. Contact information is rendered as a clickable
 * link for email interaction.
 *
 * The component accepts an optional onViewDetails callback to handle the
 * "View details" button click. This design allows the component to be tested
 * in isolation without hard-coded dependencies on browser APIs.
 *
 * @param props - UserCard configuration
 * @param props.user - User data to display (required)
 * @param props.onViewDetails - Callback invoked when "View details" button is clicked (optional)
 */
export interface UserCardProps {
  user: User;
  onViewDetails?: () => void;
}

export function UserCard({ user, onViewDetails }: UserCardProps) {
  const handleViewDetails = () => {
    onViewDetails?.();
  };

  return (
    <Card.Root>
      <Card.BadgeSlot>
        <UserPermissionBadge permission={user.permission} />
      </Card.BadgeSlot>
      <Card.Title>{user.name}</Card.Title>
      <Card.Subtitle>{user.role}</Card.Subtitle>
      <Card.KeyValuePair.Root>
        <Card.KeyValuePair.Key>Team:</Card.KeyValuePair.Key>
        <Card.KeyValuePair.Value>{user.team}</Card.KeyValuePair.Value>
      </Card.KeyValuePair.Root>
      <Card.KeyValuePair.Root>
        <Card.KeyValuePair.Key>Contact information:</Card.KeyValuePair.Key>
        <Card.KeyValuePair.Value type="email">{user.contactInfo}</Card.KeyValuePair.Value>
      </Card.KeyValuePair.Root>
      <Card.Action>
        <Button variant="small" onClick={handleViewDetails}>
          View details
        </Button>
      </Card.Action>
    </Card.Root>
  );
}

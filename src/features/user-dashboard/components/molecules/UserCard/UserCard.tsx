import { Button } from "../../../../../components/atoms/Button";
import { Card } from "../../../../../components/molecules/Card";
import { showNotImplementedAlert } from "../../../../../utils";

import type { User } from "../../../types";
import { UserPermissionBadge } from "../../atoms/UserPermissionBadge";

/**
 * UserCard component for displaying user information in a card layout.
 *
 * Displays user information including permission badge, name, role, team,
 * and contact information. Contact information is rendered as a clickable
 * link for email interaction.
 *
 * @param props - UserCard configuration
 * @param props.user - User data to display (required)
 */
export interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
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
        <Button variant="small" onClick={showNotImplementedAlert}>
          View details
        </Button>
      </Card.Action>
    </Card.Root>
  );
}

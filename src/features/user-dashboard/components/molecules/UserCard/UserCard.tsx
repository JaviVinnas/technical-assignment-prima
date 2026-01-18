import { Button } from "../../../../../components/atoms/Button";
import { Card } from "../../../../../components/molecules/Card";

import type { User } from "../../../types";
import { UserPermissionBadge } from "../../atoms/UserPermissionBadge";

import "./UserCard.css";

/**
 * UserCard component for displaying user information in a card layout.
 *
 * Displays user information including permission badge, name, role, team,
 * and contact information. Contact information is rendered as a clickable
 * link for email interaction.
 *
 * @param props - UserCard configuration
 * @param props.user - User data to display (required)
 * @param props.onViewDetails - Callback function called when "View details" button is clicked (optional)
 */
export interface UserCardProps {
  user: User;
  onViewDetails?: () => void;
}

export function UserCard({ user, onViewDetails }: UserCardProps) {
  return (
    <Card.Root>
      <Card.BadgeSlot>
        <UserPermissionBadge permission={user.permission} />
      </Card.BadgeSlot>
      <Card.Title>{user.name}</Card.Title>
      <Card.Subtitle>{user.role}</Card.Subtitle>
      <Card.KeyValuePair label="Team:" value={user.team} />
      <Card.KeyValuePair label="Contact information:" value={user.contactInfo} valueType="email" />
      <Card.Action>
        <Button variant="small" onClick={() => onViewDetails?.()}>
          View details
        </Button>
      </Card.Action>
    </Card.Root>
  );
}

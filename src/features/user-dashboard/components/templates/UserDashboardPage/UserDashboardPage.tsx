import { HorizontalSeparator } from "../../../../../components/atoms";
import { UserDashboardProvider } from "../../../context";
import { UserFiltersRow } from "../../molecules/UserFiltersRow";
import { UserSearchBox } from "../../molecules/UserSearchBox";
import { UserCardGrid } from "../../organisms/UserCardGrid";

import "./UserDashboardPage.css";

/**
 * User Dashboard page component.
 *
 * The main page for the user dashboard feature, displaying a large bicolor title
 * ("User" in accent colour, "Dashboard" in default text colour), a search section,
 * permission filters, and a grid of user cards.
 *
 * This page is currently rendered at the root route "/" and serves as the entry
 * point for the user dashboard feature.
 *
 * Features:
 * - Text search: filters users by name (contains, case-insensitive)
 * - Permission filters: filters users by permission levels (OR logic)
 * - LocalStorage persistence: search query and selected filters persist across sessions
 * - Real-time filtering: results update as user types or changes filters
 *
 * @remarks
 * - State management is scoped to this page component tree
 * - Uses feature-specific components that integrate with the dashboard state
 * - Filters are applied with AND logic (both search and permissions must match)
 * - Permission filters use OR logic (users matching any selected permission are shown)
 *
 * @example
 * ```tsx
 * <UserDashboardPage />
 * ```
 */
export function UserDashboardPage() {
  return (
    <UserDashboardProvider>
      <main className="user-dashboard">
        <h1 className="user-dashboard__title">
          <span className="user-dashboard__title--accent">User</span>
          <span className="user-dashboard__title--default"> Dashboard</span>
        </h1>

        <div className="user-dashboard__sticky-controls">
          <section className="user-dashboard__search-section">
            <UserSearchBox id="search-input" />
          </section>

          <section className="user-dashboard__filters-section">
            <UserFiltersRow />
          </section>

          <div className="user-dashboard__separator-wrapper">
            <HorizontalSeparator />
          </div>
        </div>

        <section className="user-dashboard__results-section">
          <UserCardGrid />
        </section>
      </main>
    </UserDashboardProvider>
  );
}

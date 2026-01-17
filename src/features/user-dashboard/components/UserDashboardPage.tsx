import { useState } from "react";

import { SearchBox } from "../../../components/molecules/SearchBox";

import "./UserDashboardPage.css";

/**
 * User Dashboard page component.
 *
 * The main page for the user dashboard feature, displaying a large bicolor title
 * ("User" in accent colour, "Dashboard" in default text colour), a search label,
 * and a search box for searching users by name.
 *
 * This page is currently rendered at the root route "/" and serves as the entry
 * point for the user dashboard feature.
 *
 * @remarks
 * - Uses local state (`useState`) to manage the search input value
 * - Search functionality is currently not implemented (see `handleSearch` TODO)
 * - The bicolor title styling is achieved through CSS classes on span elements
 *
 * @example
 * ```tsx
 * <UserDashboardPage />
 * ```
 */
export function UserDashboardPage() {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    // TODO: Implement search functionality
    // This will trigger user search based on searchValue
  };

  return (
    <div className="user-dashboard">
      <h1 className="user-dashboard__title">
        <span className="user-dashboard__title--accent">User</span>
        <span className="user-dashboard__title--default"> Dashboard</span>
      </h1>
      <div className="user-dashboard__search-section">
        <label htmlFor="search-input" className="user-dashboard__label">
          WHAT ARE YOU LOOKING FOR?
        </label>
        <SearchBox
          id="search-input"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
        />
      </div>
    </div>
  );
}

import { type InputHTMLAttributes, useState } from "react";

import { SearchBox, type SearchBoxProps } from "../../../../../components/molecules/SearchBox";
import { useUserDashboardContext } from "../../../context";

import "./UserSearchBox.css";

/**
 * UserSearchBox component for user dashboard search functionality.
 *
 * Provides search functionality for the user dashboard. Includes a search
 * label and integrates with the dashboard's filtering system. Search
 * queries are persisted across sessions and shared with other dashboard
 * components.
 *
 * User interactions:
 * - Typing updates the search input without immediately triggering filtering
 * - Clicking Search or pressing Enter applies the search query
 * - Clearing the input automatically triggers a search to show all users
 * - Search state is synchronised with permission filters
 *
 * @param props - UserSearchBox configuration
 * @param props.id - Input element ID (required for accessibility)
 * @param props.placeholder - Placeholder text for the input (defaults to SearchBox default)
 * @param props.className - Additional CSS classes applied to the container
 */
export interface UserSearchBoxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  className?: string;
}

export function UserSearchBox({ id, placeholder, className = "", ...rest }: UserSearchBoxProps) {
  const { searchQuery, setSearchQuery } = useUserDashboardContext();
  const [inputValue, setInputValue] = useState(searchQuery);

  const userSearchBoxClassName = `user-search-box ${className}`.trim();

  const handleChange: SearchBoxProps["onChange"] = (event) => {
    setInputValue(event.target.value);
  };

  const handleSearch: SearchBoxProps["onSearch"] = (value) => {
    setSearchQuery(value);
  };

  return (
    <section className={userSearchBoxClassName}>
      <label htmlFor={id} className="label label--secondary user-search-box__label">
        WHAT ARE YOU LOOKING FOR?
      </label>
      <SearchBox
        id={id}
        value={inputValue}
        onChange={handleChange}
        onSearch={handleSearch}
        placeholder={placeholder}
        {...rest}
      />
    </section>
  );
}

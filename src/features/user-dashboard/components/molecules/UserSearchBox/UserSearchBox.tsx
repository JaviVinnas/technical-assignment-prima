import { useEffect, useState } from "react";

import {
  SearchBox,
  type SearchBoxChangeHandler,
  type SearchBoxProps,
  type SearchBoxSearchHandler,
} from "../../../../../components/molecules/SearchBox";
import { useUserDashboardContext } from "../../../context";

import "./UserSearchBox.css";

/**
 * UserSearchBox component for user dashboard search functionality.
 *
 * Provides search functionality for the user dashboard. Includes a search
 * label and uses a controlled component pattern with draft state for optimal
 * user experience. Draft value updates on every keystroke, while the actual
 * search query is only updated when the user explicitly searches.
 *
 * User interactions:
 * - Typing updates the draft input without immediately triggering filtering
 * - Clicking Search or pressing Enter applies the search query
 * - Clearing the input automatically triggers a search to show all users
 * - Search state is synchronised with permission filters and localStorage
 *
 * The component syncs its draft state with the controlled value prop,
 * preventing stale closure bugs when the search query changes externally
 * (e.g., from localStorage sync, programmatic update, or browser navigation).
 *
 * @param props - UserSearchBox configuration
 * @param props.value - Controlled search query value from parent
 * @param props.onChange - Callback when search query should update
 * @param props.id - Input element ID (required for accessibility)
 * @param props.placeholder - Placeholder text for the input (defaults to SearchBox default)
 * @param props.className - Additional CSS classes applied to the container
 */
export interface UserSearchBoxProps
  extends Omit<SearchBoxProps, "value" | "onChange" | "onSearch"> {
  value: string;
  onChange: (value: string) => void;
}

export function UserSearchBox({
  value,
  onChange,
  id,
  placeholder,
  className = "",
  ...rest
}: UserSearchBoxProps) {
  const [draftValue, setDraftValue] = useState(value);

  const userSearchBoxClassName = `user-search-box ${className}`.trim();

  // Sync draft with controlled value to prevent stale closure bugs
  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  const handleChange: SearchBoxChangeHandler = (event) => {
    setDraftValue(event.target.value);
  };

  const handleSearch: SearchBoxSearchHandler = (searchValue) => {
    onChange(searchValue);
  };

  return (
    <section className={userSearchBoxClassName}>
      <label htmlFor={id} className="label label--secondary user-search-box__label">
        WHAT ARE YOU LOOKING FOR?
      </label>
      <SearchBox
        id={id}
        value={draftValue}
        onChange={handleChange}
        onSearch={handleSearch}
        placeholder={placeholder}
        {...rest}
      />
    </section>
  );
}

/**
 * Container component that connects UserSearchBox to the user dashboard context.
 *
 * This container handles the integration with UserDashboardContext, managing
 * the search query state through localStorage-backed context. The presentational
 * UserSearchBox component remains testable in isolation.
 *
 * Use this component in the user dashboard page where context integration is needed.
 * Use the base UserSearchBox component directly for testing or reuse in other contexts.
 *
 * @param props - ConnectedUserSearchBox configuration
 * @param props.id - Input element ID (required for accessibility)
 * @param props.placeholder - Placeholder text for the input
 * @param props.className - Additional CSS classes applied to the container
 */
export interface ConnectedUserSearchBoxProps
  extends Omit<UserSearchBoxProps, "value" | "onChange"> {
  // All props inherited from UserSearchBoxProps except value and onChange
}

export function ConnectedUserSearchBox(props: ConnectedUserSearchBoxProps) {
  const { searchQuery, setSearchQuery } = useUserDashboardContext();

  return <UserSearchBox value={searchQuery} onChange={setSearchQuery} {...props} />;
}

import type { InputHTMLAttributes } from "react";

import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";

import "./SearchBox.css";

/**
 * SearchBox component combining Input and Button.
 *
 * A molecule component that combines an Input field with an adjacent Search button.
 * The input and button are displayed horizontally without gap, with coordinated
 * border radius and matching heights.
 *
 * User interactions:
 * - Typing in the input updates the controlled value via onChange
 * - Clicking the Search button triggers onSearch callback
 * - Pressing Enter in the input also triggers onSearch callback
 *
 * @param props - SearchBox configuration
 * @param props.placeholder - Placeholder text for the input (defaults to "Search by name...")
 * @param props.onSearch - Callback function called when search button is clicked or Enter is pressed
 * @param props.value - Input value (controlled component)
 * @param props.onChange - Change handler for input value updates
 * @param props.className - Additional CSS classes applied to the container
 * @param props.id - Input element ID (also used for label association if label is provided)
 */
export interface SearchBoxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onSearch"> {
  onSearch?: () => void;
}

export function SearchBox({
  placeholder = "Search by name...",
  onSearch,
  value,
  onChange,
  className = "",
  ...rest
}: SearchBoxProps) {
  const searchBoxClassName = `search-box ${className}`.trim();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={searchBoxClassName}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        className="search-box__input"
        {...rest}
      />
      <Button variant="big" onClick={onSearch} className="search-box__button" type="button">
        Search
      </Button>
    </div>
  );
}

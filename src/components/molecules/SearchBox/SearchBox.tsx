import type { FormHTMLAttributes, InputHTMLAttributes } from "react";

import { Button } from "../../atoms/Button";
import { Input } from "../../atoms/Input";

import "./SearchBox.css";

/**
 * SearchBox component combining Input and Button.
 *
 * A molecule component that combines an Input field with an adjacent Search button.
 * The input and button are displayed horizontally without gap, with coordinated
 * border radius and matching heights.
 *
 * Triggers the onSearch callback when:
 * - The Search button is clicked
 * - Enter is pressed in the input
 * - The form is submitted
 * - The input is cleared (when autoSearchOnClear is true)
 *
 * @param props - SearchBox configuration
 * @param props.placeholder - Placeholder text for the input (defaults to "Search by name...")
 * @param props.onSearch - Callback function called when search is triggered
 * @param props.value - Input value (controlled component)
 * @param props.onChange - Change handler for input value updates
 * @param props.autoSearchOnClear - When true (default), automatically triggers onSearch when input is cleared
 * @param props.className - Additional CSS classes applied to the container
 * @param props.id - Input element ID (also used for label association if label is provided)
 */
export interface SearchBoxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onSearch"> {
  onSearch?: () => void;
  autoSearchOnClear?: boolean;
  formProps?: Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "className">;
}

export function SearchBox({
  placeholder = "Search by name...",
  onSearch,
  value,
  onChange,
  autoSearchOnClear = true,
  className = "",
  formProps,
  ...rest
}: SearchBoxProps) {
  const searchBoxClassName = `search-box ${className}`.trim();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);

    if (autoSearchOnClear && event.target.value === "" && onSearch) {
      onSearch();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.();
  };

  return (
    <form className={searchBoxClassName} onSubmit={handleSubmit} {...formProps}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="search-box__input"
        {...rest}
      />
      <Button variant="big" onClick={onSearch} className="search-box__button" type="submit">
        Search
      </Button>
    </form>
  );
}

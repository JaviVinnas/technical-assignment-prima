import type {
  ChangeEvent,
  FormEvent,
  FormHTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
} from "react";

import { Button } from "../../atoms/Button";
import { Input } from "../../atoms/Input";

import "./SearchBox.css";

/**
 * Handler function type for search input change events.
 *
 * Called when the search input value changes, providing the change event.
 * Use this type for components that need to handle search input changes.
 */
export type SearchBoxChangeHandler = (event: ChangeEvent<HTMLInputElement>) => void;

/**
 * Handler function type for search submission events.
 *
 * Called when search is triggered (button click, Enter key, or form submit),
 * providing the current search value. Use this type for components that need
 * to handle search queries.
 */
export type SearchBoxSearchHandler = (value: string) => void;

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
 * The onSearch callback receives the current input value as a parameter, eliminating
 * the need for consumers to rely on potentially stale state from onChange.
 *
 * @param props - SearchBox configuration
 * @param props.placeholder - Placeholder text for the input (defaults to "Search by name...")
 * @param props.onSearch - Callback function called when search is triggered, receives current input value
 * @param props.value - Input value (controlled component)
 * @param props.onChange - Change handler for input value updates
 * @param props.autoSearchOnClear - When true (default), automatically triggers onSearch when input is cleared
 * @param props.className - Additional CSS classes applied to the container
 * @param props.id - Input element ID (also used for label association if label is provided)
 */
export interface SearchBoxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onSearch" | "onChange"> {
  onSearch?: SearchBoxSearchHandler;
  onChange?: SearchBoxChangeHandler;
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);

    if (autoSearchOnClear && event.target.value === "" && onSearch) {
      onSearch(event.target.value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && onSearch) {
      onSearch(event.currentTarget.value);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSearch && typeof value === "string") {
      onSearch(value);
    }
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
      <Button variant="big" className="search-box__button" type="submit">
        Search
      </Button>
    </form>
  );
}

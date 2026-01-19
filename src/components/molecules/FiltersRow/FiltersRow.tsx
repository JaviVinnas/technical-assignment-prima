import type { HTMLAttributes, ReactNode } from "react";

import "./FiltersRow.css";

/**
 * Constraint for filterable values.
 *
 * Defines the types that can be used as filter options. These types are
 * serializable and have reliable equality semantics for filtering.
 */
export type FilterableValue = string | number | symbol;

/**
 * Type for the render option callback function.
 *
 * Defines the signature for custom rendering of filter options. Extracted
 * as a separate type to enable type composition and parameter extraction.
 */
export type RenderOptionFn<T> = (value: T, isSelected: boolean, onClick: () => void) => ReactNode;

/**
 * Generic reusable filter row component.
 *
 * Displays a horizontal row of clickable filter options with a label.
 * Manages visual state for selected/unselected items. Each option can
 * be rendered using a custom component via renderOption callback.
 *
 * The component uses reference equality by default (===) to determine if
 * an option is selected. For custom equality logic (e.g., object comparison),
 * provide an isEqual function.
 *
 * @param props - FiltersRow configuration
 * @param props.label - Label text displayed above the filter options (required)
 * @param props.options - Array of option values to display (required, readonly)
 * @param props.selected - Array of currently selected option values (required, readonly)
 * @param props.onToggle - Callback called when an option is toggled, receives the option value (required)
 * @param props.renderOption - Callback to render each option, receives (value, isSelected, onClick) (required)
 * @param props.isEqual - Optional custom equality function for comparing values (defaults to ===)
 * @param props.className - Additional CSS classes applied to the container
 */
export interface FiltersRowProps<T extends FilterableValue = string | number>
  extends Omit<HTMLAttributes<HTMLElement>, "children" | "onToggle"> {
  label: string;
  options: readonly T[];
  selected: readonly T[];
  onToggle: (value: T) => void;
  renderOption: RenderOptionFn<T>;
  isEqual?: (a: T, b: T) => boolean;
}

export function FiltersRow<T extends FilterableValue = string | number>({
  label,
  options,
  selected,
  onToggle,
  renderOption,
  isEqual = (a, b) => a === b,
  className = "",
  ...rest
}: FiltersRowProps<T>) {
  const filtersRowClassName = `filters-row ${className}`.trim();

  return (
    <nav className={filtersRowClassName} {...rest}>
      <div className="filters-row__label">{label}</div>
      <div className="filters-row__options">
        {options.map((option) => {
          const isSelected = selected.some((s) => isEqual(s, option));
          const handleToggle = () => {
            onToggle(option);
          };
          return (
            <div key={String(option)} className="filters-row__option">
              {renderOption(option, isSelected, handleToggle)}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

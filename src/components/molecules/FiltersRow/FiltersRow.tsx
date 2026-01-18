import type { HTMLAttributes, ReactNode } from "react";

import "./FiltersRow.css";

/**
 * Generic reusable filter row component.
 *
 * Displays a horizontal row of clickable filter options with a label.
 * Manages visual state for selected/unselected items. Each option can
 * be rendered using a custom component via renderOption callback.
 *
 * @param props - FiltersRow configuration
 * @param props.label - Label text displayed above the filter options (required)
 * @param props.options - Array of option values to display (required)
 * @param props.selected - Array of currently selected option values (required)
 * @param props.onToggle - Callback called when an option is toggled, receives the option value (required)
 * @param props.renderOption - Callback to render each option, receives (value, isSelected, onClick) (required)
 * @param props.className - Additional CSS classes applied to the container
 */
export interface FiltersRowProps<T extends string | number>
  extends Omit<HTMLAttributes<HTMLElement>, "children" | "onToggle"> {
  label: string;
  options: T[];
  selected: T[];
  onToggle: (value: T) => void;
  renderOption: (value: T, isSelected: boolean, onClick: () => void) => ReactNode;
}

export function FiltersRow<T extends string | number>({
  label,
  options,
  selected,
  onToggle,
  renderOption,
  className = "",
  ...rest
}: FiltersRowProps<T>) {
  const filtersRowClassName = `filters-row ${className}`.trim();

  return (
    <nav className={filtersRowClassName} {...rest}>
      <div className="filters-row__label">{label}</div>
      <div className="filters-row__options">
        {options.map((option) => {
          const isSelected = selected.includes(option);
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

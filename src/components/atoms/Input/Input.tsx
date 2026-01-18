import type { InputHTMLAttributes } from "react";
import { useId } from "react";

import "./Input.css";

/**
 * Input component with design system styling.
 *
 * A reusable input atom component following atomic design principles.
 * Supports all standard HTML input attributes with consistent styling
 * using design system tokens. Features rounded corners (20px) and
 * proper spacing (8px) matching the design system.
 *
 * @param props - Input configuration
 * @param props.label - Optional label text for accessibility (rendered above input)
 * @param props.className - Additional CSS classes
 * @param props.placeholder - Placeholder text
 * @param props.type - Input type (text, email, password, etc.)
 * @param props.disabled - Whether the input is disabled
 * @param props.value - Input value (controlled)
 * @param props.onChange - Change handler function
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", id, ...rest }: InputProps) {
  const generatedId = useId();
  const inputId = id || (label ? generatedId : undefined);
  const inputClassName = `input ${className}`.trim();

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
        </label>
      )}
      <input id={inputId} className={inputClassName} {...rest} />
    </div>
  );
}

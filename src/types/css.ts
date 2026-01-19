import type React from "react";

/**
 * Type representing CSS custom properties (CSS variables).
 *
 * Allows any property that starts with "--" to be added to style objects
 * with string or number values. This enables type-safe use of CSS custom
 * properties in React components.
 *
 * @example
 * ```tsx
 * const style: CSSCustomProperties = {
 *   "--primary-colour": "#007bff",
 *   "--spacing": "16px",
 *   "--z-index": 100,
 * };
 * ```
 */
export type CSSCustomProperties = {
  [key: `--${string}`]: string | number;
};

/**
 * Extends React.CSSProperties to include CSS custom properties.
 *
 * Use this type for style objects that need to include both standard CSS
 * properties and custom properties (CSS variables). This is the primary
 * type to use for component style props that support CSS custom properties.
 *
 * @example
 * ```tsx
 * const cardStyle: CSSPropertiesWithCustom = {
 *   display: "flex",
 *   padding: "16px",
 *   "--card-background": "#ffffff",
 *   "--card-border-radius": "8px",
 * };
 * ```
 */
export type CSSPropertiesWithCustom = React.CSSProperties & CSSCustomProperties;

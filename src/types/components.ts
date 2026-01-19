import type { ReactNode } from "react";

/**
 * Utility type that makes specific properties of a type required.
 *
 * Takes a type T and a key K, removes K from T, then adds it back as required.
 * Useful for creating variants of types where certain optional props become required.
 *
 * @template T - The base type
 * @template K - The key(s) to make required
 *
 * @example
 * ```tsx
 * interface Props {
 *   id?: string;
 *   name?: string;
 * }
 *
 * type PropsWithId = RequiredProp<Props, "id">;
 * // Result: { id: string; name?: string; }
 * ```
 */
export type RequiredProp<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Utility type for adding a variant property to component props.
 *
 * Creates a type with a required variant property of the specified type.
 * Commonly used for components with different visual styles or behaviours.
 *
 * @template T - The variant values (string literal union)
 *
 * @example
 * ```tsx
 * type ButtonVariants = WithVariant<"big" | "small">;
 * // Result: { variant: "big" | "small" }
 * ```
 */
export type WithVariant<T extends string> = {
  variant: T;
};

/**
 * Utility type for adding a children property to component props.
 *
 * Creates a type with a required children property. The children type
 * can be customised, defaulting to ReactNode for maximum flexibility.
 *
 * @template T - The type of children (defaults to ReactNode)
 *
 * @example
 * ```tsx
 * type PropsWithChildren = WithChildren;
 * // Result: { children: ReactNode }
 *
 * type PropsWithStringChildren = WithChildren<string>;
 * // Result: { children: string }
 * ```
 */
export type WithChildren<T = ReactNode> = {
  children: T;
};

/**
 * Utility type for creating variant-based component props with children.
 *
 * Combines HTML element attributes with variant and children requirements.
 * Provides a consistent pattern for atomic components with visual variants.
 *
 * @template TElement - The HTML element type
 * @template TVariant - The variant values (string literal union)
 * @template TRequired - Additional keys from HTMLAttributes to make required
 *
 * @example
 * ```tsx
 * type ButtonProps = VariantComponentProps<
 *   HTMLButtonElement,
 *   "big" | "small"
 * >;
 * // Result: ButtonHTMLAttributes<HTMLButtonElement> without children
 * //         + { variant: "big" | "small"; children: ReactNode }
 *
 * type BadgeProps = VariantComponentProps<
 *   HTMLSpanElement,
 *   "accent-1" | "accent-2" | "default"
 * >;
 * ```
 */
export type VariantComponentProps<
  TElement extends HTMLElement,
  TVariant extends string,
  TRequired extends string = never,
> = Omit<React.HTMLAttributes<TElement>, TRequired | "children"> &
  WithVariant<TVariant> &
  WithChildren;

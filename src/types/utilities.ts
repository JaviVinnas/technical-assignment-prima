/**
 * Utility type that converts all array properties in a type to readonly arrays.
 *
 * This utility type recursively traverses the properties of a type and converts
 * any array properties to readonly arrays, while leaving other properties unchanged.
 * Useful for creating immutable variants of types with array properties.
 *
 * @template T - The type to convert
 *
 * @example
 * ```tsx
 * interface Props {
 *   items: string[];
 *   count: number;
 * }
 *
 * type ReadonlyProps = ReadonlyArrayProps<Props>;
 * // Result: { items: readonly string[]; count: number; }
 * ```
 */
export type ReadonlyArrayProps<T> = {
  [K in keyof T]: T[K] extends Array<infer U> ? readonly U[] : T[K];
};

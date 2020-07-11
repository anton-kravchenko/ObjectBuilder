/* Picks non-optional fields from a "object" type alias and returns a union of literal types (keys) */
type PickNonOptionalKeys<T extends object> = Exclude<
  {
    [K in keyof T]: T extends Record<K, T[K]> ? K : never;
  }[keyof T],
  undefined
>;

/* Filers out all optional fields from an "object" type alias */
type PickNonOptionalFields<T extends object> = Pick<T, PickNonOptionalKeys<T>>;

export { PickNonOptionalKeys, PickNonOptionalFields, Diff };
// TODO: write docs like for cypress with examples

/* Picks non-optional fields from a "object" type alias and returns a union of literal types (keys) */
type PickNonOptionalFieldsKeys<T> = T extends object
  ? Exclude<
      {
        [K in Keys<T>]: T extends Record<K, T[K]> ? K : never;
      }[Keys<T>],
      undefined
    >
  : never;

/* Extracts keys from T */
type Keys<T> = keyof T;
/* Filers out all optional fields from an "object" type alias */
type PickNonOptionalFields<T> = T extends object ? Pick<T, PickNonOptionalFieldsKeys<T>> : never;

type OmitBaseAndOptionalKeys<T, B> = Omit<PickNonOptionalFields<T>, Keys<B>>;
type OmitBaseSuppliedAndOptionalKeys<T, B, S> = Omit<OmitBaseAndOptionalKeys<T, B>, Keys<S>>;

export type {
  PickNonOptionalFieldsKeys,
  PickNonOptionalFields,
  Keys,
  OmitBaseSuppliedAndOptionalKeys,
  OmitBaseAndOptionalKeys,
};

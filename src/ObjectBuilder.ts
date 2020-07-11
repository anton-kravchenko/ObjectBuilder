import type {
  OmitBaseSuppliedAndOptionalKeys,
  OmitBaseAndOptionalKeys,
  PickNonOptionalFields,
} from './types';

interface IBuild<Target> {
  build(): Target;
}

interface IWith<Target, Base, Supplied> {
  with<T1 extends Omit<Target, keyof Supplied>, K extends keyof T1>(
    key: K,
    value: T1[K],
  ): keyof Omit<Omit<Target, keyof Supplied>, K> extends never
    ? IBuild<Target>
    : keyof Omit<OmitBaseSuppliedAndOptionalKeys<Target, Base, Supplied>, K> extends never
    ? IBuild<Target> & IWith<Target, Base, Supplied & Pick<T1, K>>
    : IWith<Target, Base, Supplied & Pick<T1, K>>;
}

class Build<Target, Base, Supplied> implements IBuild<Target>, IWith<Target, Base, Supplied> {
  constructor(private target: Partial<Target>) {}

  with<T1 extends Omit<Target, keyof Supplied>, K extends keyof T1>(
    key: K,
    value: T1[K],
  ): keyof Omit<Omit<Target, keyof Supplied>, K> extends never
    ? IBuild<Target>
    : keyof Omit<OmitBaseSuppliedAndOptionalKeys<Target, Base, Supplied>, K> extends never
    ? IBuild<Target> & IWith<Target, Base, Supplied & Pick<T1, K>>
    : IWith<Target, Base, Supplied & Pick<T1, K>> {
    const target: Partial<Target> = { ...this.target, [key]: value };

    return new Build<Target, Base, Supplied & Pick<T1, K>>(target) as any;
  }

  build(): Target {
    return this.target as Required<Target>;
  }
}

class ObjectBuilder<T> {
  public static fromBase<Target extends object, Base extends Partial<Target>>(
    base: Base,
  ): keyof OmitBaseAndOptionalKeys<Target, Base> extends never
    ? IBuild<Target> & IWith<Target, Base, {}>
    : IWith<Target, Base, {}> {
    return new Build<Target, Base, {}>(base ?? {}) as any;
  }

  public static new<Target>(): Target extends {}
    ? keyof PickNonOptionalFields<Target> extends never
      ? IBuild<Target>
      : IWith<Target, {}, {}>
    : never {
    return new Build<Target, {}, {}>({}) as any;
  }
}

export { ObjectBuilder };

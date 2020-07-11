import { PickNonOptionalFields } from './types';

interface IBuild<Target> {
  build(): Target;
}

interface IWith<Target extends object, Base, Supplied> {
  with<T1 extends Omit<Target, keyof Supplied>, K extends keyof T1>(
    key: K,
    value: T1[K],
  ): keyof Omit<Omit<Target, keyof Supplied>, K> extends never
    ? IBuild<Target>
    : keyof Omit<Omit<PickNonOptionalFields<Target>, keyof Supplied>, K> extends never
    ? IBuild<Target> & IWith<Target, Base, Supplied & Pick<T1, K>>
    : IWith<Target, Base, Supplied & Pick<T1, K>>;
}

class Build<Target extends object, Base, Supplied>
  implements IBuild<Target>, IWith<Target, Base, Supplied> {
  constructor(private target: Partial<Target>) {}

  with<T1 extends Omit<Target, keyof Supplied>, K extends keyof T1>(
    key: K,
    value: T1[K],
  ): keyof Omit<Omit<Target, keyof Supplied>, K> extends never
    ? IBuild<Target>
    : keyof Omit<Omit<PickNonOptionalFields<Target>, keyof Supplied>, K> extends never
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
  ): keyof Omit<PickNonOptionalFields<Target>, keyof Base> extends never
    ? IBuild<Target> & IWith<Target, Base, {}>
    : IWith<Target, Base, {}> {
    return new Build<Target, Base, {}>(base) as any;
  }
  public static new<Target extends object>(): keyof PickNonOptionalFields<Target> extends never
    ? IBuild<Target> & IWith<Target, {}, {}>
    : IWith<Target, {}, {}> {
    return new Build<Target, {}, {}>({}) as any;
  }
}

export { ObjectBuilder };

// WORKS
type Test = { a: number; b: string; c?: boolean };
function prop<T, K extends keyof T>(obj: T, key: K): Pick<T, K> {
  return { [key]: obj[key] } as any;
}
const f = prop({ a: 1, b: 'string' }, 'a');
type f1 = typeof f;
type f2 = Omit<Test, keyof { a: number } & Pick<Test, 'b'>>;
type f3 = { a: number } & Pick<Test, 'b'>;
type f4 = Omit<Test, keyof f3>;
const f5: Test = { a: 1, b: '1', c: undefined };
const aaaaaa = ObjectBuilder.fromBase<Test, {}>({})
  .with('a', 1)
  .with('b', '1')
  .with('c', false)
  .build();

const f6: Partial<Test> = {};
f6.a = 1;

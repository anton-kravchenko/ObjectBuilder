import { PickNonOptionalFields } from './types';

interface IBuild<Target> {
  build(): Target;
}

/*
  Target == Base & Supplied
  ? => Build<Target>
  : => IWith<Target, Base, Supplied & Pick<Target, K> // & Supplied & { K: T1[K] }
*/
interface IWith<Target, Base, Supplied> {
  with<T1 extends Omit<Target, keyof Supplied>, K extends keyof T1>(
    key: K,
    value: T1[K],
    // ): keyof Omit<Omit<Target, keyof Supplied>, K> extends never
  ): keyof Omit<Omit<Target, keyof Supplied>, K> extends never
    ? IBuild<Target>
    : IWith<Target, Base, Supplied & Pick<T1, K>>;
  // keyof Omit<Target, keyof Supplied> extends never
  //   ? IBuild<Target>
  //   : keyof Omit<Omit<Target, keyof Base>, keyof Supplied> extends never
  //   ? IBuild<Target> & IWith<Target, Base, Supplied & Pick<T1, K>>
  //   : IWith<Target, Base, Supplied & Pick<T1, K>>;
}

class Build<Target, Base, Supplied> implements IBuild<Target>, IWith<Target, Base, Supplied> {
  constructor(private target: Partial<Target>) {}

  // with1<T1 extends T, K extends keyof T1>(
  //   key: K,
  //   value: T1[K],
  // ): keyof PickNonOptionalFields<Omit<T1, K>> extends never
  //   ? keyof Omit<T1, K> extends never
  //     ? IBuild<BaseType>
  //     : IBuild<BaseType> & IWith<Omit<T1, K>, BaseType>
  //   : IWith<Omit<T1, K>, BaseType> {
  //   (this.target as T1)[key] = value;
  //   return new Build<Omit<T1, K>, BaseType>(this.target as T1) as any;
  // }

  with<T1 extends Omit<Target, keyof Supplied>, K extends keyof T1>(
    key: K,
    value: T1[K],
  ): keyof Omit<Omit<Target, keyof Supplied>, K> extends never
    ? IBuild<Target>
    : IWith<Target, Base, Supplied & Pick<T1, K>> {
    (this.target as any)[key] = value;
    return new Build<Target, Base, Supplied & Pick<T1, K>>(this.target as any) as any;
  }

  build(): keyof Omit<Omit<Target, keyof Base>, keyof Supplied> extends never ? Target : never {
    return (this.target as Required<Target>) as any;
  }
}

class ObjectBuilder<T> {
  // public static fromBase<T, F extends Partial<T>>(
  //   base: F,
  // ): keyof PickNonOptionalFields<Omit<T, keyof F>> extends never
  //   ? IWith<Omit<T, keyof F>, T> & IBuild<T>
  //   : IWith<Omit<T, keyof F>, T> {
  //   return new Build<Omit<T, keyof F>, T>(base) as any;
  // }

  public static fromBase<Target, Base extends Partial<Target>>(
    base: Base,
  ): keyof Omit<Target, keyof Base> extends never ? IBuild<Target> : IWith<Target, Base, {}> {
    return new Build<Target, Base, {}>(base) as any;
  }
}

// keyof Omit<Target, keyof Supplied & Pick<T1, K>> extends never
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

const aaaaaa = ObjectBuilder.fromBase<Test, {}>({})
  .with('a', 1)
  .with('b', '1')
  .with('c', false)
  .build();

import { PickNonOptionalFields } from './types';

interface IBuild<T> {
  build(): T;
}

interface IWith<T, R> {
  with<T1 extends T, K extends keyof T1>(
    key: K,
    value: T1[K],
  ): keyof PickNonOptionalFields<Omit<T1, K>> extends never
    ? keyof Omit<T1, K> extends never
      ? IBuild<R>
      : IBuild<R> & IWith<Omit<T1, K>, R>
    : IWith<Omit<T1, K>, R>;
}

class Build<T, BaseType> implements IBuild<BaseType>, IWith<T, BaseType> {
  constructor(private target: Partial<BaseType>) {}

  with<T1 extends T, K extends keyof T1>(
    key: K,
    value: T1[K],
  ): keyof PickNonOptionalFields<Omit<T1, K>> extends never
    ? keyof Omit<T1, K> extends never
      ? IBuild<BaseType>
      : IBuild<BaseType> & IWith<Omit<T1, K>, BaseType>
    : IWith<Omit<T1, K>, BaseType> {
    (this.target as T1)[key] = value;
    return new Build<Omit<T1, K>, BaseType>(this.target as T1) as any;
  }

  build(): keyof T extends never ? BaseType : never {
    return (this.target as Required<BaseType>) as any;
  }
}

class ObjectBuilder<T> {
  public static fromBase<T, F extends Partial<T>>(
    base: F,
  ): keyof PickNonOptionalFields<Omit<T, keyof F>> extends never
    ? IWith<Omit<T, keyof F>, T> & IBuild<T>
    : IWith<Omit<T, keyof F>, T> {
    return new Build<Omit<T, keyof F>, T>(base) as any;
  }
}

type StubbedEndpoint = {
  name: string;
  method: 'GET' | 'POST' | 'PUT';
  url?: string;
  status?: number;
};

const base1 = { name: '123', method: 'GET' as const };
// @ts-expect-error
ObjectBuilder.fromBase<StubbedEndpoint, typeof base1>(base1).with('name', '13'); // <- because `base` has `name`
const b1 = ObjectBuilder.fromBase<StubbedEndpoint, typeof base1>(base1).build();

const base2 = { url: '123', status: 123 };
// @ts-expect-error
ObjectBuilder.fromBase<StubbedEndpoint, typeof base2>(base2).build(); // <- because no required fields had been supplied
// @ts-expect-error
ObjectBuilder.fromBase<StubbedEndpoint, typeof base2>(base2).with('url', 'url'); // <- because `base` has `name`
const b2 = ObjectBuilder.fromBase<StubbedEndpoint, typeof base2>(base2)
  .with('method', 'GET')
  .with('name', 'name')
  .build();

/*
  Builder.from({ a: b })
  Builder.new()
*/
export { ObjectBuilder };

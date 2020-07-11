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
/*
  BaseType
  SuppliedType
  OmittedType

*/
export { ObjectBuilder };

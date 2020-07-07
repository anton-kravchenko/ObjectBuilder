interface IBuild<T, R> {
  build(): keyof T extends never ? R : never;
}

interface IWith<T, R> {
  with<T1 extends T, K extends keyof T1>(
    key: K,
    value: T1[K],
  ): keyof Omit<T1, K> extends never ? IBuild<Omit<T1, K>, R> : IWith<Omit<T1, K>, R>;
}

class Build<T, BaseType> implements IBuild<T, BaseType>, IWith<T, BaseType> {
  constructor(private target: Partial<BaseType>) {}

  with<T1 extends T, K extends keyof T1>(
    key: K,
    value: T1[K],
  ): keyof Omit<T1, K> extends never
    ? IBuild<Omit<T1, K>, BaseType>
    : IWith<Omit<T1, K>, BaseType> {
    (this.target as T1)[key] = value;
    // @ts-ignore
    return new Build<Omit<T1, K>, BaseType>(this.target as T1);
  }

  build(): keyof T extends never ? BaseType : never {
    // @ts-ignore
    return this.target as Required<BaseType>;
  }
}

class ObjectBuilder<T> {
  public static of<T, F extends Partial<T>>(base: F): IWith<Omit<T, keyof F>, T> {
    return new Build<Omit<T, keyof F>, T>(base || {}); // <- figure out the api
  }
}

export { ObjectBuilder };

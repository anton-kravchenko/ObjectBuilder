class ObjectBuilder {
  public static new<Target>(): IWith<Target, {}> {
    return new Build<Target, {}>({});
  }
}

interface IWith<Target, Supplied> {
  with<T extends Omit<Target, keyof Supplied>, K extends keyof T>(
    key: K,
    value: T[K],
  ): keyof Omit<Omit<Target, keyof Supplied>, K> extends never
    ? IBuild<Target>
    : IWith<Target, Supplied & Pick<T, K>>;
}

interface IBuild<Target> {
  build(): Target;
}

class Build<Target, Supplied> implements IBuild<Target>, IWith<Target, Supplied> {
  constructor(private target: Partial<Target>) {}

  with<T extends Omit<Target, keyof Supplied>, K extends keyof T>(key: K, value: T[K]) {
    const target: Partial<Target> = { ...this.target, [key]: value };

    return new Build<Target, Supplied & Pick<T, K>>(target);
  }

  build() {
    return this.target as Target;
  }
}

const response: ResponseEntity = ObjectBuilder.new<ResponseEntity>()
  .with('payload', 'OK')
  .with('status', 200)
  .build();

type ResponseEntity = { status: number; payload: string };

export { ObjectBuilder };
export type { PickNonOptionalFields, PickNonOptionalFieldsKeys, Keys } from './types';
// FIXME: return type in class can be omitted

type T = keyof {} extends never ? true : false;

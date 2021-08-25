/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectBuilder } from '../../ObjectBuilder';

type TestType = { foo: string; bar: number; baz?: boolean };

/**
 * `basedOn`  `type-check` test
 *
 * Case 1: `.with` allows to rewrite all fields
 */
function case1() {
  type TestType = { foo: string; bar: number; baz?: boolean };

  const entity: TestType = { foo: 'foo', bar: 1 };

  ObjectBuilder.basedOn<TestType>(entity)
    .with('foo', 'str')
    .with('bar', 123)
    .with('baz', true)
    .build();

  ObjectBuilder.basedOn<TestType>(entity).with('foo', 'str').build();
}

/**
 * `basedOn`  `type-check` test
 *
 * Case 2: `.basedOn` should throw if type of the first argument doesn't match type T
 */
function case2() {
  type TestType = { foo: string; bar: number; baz?: boolean };

  // @ts-expect-error
  ObjectBuilder.basedOn<TestType>({});
}

/**
 * `basedOn` `type-check` test
 *
 * Case 3: `basedOn` accepts only one type argument and lets to rewrite all props one time
 */
function case3() {
  type TestType = { method: string; status: number; response: string };
  const base: TestType = { method: 'get', status: 123, response: 'string' };
  ObjectBuilder.basedOn<TestType>(base)
    .with('method', 'a')
    .with('response', '123')
    .with('status', 123)
    .build();
}

/**
 * `basedOn` `type-check` test
 *
 * Case 4: `basedOn` allows to build object right away
 */
function case4() {
  type TestType = { method: string; status: number; response: string };
  const base: TestType = { method: 'get', status: 123, response: 'string' };
  ObjectBuilder.basedOn<TestType>(base).build();
}

/**
 * `basedOn` `type-check` test
 *
 * Case 5: `basedOn` does not allow `base` to have type different than T1
 */
function case5() {
  type TestType = { method: string; status: number; response: string };
  const base = { method: 'get', status: 123 };

  // @ts-expect-error
  ObjectBuilder.basedOn<TestType>(base);
}

/**
 * `basedOn` `type-check` test
 *
 * Case 6: `basedOn` does not allow supplying properties that do not exist in T1
 */
function case6() {
  type TestType = { method: string; status: number; response: string };
  const base: TestType = { method: 'get', status: 123, response: 'string' };

  // @ts-expect-error
  ObjectBuilder.basedOn<TestType>(base).with('foo', 'bar').build();
}

/**
 * `basedOn` `type-check` test
 *
 * Case 7: `basedOn` does not allow supplying values of the wrong type
 */
function case7() {
  type TestType = { method: string; status: number; response: string };
  const base: TestType = { method: 'get', status: 123, response: 'string' };

  // @ts-expect-error
  ObjectBuilder.basedOn<TestType>(base).with('method', 123).build();

  ObjectBuilder.basedOn<TestType>(base).with('method', 'get').build();
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectBuilder } from 'ObjectBuilder'; // TODO: move to ObjectBuilder
// TODO: make sure it type-checks during `build`
// TODO: read about `as const`
// TODO: fix ℹ No staged files match any configured task.
type TestType = { foo: string; bar: number; baz?: boolean };

/**
 * `fromBase`
 *
 * Case 1: `.with` is available only if some of the fields haven't been supplied (either optional or required)
 */
function case1() {
  type TestType = { foo: string; bar: number; baz?: boolean };

  const base = {};

  ObjectBuilder.fromBase<TestType, typeof base>(base)
    .with('foo', 'str')
    .with('bar', 123)
    .with('baz', true)
    // .with('baz', undefined) // <- FIXME: check that
    .build();

  ObjectBuilder.fromBase<TestType, typeof base>(base)
    .with('foo', 'str')
    .with('bar', 123)
    .with('baz', true)
    // @ts-expect-error
    .with('should throw', true);
}
/**
 * `fromBase`
 *
 * Case 2: `.with` ignores fields from `base` therefore allows  to rewrite all fields from `base`
 */
function case2() {
  const base = { foo: 'string', bar: 123, baz: false };

  ObjectBuilder.fromBase<TestType, typeof base>(base)
    .with('foo', 'str')
    .with('bar', 123)
    .with('baz', true)
    .build();
}
/**
 * `fromBase`
 *
 * Case 3: `.with` doesn't allow to rewrite fields from preceding `with` calls
 */
function case3() {
  const base = {};
  ObjectBuilder.fromBase<TestType, typeof base>(base)
    .with('foo', 'str')
    // @ts-expect-error
    .with('foo', 'another str');
}
/**
 * `fromBase`
 *
 * Case 5: `.with` doesn't allow as first argument anything except `keyof T`
 */
function case5() {
  const base = {};
  ObjectBuilder.fromBase<TestType, typeof base>(base)
    // @ts-expect-error
    .with('this-field-does-not-belong-here', 'str');
}
/**
 * `fromBase`
 *
 * Case 6: `.with` doesn't allow as second argument anything except `T[K]`
 */
function case6() {
  type TestType = { foo: 'GET' | 'POST'; bar: 1 | 2; baz?: true };
  const base = { foo: 'GET' as const, bar: 1 as const, baz: true as const };

  ObjectBuilder.fromBase<TestType, typeof base>(base)
    // @ts-expect-error
    .with('foo', 'PATCH')
    // @ts-expect-error
    .with('bar', 3)
    // @ts-expect-error
    .with('baz', false)
    .build();
}
/**
 * `fromBase`
 *
 * Case 7: `.build` becomes available when all required fields have been supplied via `with`
 */
function case7() {
  type TestType = { foo: 'GET' | 'POST'; bar?: 1 | 2; baz?: true };
  const base = {};

  ObjectBuilder.fromBase<TestType, typeof base>(base).with('foo', 'GET').build();
}
/**
 * `fromBase`
 *
 * Case 8: `.build` becomes available (right away) when all required fields have been supplied via `base` object
 */
function case8() {
  type TestType = { foo: 'GET' | 'POST'; bar?: 1 | 2; baz?: true };
  const base = { foo: 'GET' as const, bar: 1 as const, baz: true as const };

  ObjectBuilder.fromBase<TestType, typeof base>(base).build();
}
/**
 * `fromBase`
 *
 * Case 9: `.build` becomes available (right away) when all required fields have been supplied via `base` object (assuming that target type has optional fields)
 */
function case9() {
  type TestType = { foo: 'GET' | 'POST'; bar?: 1 | 2; baz?: true };
  const base = { foo: 'GET' as const };

  ObjectBuilder.fromBase<TestType, typeof base>(base).build();
}
/**
 * `fromBase`
 *
 * Case 10: `.build` doesn't allow any arguments
 */
function case10() {
  type TestType = { foo: number };
  const base = {};

  ObjectBuilder.fromBase<TestType, typeof base>(base)
    .with('foo', 1)
    // @ts-expect-error
    .build("I'm shouldn't be here");
}
/**
 * `fromBase`
 *
 * Case 11: `.build` should allow to use all props from the target type after a call
 */
function case11() {
  const base = {};

  const { foo, bar, baz } = ObjectBuilder.fromBase<TestType, typeof base>(base)
    .with('foo', 'str')
    .with('bar', 123)
    .with('baz', true)
    .build();

  // @ts-expect-error
  const { howDidIGetHere } = ObjectBuilder.fromBase<TestType, typeof base>(base)
    .with('foo', 'str')
    .with('bar', 123)
    .with('baz', true)
    .build();
}
/**
 * `fromBase`
 *
 * Case 11: `.build` becomes available once all required fields are supplies (takes into account no optional fields from `base`)
 */
function case12() {
  type TestType = { method: string; status: number; response: string };
  const base = { method: 'get' };

  ObjectBuilder.fromBase<TestType, typeof base>(base)
    .with('response', '{}')
    .with('status', 200)
    .build();
}

// WORKS
type Test = { a: number; b: string; c?: boolean };
function prop<T, K extends keyof T>(obj: T, key: K): Pick<T, K> {
  return { [key]: obj[key] } as any;
}
const f = prop({ a: 1, b: 'string' }, 'a');
type f1 = typeof f;

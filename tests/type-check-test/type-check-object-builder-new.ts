/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectBuilder } from 'poc'; // TODO: move to ObjectBuilder
// TODO: think about symbols
// TODO: check how it works with Arrays
// TODO: add instructions for arrays
// TODO: add instructions for `const` types
type TestType = { foo: string; bar: number; baz?: boolean };

/**
 * `new`
 *
 * Case 1: `.with` is available only if some of the fields haven't been supplied (either optional or required)
 */
function case1() {
  ObjectBuilder.new<TestType>()
    .with('foo', 'str')
    .with('bar', 123)
    .with('baz', false)
    // @ts-expect-error -> 'baz' has already been supplied ^
    .with('baz', false);
}
/**
 * `new`
 *
 * Case 2: `.with` doesn't allow to rewrite fields from preceding `with` calls
 */
function case2() {
  type TestType = { a: string; b: number };
  ObjectBuilder.new<TestType>()
    .with('a', '')
    .with('b', 1)
    // @ts-expect-error -> should not allow to rewrite already supplied fields
    .with('a', '');
}
/**
 * `new`
 *
 * Case 3: `.with` doesn't allow as first argument anything except `keyof T`
 */
function case3() {
  type TestType = { 'the-key': string };

  ObjectBuilder.new<TestType>().with('the-key', 'the-value');

  // @ts-expect-error -> `not_supported-key` is not part of a `TestType`
  ObjectBuilder.new<TestType>().with('not_supported-key', 'the-value');
}
/**
 * `new`
 *
 * Case 4: `.with` doesn't allow as second argument anything except `T[K]`
 */
function case4() {
  type TestType = { method: 'GET' | 'POST' };

  ObjectBuilder.new<TestType>().with('method', 'GET');
  ObjectBuilder.new<TestType>().with('method', 'POST');

  // @ts-expect-error -> 'PUT' doesn't belong to the union of supported string literals
  ObjectBuilder.new<TestType>().with('method', 'PUT');
}
/**
 * `new`
 *
 * Case 5: `.build` becomes available when all required fields have been supplied via `with`
 */
function case5() {
  type TestType = { a: 'b'; c: 'd'; e?: 'f' };
  // FIXME: check why is that - can we use extends object in `fromBase`?

  // @ts-expect-error -> should not offer `.with` method if `Target` type is not set
  ObjectBuilder.new().with;

  // @ts-expect-error -> build is not available because `b` field is missing
  ObjectBuilder.new<TestType>().with('a', 'b').build();
  ObjectBuilder.new<TestType>().with('a', 'b').with('c', 'd').build();
  ObjectBuilder.new<TestType>().with('a', 'b').with('c', 'd').with('e', 'f').build();
}
/**
 * `new`
 *
 * Case 6: `.build` doesn't allow any arguments
 */
function case6() {
  type TestType = { a: number };

  ObjectBuilder.new<TestType>().with('a', 1337).build();

  // @ts-expect-error -> because `.build` doesn't accept arguments
  ObjectBuilder.new<TestType>().with('a', 1337).build(123);
}
/**
 * `new`
 *
 * Case 7: `.build` becomes available right away if target type is
 */
function case7() {
  type TestType = {};

  // @ts-expect-error -> since `TestType` is empty, the builder should not offer `.with` method
  ObjectBuilder.new<TestType>().with;

  // FIXME: should be never instead
  const t = ObjectBuilder.new().build();
}
/**
 * `new`
 *
 * Case 8: `.build` should allow to use all props from the target type after a call
 */
function case8() {}

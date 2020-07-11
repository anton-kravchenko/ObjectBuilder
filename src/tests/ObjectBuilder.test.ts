import { ObjectBuilder } from '../ObjectBuilder';

type StubbedEndpoint = {
  name: string;
  method: 'GET' | 'POST' | 'PUT';
  url: string;
  fixture: string;
  status: number;
};

describe('test ObjectBuilder', () => {
  describe('test `fromBase` method', () => {
    it('should properly build plane objects based on an empty object', () => {
      const data = ObjectBuilder.fromBase<StubbedEndpoint, {}>({})
        .with('name', 'order-history')
        .with('url', `/ihs-order-management/order/history`)
        .with('method', 'POST')
        .with('status', 200)
        .with('fixture', 'fixture:UnfulfilledOrder.json')
        .build();

      expect(data).toEqual({
        name: 'order-history',
        url: `/ihs-order-management/order/history`,
        method: 'POST',
        status: 200,
        fixture: 'fixture:UnfulfilledOrder.json',
      });
    });

    it('should respect base object and properly extend it', () => {
      const base = {
        name: 'order-history',
        url: '/ihs-order-management/order/history',
        method: 'POST' as const,
      };
      const data = ObjectBuilder.fromBase<StubbedEndpoint, typeof base>(base)
        .with('status', 200)
        .with('fixture', 'fixture:UnfulfilledOrder.json')
        .build();

      expect(data).toEqual({
        name: 'order-history',
        url: `/ihs-order-management/order/history`,
        method: 'POST',
        status: 200,
        fixture: 'fixture:UnfulfilledOrder.json',
      });
    });
    it('should "revoke" builder after `build` call', () => {
      const data = ObjectBuilder.fromBase<{ foo: string; bar: number }, {}>({})
        .with('foo', 'baz')
        .with('bar', 123)
        .build();

      // @ts-expect-error
      expect(() => data.build()).toThrowError('data.build is not a function');

      // @ts-expect-error
      expect(() => data.attemptToAddAnotherProp('bazinga')).toThrow(
        'data.attemptToAddAnotherProp is not a function',
      );
    });

    it('should fallback `undefined` passed to `fromBase` with an empty object', () => {
      // @ts-expect-error -> because `unknown` doesn't satisfy `extends object` constraint
      const data = ObjectBuilder.fromBase<unknown, unknown>(undefined).build();

      expect(data).toEqual({});
    });

    it('should properly override base values', () => {
      type Target = { foo: string; bar: number };
      type Base = Target;

      const base: Base = { foo: '1337', bar: 1337 };

      const data = ObjectBuilder.fromBase<Target, Base>(base)
        .with('foo', '2020')
        .with('bar', 2020)
        .build();

      expect(data).toEqual({ foo: '2020', bar: 2020 });
    });
  });

  describe('test `new` method', () => {
    it('should properly build plain objects', () => {
      const data = ObjectBuilder.new<StubbedEndpoint>()
        .with('name', 'getStatusStub')
        .with('method', 'GET')
        .with('status', 200)
        .with('fixture', 'fixture:getInfo.json')
        .with('url', '/status')
        .build();

      expect(data).toEqual({
        name: 'getStatusStub',
        method: 'GET',
        status: 200,
        fixture: 'fixture:getInfo.json',
        url: '/status',
      });
    });

    it('should return an empty object if no `.with` calls have been made', () => {
      const data = ObjectBuilder.new<Partial<StubbedEndpoint>>().build();
      expect(data).toEqual({});
    });
  });
});

// FIXME: check why `const data = ObjectBuilder.fromBase<unknown, unknown>(undefined).build();` offers .with

# ObjectBuilder

![](https://github.com/anton-kravchenko/ObjectBuilder/workflows/CI/badge.svg)

`ObjectBuilder` is a **type-safe** implementation of `Builder` pattern with smart type inference.

## Usage

`ObjectBuilder.new`

```typescript
import { ObjectBuilder } from 'typescript-object-builder';

type Endpoint = { url: string; method: string; description?: string };

const endpoint = ObjectBuilder.new<Endpoint>()
  .with('url', `/status/`)
  .with('method', 'GET')
  .with('description', 'Health check')
  .build(); /* OK - all of the required fields are set - `build` method becomes available */

const invalidEndpoint = ObjectBuilder.new<Endpoint>()
  .with('url', `/status/`)
  .with('description', 'Health check')
  .build(); /* Error - build method is not available since one of the required fields is not set */
```

`ObjectBuilder.fromBase`

```typescript
import { ObjectBuilder } from 'typescript-object-builder';

type Endpoint = { url: string; method: string; description?: string };

const base = { url: '/status', description: 'Health check' };

const endpoint = ObjectBuilder.fromBase<Endpoint, typeof base>(base)
  .with('method', 'GET')
  .build(); /* OK - all of the required fields are set (via base object and `with`) */

const invalidEndpoint = ObjectBuilder.fromBase<Endpoint, typeof base>(base)
  .with('description', 'desc')
  .build(); /* Error - build method is not available since one of the required fields is not set */
```

## Utility types

`ObjectBuilder.PickNonOptionalFieldsKeys`

```typescript
import type { PickNonOptionalFieldsKeys } from 'typescript-object-builder';

type Endpoint = { url: string; method: string; description?: string };

type T = PickNonOptionalFieldsKeys<Endpoint>; /* T is "url" | "method" */
```

`ObjectBuilder.PickNonOptionalFields`

```typescript
import type { PickNonOptionalFields } from 'typescript-object-builder';

type Endpoint = { url: string; method: string; description?: string };

type T = PickNonOptionalFields<Endpoint>; /* T is { url: string; method: string; } */
```

## Features

- type-safe - it doesn't allow to call build method unless all non optional fields have been set
- smart type inference - builder offers (via autocomplete) only those fields which have not been set yet

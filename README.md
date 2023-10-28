# coalescify

coalesce inflight promise calls into a single promise

```ts
import coalescify from 'coalescify';

const fetchResource = async (id: number) => {
  // ...
};

const coalescedFetchResource = coalescify(fetchResource);

const results = await Promise.all([
    coalescedFetchResource(1), 
    coalescedFetchResource(1),
    coalescedFetchResource(1),
    coalescedFetchResource(3)
])

// coalescedFetchResource(1) will only be called once, and the resolved result will be shared between all other calls
// coalescedFetchResource(3) will only be called once
```

coalescify will automatically determine inflight calls to coalesce based on the arguments passed to the function. If the arguments are the same, the promise will be shared.

a custom coalescion key generator function can be passed as the second argument

```ts
import coalescify from 'coalescify';

const fetchResource = async (type: string, id: number) => {
  // ...
};

const coalescedFetchResource = coalescify(fetchResource, (type, id) => `${type}/${id}`);

const results = await Promise.all([
    coalescedFetchResource('dog', 1), 
    coalescedFetchResource('dog', 1),
    coalescedFetchResource('dog', 2),
    coalescedFetchResource('cat', 1)
])

// coalescedFetchResource('dog', 1) will be called once
// coalescedFetchResource('dog', 2) will be called once
// coalescedFetchResource('cat', 1) will be called once
```

using a custom coalescion key generator is generally faster, since the default implementation uses JSON.stringify on function arguments, which is slower
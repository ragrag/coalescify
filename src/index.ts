export default function coalescify<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  keyFn?: (...args: Args) => string
): (...args: Args) => Promise<T> {
  const promiseMap = new Map<string, Promise<T>>();

  return async (...args: Args): Promise<T> => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);

    const inflightProm = promiseMap.get(key);
    if (inflightProm) {
      return inflightProm;
    }

    try {
      const promise = fn(...args);
      promiseMap.set(key, promise);
      return await promise;
    } finally {
      promiseMap.delete(key);
    }
  };
}

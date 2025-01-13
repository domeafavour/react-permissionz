import type { PermissionsWrapper } from "./typings";

export function createPermissionsWrapper<T extends string>(
  permissions: T[] | null
): PermissionsWrapper<T> {
  const set = new Set(permissions);
  const list = Array.from(set);

  function has(value: T) {
    return set.has(value);
  }

  return {
    has,
    and: (allowed) =>
      // `Array.prototype.every` returns true for empty arrays
      set.size ? allowed.every(has) : false,
    or: (allowed) => allowed.some(has),
    all: () => list,
    get isReady() {
      return permissions !== null;
    },
  };
}

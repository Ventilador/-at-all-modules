const configurable = false, writable = false;
export function defineProperty<T, Key extends keyof T>(obj: T, prop: Key, value: T[Key]) {
    Object.defineProperty(obj, prop, { value, configurable, writable });
}

export function defineGetter<T, Key extends keyof T>(obj: T, prop: Key, get: () => T[Key]) {
    Object.defineProperty(obj, prop, { get, configurable, writable });
}
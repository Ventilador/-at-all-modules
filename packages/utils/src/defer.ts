import { IDeferred } from "@webpack-types/async";

export function createDefer<T>(): IDeferred<T> {
    const defer: IDeferred<T> = { resolved } as any;
    let done = false;
    defer.promise = new Promise<T>((s, f) => {
        defer.resolve = resolve;
        defer.reject = reject;
        function resolve(value: any) {
            s(value);
            done = true;
        }
        function reject(err: any) {
            f(err);
            done = true;
        }
    });

    function resolved() {
        return done;
    }
    return defer;
}
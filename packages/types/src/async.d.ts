declare module '@webpack-types/async' {
    interface IDeferred<T> {
        resolve: (value: T) => any;
        reject: (value: any) => any;
        resolved: () => boolean;
        promise: Promise<T>
    }
}
declare module '@webpack-types/tapable' {
    interface SyncHook<TArgs extends any[] = any[], TResult = any> {
        call: (...args: TArgs) => TResult;
        tap: (name: string | Tap, fn: (...args: TArgs) => TResult) => void;
        intercept: (interceptor: HookInterceptor) => void;
    }



    interface AsyncHook<TArgs extends any[] = any[], TResult = any> extends Pick<SyncHook<TArgs, TResult>, 'tap' | 'intercept'> {
        tapPromise: (name: string | Tap, cb: TapPromise<TArgs, TResult>) => void;
        promise: (...args: TArgs) => Promise<TResult>;
    }

    interface TapPromise<TArgs extends any[] = any[], TResult = any> {
        (...args: TArgs): Promise<TResult> | TResult;
    }

    interface AsyncTaps<TArgs extends any[] = any[], TResult = any> {
        tapPromise: (name: string | Tap, cb: TapPromise<TArgs, TResult>) => void;
    }

    interface HookCompileOptions {
        type: TapType;
    }

    interface HookInterceptor {
        call?: (...args: any[]) => void;
        loop?: (...args: any[]) => void;
        tap?: (tap: Tap) => void;
        register?: (tap: Tap) => Tap | undefined;
        context?: boolean;
    }

    interface Tap {
        name: string;
        type?: TapType;
        fn?: Function;
        stage?: number;
        context?: boolean;
    }

    type TapType = "sync" | "async" | "promise";
}
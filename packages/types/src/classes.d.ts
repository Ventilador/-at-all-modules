declare module '@webpack-types/classes' {
    type AsyncHook<T, R> = import('@webpack-types/tapable').AsyncHook
    type RequestData = import('@webpack-types/enhanced-resolve').RequestData;
    type PackageJSON = import('@webpack-types/package-json').PackageJSON;
    type BundleInfoRaw = import('@webpack-types/package-json').BundleInfoRaw;
    interface WebpackMultiCompiler {
        readonly hooks: MultiCompilerHooks;
        readonly rootDir: string;
        readonly watch: boolean;
        readonly isRoot: boolean;
        readonly threads: number | undefined;
        readonly watchOptions: import('webpack').WatchOptions | undefined;
    }
    interface MultiCompilerHooks {
        readonly beforeOptions: AsyncHook<[WebpackMultiOptions], Required<WebpackMultiOptions>>;
        readonly options: AsyncHook<[Required<WebpackMultiOptions>], Required<WebpackMultiOptions>>;
        readonly loadProject: AsyncHook<[string], Context[]>;
        readonly loadContexts: AsyncHook<[string[]], Context[]>;
        readonly processContext: AsyncHook<[Context], void>;
        readonly getContext: AsyncHook<[string | RequestData | Context], Context>;
        readonly createContext: AsyncHook<[string], Context>;
    }
    interface WebpackMultiOptions {
        rootDir?: string;
        watch?: boolean | import('webpack').WatchOptions;
        projects?: string[];
        threads?: number;
        plugins?: (Plugin | DeferPlugin)[];
    }
    interface Plugin {
        apply(compiler: WebpackMultiCompiler): void;
    }
    interface DeferPlugin {
        path: string;
        options: any[];
    }

    interface Context {
        readonly name: string;
        readonly jsonPath: string;
        readonly dir: string;
        readonly content: PackageJSON;
        readonly info: BundleInfoRaw;
        readonly compiler: WebpackMultiCompiler;
        readonly addIncludes: (toAdd: Includes) => void;
        readonly addDefines: (toAdd: Defines) => void;
        includesFullPath(path: string): boolean;
        init(): void;
        includes(request: string | RequestData): Includes | undefined;
        defines(request: string | RequestData): Includes | undefined;
    }

    interface Includes {
        readonly name: string;
        readonly reason: string | WithReason;
        test(value: string): boolean;
    }
    interface Defines extends Includes {
        readonly root: string[];
    }

    interface WithReason {
        reason: string | WithReason;
    }
}
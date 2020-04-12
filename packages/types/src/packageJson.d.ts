declare module '@webpack-types/package-json' {
    interface BundleInfoRaw {
        name?: string;
        includes?: string[];
        defines?: Record<string, string | string[]>
    }
    type WebpackCallback<TResult, TError = any> = (err?: TError | null, value?: TResult) => any;
    interface PackageJSON {
        name: string;
        internalName: string;
        displayName: string;
        description: string;
        author: string;
        version: string;
        private: boolean;
        "bundle-info": BundleInfoRaw | BundleInfoRaw[];
        scripts: Record<string, string>;
        thresholds: Thresholds;
        devDependencies: Record<string, string>;
        gitHooks: Record<string, string>;
    }
    interface Thresholds {
        statements: number;
        branches: number;
        lines: number;
        functions: number;
    }

    type RawProjectContext = {
        name: string;
        content: PackageJSON;
        info: BundleInfoRaw;
        dirName: string;
        jsonPath: string;
    }
}
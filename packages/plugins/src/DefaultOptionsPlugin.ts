import { WebpackMultiCompiler } from "@webpack-types/classes";

export class DefaultOptionsPlugin {
    apply(compiler: WebpackMultiCompiler): void {
        compiler.hooks.beforeOptions.tapPromise({ name: 'DefaultOptionsPlugin', stage: -9999999 }, (opts) => {
            return Object.assign({
                plugins: [],
                rootDir: '',
                watch: false,
                projects: [],
                threads: 0
            }, opts);
        })
    }
}
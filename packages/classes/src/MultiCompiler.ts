import { AsyncSeriesWaterfallHook, AsyncSeriesHook } from 'tapable';
import { AsyncHook } from '@webpack-types/tapable'
import { DefaultOptionsPlugin } from '@webpack-multi/plugins';
import { RequestData } from '@webpack-types/enhanced-resolve';
import { WebpackMultiOptions, DeferPlugin, Plugin, WebpackMultiCompiler } from '@webpack-types/classes';
import { Context, } from './Context';
import { WatchOptions } from 'webpack';
import { defineProperty } from '@webpack-multi/utils';
import { ContextRegistry } from './ContextRegistry';
import { PackageJsonRegistry } from './PackageJsonRegistry';
export class MultiCompiler implements WebpackMultiCompiler {
    public readonly hooks!: MultiCompilerHooks;
    public readonly rootDir!: string;
    public readonly watch!: boolean;
    public readonly isRoot!: boolean;
    public readonly threads: number | undefined;
    public readonly watchOptions!: WatchOptions | undefined;
    public readonly contextRegistry!: ContextRegistry;
    public readonly packageJsonRegistry!: PackageJsonRegistry;
    constructor() {
        const hooks: MultiCompilerHooks = {} as any;
        defineProperty(this, 'hooks', hooks);
        defineProperty(this, 'contextRegistry', new ContextRegistry(this));
        defineProperty(this, 'packageJsonRegistry', new PackageJsonRegistry(this));
        
        defineProperty(hooks, 'beforeOptions', new AsyncSeriesWaterfallHook(['options']) as any);
        defineProperty(hooks, 'options', new AsyncSeriesHook(['options']) as any);
        defineProperty(hooks, 'loadProject', new AsyncSeriesWaterfallHook(['context']) as any);
        defineProperty(hooks, 'loadContexts', new AsyncSeriesWaterfallHook(['projects']) as any);
        defineProperty(hooks, 'getContext', new AsyncSeriesWaterfallHook(['request']) as any);
        new DefaultOptionsPlugin().apply(this);
    }

    execute(options: WebpackMultiOptions) {
        const promise = this.hooks.beforeOptions.promise((options || {}) as Required<WebpackMultiOptions>)
            .then(opts => this.processOptions(opts))
            .then(opts => this.getContexts(opts))
            .then(contexts => Promise.all(contexts.map(c => this.hooks.processContext.promise(c))));
        this.execute = () => promise;
        return promise;
    }

    warn(message: string) {
        console.warn(message);
    }

    private processOptions(opts: Required<WebpackMultiOptions>) {
        const { rootDir, watch, threads, plugins } = opts;
        defineProperty(this, 'isRoot', !!threads);
        if (this.isRoot) {
            defineProperty(this, 'threads', threads);
        }

        defineProperty(this, 'rootDir', rootDir);
        if (watch) {
            defineProperty(this, 'watch', true);
            if (typeof watch === 'boolean') {
                defineProperty(this, 'watchOptions', {});
            } else {
                defineProperty(this, 'watchOptions', watch);
            }
        } else {
            defineProperty(this, 'watch', false);
        }
        for (let i = 0, plugin = plugins[0]; i < plugins.length; plugin = plugins[++i]) {
            if (isDeferPlugin(plugin)) {
                new (loadDeferPlugin(plugin))(...plugin.options).apply(this);
            } else {
                plugin.apply(this);
            }
        }
        return this.hooks.options.promise(opts);
    }

    private getContexts({ projects }: Required<WebpackMultiOptions>) {
        return this.hooks.loadContexts.promise(projects);
    }
}


export interface MultiCompilerHooks {
    readonly beforeOptions: AsyncHook<[WebpackMultiOptions], Required<WebpackMultiOptions>>;
    readonly options: AsyncHook<[Required<WebpackMultiOptions>], Required<WebpackMultiOptions>>;
    readonly loadProject: AsyncHook<[string], Context[]>;
    readonly loadContexts: AsyncHook<[string[]], Context[]>;
    readonly processContext: AsyncHook<[Context], void>;
    readonly getContext: AsyncHook<[string | RequestData | Context], Context>;
    readonly createContext: AsyncHook<[string], Context>;
}
function loadDeferPlugin(value: DeferPlugin): new (...args: any[]) => Plugin {
    return require(value.path);
}
function isDeferPlugin(value: any): value is DeferPlugin {
    return value && typeof value.path === 'string';
}

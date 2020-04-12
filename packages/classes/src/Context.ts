import { WebpackMultiExternalModule } from "./WebpackMultiExternalModule";
import { WithReason } from '@webpack-types/classes';
import { createDefer, defineProperty } from '@webpack-multi/utils';
import { EventEmitter } from "events";
import { IDeferred } from "@webpack-types/async";
import { PackageJSON, BundleInfoRaw } from "@webpack-types/package-json";
import { dirname, startsWith } from "@webpack-multi/path-utils";
import { RequestData } from "@webpack-types/enhanced-resolve";
import { MultiCompiler } from "./MultiCompiler";
import { Includes, IncludesFromName, IncludeRelatives } from "./Includes";
import { Context as ContextInterface, Defines as DefinesInterface, Includes as IncludesInterface } from '@webpack-types/classes';
import { Defines, DefinesName } from "./Defines";
export type WebpackMultiError = {
    file: any;
    message: string;
};
export type Events = {
    'run': () => void;
    'done': (errors?: WebpackMultiError[]) => void;
}

export type EventNames = keyof Events;
export abstract class Context extends (EventEmitter as new () => {}) implements ContextInterface {
    static from(_jsonPath: string): Context[] {
        return null as any;
    }
    public readonly name!: string;
    public readonly jsonPath!: string;
    public readonly dir!: string;
    public readonly content!: PackageJSON;
    public readonly info!: BundleInfoRaw;
    public readonly compiler!: MultiCompiler;
    public readonly addIncludes!: (toAdd: IncludesInterface) => void;
    public readonly addDefines!: (toAdd: DefinesInterface) => void;
    private _defines: DefinesInterface[] = [];
    private _includes: IncludesInterface[] = [];
    private _isRunning: IDeferred<WebpackMultiError[] | undefined> = createDefer();
    protected constructor(compiler: MultiCompiler, jsonPath: string, content: PackageJSON, info: BundleInfoRaw) {
        super();
        defineProperty(this, 'compiler', compiler);
        defineProperty(this, 'dir', dirname(jsonPath));
        defineProperty(this, 'jsonPath', jsonPath);
        defineProperty(this, 'content', content);
        defineProperty(this, 'info', info);
        defineProperty(this, 'name', info.name || content.name);
        defineProperty(this, 'addIncludes', (toAdd: IncludesInterface) => {
            if (isDuplicated(this._includes, toAdd)) {
                return;
            }
            this._includes.splice(1, 0, toAdd);
        });
        defineProperty(this, 'addDefines', (toAdd: DefinesInterface) => {
            this.addIncludes(toAdd);
            if (isDuplicated(this._defines, toAdd)) {
                return;
            }
            this._defines.unshift(toAdd);
        });
        this._includes.push(new IncludeRelatives(this.name));

        function isDuplicated(array: IncludesInterface[], toInclude: IncludesInterface) {
            for (let i = 1; i < array.length; i++) {
                if (array[i].name === toInclude.name) {
                    compiler.warn(`Duplicated name ${toInclude.name}`);
                    return true;
                }
            }

            return false;
        }
    }

    includesFullPath(path: string) {
        return startsWith(path, this.dir);
    }

    init() {
        const { name, info, addIncludes, addDefines } = this;
        const { defines, includes } = info;

        // define self
        addDefines(new DefinesName(name, [name], addIncludes));

        if (defines) {
            const keys = Object.keys(defines);
            for (let i = 0; i < keys.length; i++) {
                // define info.defines
                addDefines(new DefinesName(keys[i], [name].concat(defines[keys[i]]), addIncludes))
            }
        }
        if (includes) {
            // include info.includes
            includes.forEach(name => addIncludes(new IncludesFromName(name, addIncludes)))
        }
        this.on('run', () => {
            if (this._isRunning.resolved()) {
                this._isRunning = createDefer();
            }
        });
        this.on('done', (errors) => {
            this._isRunning.resolve(errors);
        });
    }

    abstract on<Key extends EventNames = EventNames>(event: Key, cb: Events[Key]): this;
    abstract off<Key extends EventNames = EventNames>(event: Key, cb: Events[Key]): this;
    abstract upToDate(): Promise<boolean>;
    abstract start(watching: boolean): void;
    abstract stop(): void;
    abstract asExternalModule(name: string): Promise<WebpackMultiExternalModule>;

    includes(request: string | RequestData) {
        return this._includes.find(reasonFor, request);
    }
    defines(request: string | RequestData) {
        return this._defines.find(reasonFor, request);
    }
}

function reasonFor(this: string | RequestData, reason: Includes) {
    return reason.test(typeof this === 'string' ? this : this.request);
}
export interface Context extends Omit<EventEmitter, 'on' | 'off' | "emit" | 'addListener' | 'removeListener' | 'prependListener' | 'once' | 'prependOnceListener'> {
    emit<Key extends EventNames = EventNames>(event: Key, arg: Parameters<Events[Key]>[0]): void;
}

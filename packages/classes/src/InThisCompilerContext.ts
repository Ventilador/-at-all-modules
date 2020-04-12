import { Context } from "./Context";
import { PackageJSON, BundleInfoRaw } from "@webpack-types/package-json";
import { MultiCompiler } from "./MultiCompiler";

export class InThisCompilerContext extends Context {
    constructor(compiler: MultiCompiler, jsonPath: string, content: PackageJSON, info: BundleInfoRaw) {
        super(compiler, jsonPath, content, info)
    }
    on<Key extends "run" | "done" = "run" | "done">(event: Key, cb: import("./Context").Events[Key]): this {
        throw new Error("Method not implemented.");
    }
    off<Key extends "run" | "done" = "run" | "done">(event: Key, cb: import("./Context").Events[Key]): this {
        throw new Error("Method not implemented.");
    }
    upToDate(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    start(watching: boolean): void {
        throw new Error("Method not implemented.");
    }
    stop(): void {
        throw new Error("Method not implemented.");
    }
    asExternalModule(name: string): Promise<import("./WebpackMultiExternalModule").WebpackMultiExternalModule> {
        throw new Error("Method not implemented.");
    }

}
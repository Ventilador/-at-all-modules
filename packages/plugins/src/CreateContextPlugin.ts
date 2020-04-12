import { WebpackMultiCompiler, } from "@webpack-types/classes";
import { BundleInfoRaw, PackageJSON } from "@webpack-types/package-json";
import { Context } from "@webpack-types/classes";

export class CreateContextInThisProcessPlugin {
    apply(compiler: WebpackMultiCompiler) {
        const { InThisCompilerContext, ContextRegistry } = require.call(null, '@webpack-multi/classes');
        const registry = ContextRegistry.for(compiler);
        compiler.hooks.options.tap('CreateContextInThisProcessPlugin', (options) => {
            compiler.hooks.createContext.tapPromise('CreateContextInThisProcessPlugin', (path) => {
                const content: PackageJSON = require(path); // eslint-disable-line @typescript-eslint/no-var-requires
                const context: Context = new InThisCompilerContext(compiler, '', content, content["bundle-info"] as BundleInfoRaw);
                const info = content['bundle-info'] as BundleInfoRaw;
                // let raw: any;
                // if (info) {
                //     const jsonPath = normalized.jsonPath;
                //     const dirName = dirname(jsonPath);
                //     const name = info.name = content.name;
                //     info.includes = info.includes || [];
                //     if (!info.includes.includes(name)) {
                //         info.includes.push(name);
                //     }
                //     raw = { info, content, dirName, name, jsonPath };
                // } else {

                //     throw new Error(`${`Cannot create Context for ${pathOrCompiler}`.bgRed.cyan}
                //     ${'Seems like the dependency is not included in this project, nor is defined by any other know project'.green}
                //     Extra info:
                //         ${data.join('\r\n			')}`);
                // }

                // const newContext = createProjectContext(raw);
                // contexts.push(newContext);
                return null as any;
            });
        });
    }
}
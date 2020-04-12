import { WebpackMultiCompiler, Context } from '@webpack-types/classes';
import { RequestData } from '@webpack-types/enhanced-resolve';
export class GetContextPlugin {
    apply(compiler: WebpackMultiCompiler) {
        const { ContextRegistry } = require('@webpack-multi/classes');
        const registry = ContextRegistry.for(compiler);
        compiler.hooks.getContext.tapPromise('GetContextPlugin', (request: string | RequestData | Context) => {
            if (isContext(request)) {
                return request;
            }
            if (isRequestData(request)) {
                request = request.request;
            }

            return registry.get(request) || compiler.hooks.createContext.promise(request);
        });;

    }
}
function isRequestData(request: any): request is RequestData {
    return !!request && !!request.context && !!request.request;
}
function isContext(value: any): value is Context {
    return typeof value.addDefines === 'function';
}
import { MultiCompiler } from "./MultiCompiler";
import { isAbsolute, isPackageJsonNameValid, getNameFromJsonlike } from '@webpack-multi/path-utils';
import { Context } from "./Context";
const cache: Context[] = [];
export class ContextRegistry {
    constructor(private _compiler: MultiCompiler) { }
    get(path: string): Context | undefined {
        if (isAbsolute(path)) {
            const index = path.lastIndexOf('node_modules');
            if (index !== -1) {
                path = path.slice(index + 'node_modules'.length + 1);
            } else {
                return cache.find(byFullPath, path);
            }
        }
        if (isPackageJsonNameValid(path)) {
            return cache.find(byName, getNameFromJsonlike(path));
        }
    }
    put(context: Context) {
        cache.push(context);
    }
    attempt(_path: string) {

    }
}

function byFullPath(this: string, context: Context) {
    return context.includesFullPath(this.toString());
}

function byName(this: string, context: Context) {
    return context.includes(this.toString());
}


import { join, dirname, resolve, basename, normalize, isAbsolute } from 'path';
import { RequestData } from '@webpack-types/enhanced-resolve';
const packageJsonNameCheck = /^((?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*)(\/.+|$)/;

export { join, dirname, resolve, basename, normalize, isAbsolute };
export type Normalized = {
    jsonPath?: string;
    name?: string;
    original: string;
}
export function getNameFromJsonlike(path: string) {
    const result = packageJsonNameCheck.exec(path);
    if (result) {
        return result[1];
    }

    throw new Error('Invalid package.json-like name')
}
export function parse(original: string): Normalized {
    if (isAbsolute(original)) {
        original = original.replace(/\\/g, '/');
        if (original.endsWith('package.json')) {
            return {
                jsonPath: original.replace(/\\/g, '/'),
                original,
            };
        }

        if (!original.endsWith('/')) {
            original += '/';
        }

        return {
            jsonPath: original + 'package.json',
            original,
        };
    } else if (isPackageJsonNameValid(original)) {
        return {
            name: original,
            original
        };
    }

    return { original };
}



export function isRelativeRequest(path: string | RequestData) {
    return isRelative(typeof path === 'string' ? path : path.request);
}

export function isRelative(path: string) {
    return /^\.?\//.test(path);
}
// TODO: refactor to loop manually
export function areEqual(a: string, b: string) {
    return normalize(resolve(a)) === normalize(resolve(b));
}
// TODO: refactor to loop manually
export function startsWith(toCheck: string, shouldStartWith: string) {
    return normalize(toCheck).startsWith(normalize(shouldStartWith));
}

export function isPackageJsonNameValid(value: string): boolean {
    return packageJsonNameCheck.test(value);
}
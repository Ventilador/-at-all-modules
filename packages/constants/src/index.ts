import { dirname, join } from 'path';
export const hooksToCopy = [];
export function rootFolder() {
    if (process.env.ROOT_FOLDER) {
        return process.env.ROOT_FOLDER;
    }
    const { existsSync } = require('fs');
    let folder = process.cwd();
    let lastValidPath: string | undefined;
    let attemptedPackageJson: string;
    while (true) {
        attemptedPackageJson = join(folder, 'package.json');
        if (existsSync(attemptedPackageJson)) {
            lastValidPath = attemptedPackageJson;
        }

        const parent = dirname(folder);
        if (parent === folder) {
            if (lastValidPath) {
                return process.env.ROOT_FOLDER = lastValidPath;
            }

            throw new Error('Could not define root folder');
        }
        folder = parent;
    }
}
export function nodeModules() {
    if (process.env.NODE_MODULES_MULTI) {
        return process.env.NODE_MODULES_MULTI;
    }

    return process.env.NODE_MODULES_MULTI = join(rootFolder(), 'node_modules')
}
export const isProd = process.env.NODE_ENV === 'production' || (process.argv.indexOf('-p') !== -1);
export const globalObject = '__context__';
export const defineModuleName = '__define_module__';
export const isMultiple = process.argv.includes('-m') || process.argv.includes('--multi');
export const isWatching = process.argv.includes('-w') || process.argv.includes('--watch');
import { isMultiple, rootFolder } from '@webpack-multi/constants';
import { areEqual } from '@webpack-multi/path-utils';
export function webpackMulti(context: string) {
    const isMulti = isMultiple || areEqual(context, rootFolder());
    if (isMulti) {

    }
}

import { Defines as DefinesInterface } from '@webpack-types/classes';

import { Includes, IncludesFromName } from "./Includes";
import { inherits } from 'util';
import { RequestData } from "@webpack-types/enhanced-resolve";
import { defineGetter, defineProperty } from "@webpack-multi/utils";
import { getNameFromJsonlike } from "@webpack-multi/path-utils";

export class Defines extends Includes implements DefinesInterface {
    readonly root!: string[];
    constructor(id: string, reason: string | Defines, root: string[], tester?: (value: string, context?: RequestData) => any) {
        super(id, reason, tester);
        defineGetter(this, 'root', () => root.slice());
    }
}

export class DefinesName extends Defines {
    readonly root!: string[];
    constructor(name: string, root: string[], addNewIncludes: (defines: Includes) => any) {
        name = getNameFromJsonlike(name);
        super(name, `project defines ${name}`, root);
        defineProperty<any, any>(this, 'addNewIncludes', addNewIncludes);
    }
}

inherits(DefinesName, IncludesFromName);
import { defineProperty } from "@webpack-multi/utils";
import { WithReason, Includes as IncludesInterface } from '@webpack-types/classes';
import { RequestData } from "@webpack-types/enhanced-resolve";
import { getNameFromJsonlike, isRelative } from "@webpack-multi/path-utils";



export class Includes implements  IncludesInterface {
    readonly name!: string;
    readonly reason!: string | WithReason;
    constructor(name: string, reason: string | WithReason, tester?: (value: string, context?: RequestData) => boolean) {
        tester && defineProperty(this, 'test', tester);
        defineProperty(this, 'name', name);
        defineProperty(this, 'reason', reason);
    }

    test(_value: string, _context?: RequestData) {
        return false;
    }
}

export class IncludeRelatives extends Includes {
    constructor(projectName: string) {
        super(projectName + '-relative', 'is relative to ' + projectName);
    }

    test(_value: string, _context?: RequestData) {
        return isRelative(_value);
    }
}

export class IncludesFromName extends Includes {
    private addNewIncludes!: (value: Includes) => any
    constructor(name: string, addNewIncludes: (value: Includes) => any, reason?: Includes) {
        name = getNameFromJsonlike(name);
        super(name, reason || `project includes ${name}`);
        defineProperty<any, any>(this, 'addNewIncludes', addNewIncludes);
    }

    test(name: string, request?: RequestData) {
        if (this.name === name) {
            return true;
        }

        if (name.startsWith(this.name + '/')) {
            return true;
        }

        if (request) {
            if (request.context.includes(this.name)) {
                this.addNewIncludes(new IncludesFromName(request.request, this.addNewIncludes, this));
                return true;
            }
        }
        return false;
    }
}
declare module '@webpack-types/enhanced-resolve' {
    interface RequestData {
        contextInfo: ContextInfo;
        resolveOptions: any;
        context: string;
        request: string;
        dependencies: Dependency[];
    }

    interface ContextInfo {
        issuer: null;
        projectResolver: boolean;
        factoryResolver: boolean;
        compiler: string;
    }

    interface Dependency {
        module: null;
        weak: boolean;
        optional: boolean;
        loc: LOC;
        request: string;
        userRequest: string;
    }

    interface LOC {
        name: string;
        index: number;
    }
}
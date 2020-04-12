import { BundleInfoRaw } from "@webpack-types/package-json";

export class BundleInfo {
    static from(info: BundleInfoRaw) {
        return new BundleInfo(info);
    }
    constructor({ }: BundleInfoRaw) {

    }
}

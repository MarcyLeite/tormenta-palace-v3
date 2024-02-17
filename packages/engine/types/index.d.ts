/// <reference types="bun-types" />
import type { PlsInterface } from './src/engine/entity-handler';
export type EntityInterface = PlsInterface;
export type PalaceInterface = {
    entity: EntityInterface;
};
declare const _default: {
    builder: {
        createSheet: (plsScriptList: string[], answers?: Dict<any>) => {
            sheet: import("./src/builder/builder.types").SheetObject;
            form: Dict<import("./src/builder/builder.types").FormElement>;
        };
    };
};
export default _default;

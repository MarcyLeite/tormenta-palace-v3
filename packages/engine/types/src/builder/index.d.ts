/// <reference types="bun-types" />
import type { SheetObject, FormElement } from './builder.types';
declare const _default: {
    createSheet: (plsScriptList: string[], answers?: Dict<any>) => {
        sheet: SheetObject;
        form: Dict<FormElement>;
    };
};
export default _default;

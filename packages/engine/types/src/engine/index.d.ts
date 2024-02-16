export * from './entity-handler';
import type { PlsScript } from '@/global.types';
export declare const createEngine: (plsScriptList: PlsScript[]) => {
    getEntities: () => import("@/global.types").DefinedDict<import("./entity-handler.types").Entity>;
    run: (plsCode: string) => void;
};
export type Engine = ReturnType<typeof createEngine>;

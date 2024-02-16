import type { DefinedDict } from '@/global.types';
import type { EntityMeta, Entity } from './entity-handler.types';
export * from './entity-handler.types';
export declare const createEntityHandler: () => {
    plsInterface: {
        register: (id: string, entity: any) => void;
        getAll: () => DefinedDict<EntityMeta>;
    };
    getEntities: () => DefinedDict<Entity>;
};
export type EntityHandler = ReturnType<typeof createEntityHandler>;
export type PlsInterface = EntityHandler['plsInterface'];

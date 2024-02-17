import type { PlsInterface } from '@/engine/entity-handler'

export type EntityInterface = PlsInterface
export type PalaceInterface = {
	entity: EntityInterface
}

import builder from '@/builder'

export default {
	builder,
}

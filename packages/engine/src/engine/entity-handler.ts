import { DefinedDict } from '@/global.types'
import { EntityMeta, Entity } from './entity-handler.types'
export * from './entity-handler.types'

export const createEntityHandler = () => {
	const entityDict: DefinedDict<Entity> = {}

	const register = (id: string, entity: any) => {
		const meta = {
			title: entity.title,
			description: entity.description,
			pools: entity.pools ?? [],
		}

		entityDict[id] = {
			meta,
			builderBehavior: entity.builderBehavior,
			composePhase: entity.composePhase ? entity.composePhase : false,
		}
	}

	const entityReduceFilter = (
		reduceEntityDict: DefinedDict<EntityMeta>,
		[key, entity]: [string, Entity]
	) => {
		reduceEntityDict[key] = entity.meta
		return reduceEntityDict
	}

	const getReducedEntities = () => {
		const entityEntries = Object.entries(entityDict)
		const reducedEntityDict = entityEntries.reduce(entityReduceFilter, {})
		return reducedEntityDict
	}

	const getEntities = () => {
		return entityDict
	}

	const plsInterface = {
		register,
		getAll: getReducedEntities,
	}

	return {
		plsInterface,
		getEntities,
	}
}

export type EntityHandler = ReturnType<typeof createEntityHandler>
export type PlsInterface = EntityHandler['plsInterface']

import plsParser from 'pls-parser'
import { PalacePlsInterface, EntityMeta, EntitySheetBehavior } from './engine.types'

export const createEngine = () => {
	const engine = plsParser.engineFactory()

	const entityDict: Dict<any> = {}
	const reduceEntityDict = (result: any, [key, value]: [string, any]) => {
		result[key] = Object.assign({}, value.meta)
		return result
	}

	const registerEntity = (id: string, meta: EntityMeta, sheetBehavior?: EntitySheetBehavior) => {
		const entity: any = {}
		entity.meta = Object.assign({}, meta)
		entity.applyOnSheet = (sheet: any) => {}

		entityDict[id] = entity
	}

	const getAllEntity = () => {
		return Object.entries(entityDict).reduce(reduceEntityDict, {})
	}

	const plsInterface: PalacePlsInterface = {
		entity: {
			register: registerEntity,
			getAll: getAllEntity,
		},
		composer: {
			register: (composerFunction) => {},
		},
	}

	engine.setGlobal('palace', plsInterface)

	return {
		getEntities: () => {
			return entityDict
		},
		run: engine.run,
	}
}

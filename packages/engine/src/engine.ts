import plsParser from 'pls-parser'
import { PalacePlsInterface, RegistryMeta, RegistrySheetBehavior } from './engine.types'

export const createEngine = () => {
	const engine = plsParser.engineFactory()

	const registryDict: Dict<any> = {}
	const reduceRegistryDict = (result: any, [key, value]: [string, any]) => {
		result[key] = Object.assign({}, value.meta)
		return result
	}

	const registerRegistry = (
		id: string,
		meta: RegistryMeta,
		sheetBehavior?: RegistrySheetBehavior
	) => {
		const registry: any = {}
		registry.meta = Object.assign({}, meta)
		registry.applyOnSheet = (sheet: any) => {}

		registryDict[id] = registry
	}

	const getAllRegistry = () => {
		return Object.entries(registryDict).reduce(reduceRegistryDict, {})
	}

	const plsInterface: PalacePlsInterface = {
		registry: {
			register: registerRegistry,
			getAll: getAllRegistry,
		},
		composer: {
			register: (composerFunction) => {},
		},
	}

	engine.setGlobal('palace', plsInterface)

	return {
		getRegistries: () => {
			return registryDict
		},
		run: engine.run,
	}
}

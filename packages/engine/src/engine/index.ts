import plsParser from 'pls-parser'
import { createEntityHandler } from './entity-handler'
export * from './entity-handler'
import { PlsScript } from '@/global.types'

export const createEngine = (plsScriptList: PlsScript[]) => {
	const parser = plsParser.parserFactory()
	const entityHandler = createEntityHandler()

	const plsInterface = {
		entity: entityHandler.plsInterface,
	}

	parser.setGlobal('palace', plsInterface)
	parser.setGlobal('Object', Object)
	parser.setGlobal('console', console)

	for (const plsScript of plsScriptList) {
		parser.run(plsScript)
	}

	return {
		getEntities: entityHandler.getEntities,
		run: parser.run,
	}
}

export type Engine = ReturnType<typeof createEngine>

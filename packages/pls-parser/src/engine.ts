import { executePlsCode } from './evaluator'

export interface PlsEngine {
	setGlobal: (key: string, value: any) => void
	run: (plsCode: string) => void
}

export const engineFactory = () => {
	const globalScope: any = {}

	const engineInterface: PlsEngine = {
		setGlobal: (key: string, value: any) => {
			globalScope[key] = value
		},
		run: (plsCode: string) => {
			executePlsCode(plsCode, globalScope)
		},
	}
	return engineInterface
}

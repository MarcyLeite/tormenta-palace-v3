import { executePlsCode } from './evaluator'

export const engineFactory = () => {
	const globalScope: any = {}

	return {
		setGlobal: (key: string, value: any) => {
			globalScope[key] = value
		},
		run: (plsCode: string) => {
			executePlsCode(plsCode, globalScope)
		},
	}
}

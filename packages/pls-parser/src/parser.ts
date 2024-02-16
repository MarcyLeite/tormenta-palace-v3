import { executePlsCode } from '@/evaluator'

export interface PlsParser {
	setGlobal: (key: string, value: any) => void
	run: (plsCode: string) => void
}

export const parserFactory = () => {
	const globalScope: any = {}

	const parserInterface: PlsParser = {
		setGlobal: (key: string, value: any) => {
			globalScope[key] = value
		},
		run: (plsCode: string) => {
			executePlsCode(plsCode, globalScope)
		},
	}
	return parserInterface
}

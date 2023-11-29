import { Program } from 'estree'
import { palParser } from '@/pal-parser'
import { statementHandler, ParserMeta } from '@/handler'
import { Statement } from 'estree'
export const extractModel = (palCode: string) => {
	const program = palParser.parse(palCode, {
		ecmaVersion: 2023,
		sourceType: 'module',
	}) as unknown as Program

	const scope: any = {}
	const models: any = {}
	const meta: ParserMeta = {
		onFunction: false,
		onLoop: false,
		onSwitch: false,

		doReturn: false,
		doBreak: false,
		doContinue: false,
	}

	const modelNodeList: any[] = []
	for (const node of program.body) {
		Object.assign(scope, statementHandler(node as Statement, scope, meta))
	}

	return { scope, models }
}

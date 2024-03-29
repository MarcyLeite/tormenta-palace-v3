import { Parser } from 'acorn'
import type { Program, Statement } from 'estree'
import { statementHandler, type ParserMeta } from '@/handler'

export const executePlsCode = (palCode: string, scope: any = {}) => {
	const program = Parser.parse(palCode, {
		ecmaVersion: 2023,
		sourceType: 'module',
	}) as Program

	const meta: ParserMeta = {
		onFunction: false,
		onLoop: false,
		onSwitch: false,

		doReturn: false,
		doBreak: false,
		doContinue: false,
	}

	for (const node of program.body) {
		Object.assign(scope, statementHandler(node as Statement, scope, meta))
	}

	return scope
}

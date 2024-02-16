import type {
	Statement,
	ExpressionStatement,
	BlockStatement,
	ReturnStatement,
	BreakStatement,
	ContinueStatement,
	IfStatement,
	WhileStatement,
	ForStatement,
	ForInStatement,
	VariableDeclaration,
	Expression,
	ThisExpression,
	ArrayExpression,
	ObjectExpression,
	Property,
	UnaryExpression,
	UpdateExpression,
	BinaryExpression,
	AssignmentExpression,
	LogicalExpression,
	MemberExpression,
	ConditionalExpression,
	CallExpression,
	SequenceExpression,
	ForOfStatement,
	StaticBlock,
	ArrowFunctionExpression,
	Identifier,
	Literal,
	Pattern,
	ObjectPattern,
	ArrayPattern,
	RestElement,
	AssignmentPattern,
	VariableDeclarator,
	SpreadElement,
} from 'estree'

export type Scope = any
type Handler<T, R> = (node: T, scope: Scope, ...args: any[]) => R
export interface ParserMeta {
	onFunction: boolean
	onLoop: boolean
	onSwitch: boolean

	doReturn: boolean
	doBreak: boolean
	doContinue: boolean

	returnValue?: any
}

const cloneIfObject = (cloneObj: any, key: string, value: any) => {
	if (typeof value == 'object') {
		if (Array.isArray(value)) {
			cloneObj[key] = [...value]
			return true
		}

		cloneObj[key] = clone(value)
		return true
	}
	return false
}

const clone = (obj: any) => {
	const cloneObj: any = {}
	for (const [key, value] of Object.entries(obj)) {
		if (cloneIfObject(cloneObj, key, value)) continue
		cloneObj[key] = value
	}
	return cloneObj
}

const updateOriginal = (original: any, clone: any) => {
	for (const key of Object.keys(original)) {
		original[key] = clone[key]
	}
}

const updateParentMeta = (parentMeta: ParserMeta, childMeta: ParserMeta) => {
	parentMeta.doReturn = childMeta.doReturn
	parentMeta.doBreak = childMeta.doBreak
	parentMeta.doContinue = childMeta.doContinue
	parentMeta.returnValue = childMeta.returnValue
}

export const statementHandler: Handler<Statement, Scope> = (node, scope, meta: ParserMeta) => {
	// NOT HANDLING EXCEPTIONS
	const localMeta = clone(meta)
	expressionStatementHandler(node as ExpressionStatement, scope)
	blockStatementHandler(node as BlockStatement, scope, localMeta)
	staticBlockHandler(node as StaticBlock, scope, localMeta)
	// emptyStatementHandler(node as EmptyStatement, localScope)
	// debuggerStatementHandler(node as DebuggerStatement, localScope)
	// withStatementHandler(node as WithStatement, localScope)
	returnStatementHandler(node as ReturnStatement, scope, localMeta)
	// labeledStatementHandler(node as LabeledStatement, localScope, localMeta)
	breakStatementHandler(node as BreakStatement, scope, localMeta)
	continueStatementHandler(node as ContinueStatement, scope, localMeta)

	ifStatementHandler(node as IfStatement, scope, localMeta)
	// switchStatementHandler(node as SwitchStatement, localScope)
	whileStatementHandler(node as WhileStatement, scope, localMeta)
	// doWhileStatementHandler(node as DoWhileStatement, localScope)
	forStatementHandler(node as ForStatement, scope, localMeta)
	forInStatementHandler(node as ForInStatement, scope, localMeta)
	forOfStatementHandler(node as ForOfStatement, scope, localMeta)
	variableDeclarationHandler(node as VariableDeclaration, scope, localMeta)

	updateParentMeta(meta, localMeta)
}
const variableDeclarationHandler: Handler<VariableDeclaration, undefined> = (node, scope) => {
	if (node.type !== 'VariableDeclaration') return
	for (const declaration of node.declarations) {
		variableDeclaratorHandler(declaration, scope)
	}
}
const variableDeclaratorHandler: Handler<VariableDeclarator, undefined> = (node, scope) => {
	if (node.type !== 'VariableDeclarator') return
	let value
	if (node.init === null) value = null
	else if (node.init === undefined) value = undefined
	else value = expressionHandler(node.init as Expression, scope)

	patternHandler(node.id, scope, value)
}
const expressionStatementHandler: Handler<ExpressionStatement, unknown> = (node, scope) => {
	if (node.type !== 'ExpressionStatement') return

	const expression = node.expression
	expressionHandler(expression, scope)
}

// Expression
export const expressionHandler: Handler<Expression, unknown> = (node, scope) => {
	// NOT HANDLING ASYNCHRONOUS
	// NOT HANDLING IMPORTS
	// SKIPPING CHAIN EXPRESSION
	// SKIPPING CLASS EXPRESSION
	// SKIPPING META PROPERTY EXPRESSION
	// SKIPPING NEW EXPRESSION
	// SKIPPING TAGGED TEMPLATE EXPRESSION
	// SKIPPING TEMPLATE LITEARAL
	// SKIPPING YIELD EXPRESSION

	if (node.type === 'ArrayExpression')
		return arrayExpressionHandler(node as ArrayExpression, scope)
	if (node.type === 'ArrowFunctionExpression') {
		return arrowFunctionExpressionHandler(node as ArrowFunctionExpression, scope)
	}
	assignmentExpressionHandler(node as AssignmentExpression, scope)
	if (node.type === 'BinaryExpression') {
		return binaryExpressionHandler(node as BinaryExpression, scope)
	}
	if (node.type === 'CallExpression') {
		return callExpressionHandler(node as CallExpression, scope)
	}
	if (node.type === 'ConditionalExpression') {
		return conditionalExpressionHandler(node as ConditionalExpression, scope)
	}
	// functionExpressionHandler(node as FunctionExpression, scope)
	if (node.type === 'Identifier') {
		return identifierHandler(node as Identifier, scope)
	}
	if (node.type === 'Literal') return literalHandler(node as Literal, scope)
	if (node.type === 'LogicalExpression') {
		return logicalExpressionHandler(node as LogicalExpression, scope)
	}
	if (node.type === 'MemberExpression') {
		return memberExpressionHandler(node as MemberExpression, scope)
	}
	if (node.type === 'ObjectExpression')
		return objectExpressionHandler(node as ObjectExpression, scope)
	if (node.type === 'SequenceExpression') {
		return sequenceExpressionHandler(node as SequenceExpression, scope)
	}
	thisExpressionHandler(node as ThisExpression, scope)
	if (node.type === 'UnaryExpression') {
		return unaryExpressionHandler(node, scope)
	}
	if (node.type === 'UpdateExpression') {
		const value = updateExpressionHandler(node as UpdateExpression, scope)
		return value
	}
}

const arrayExpressionHandler: Handler<ArrayExpression, unknown> = (node, scope) => {
	const arr = []
	const elementList = node.elements
	for (const element of elementList) {
		const value = expressionHandler(element as Expression, scope)
		arr.push(value)
	}
	return arr
}

const arrowFunctionExpressionHandler: Handler<ArrowFunctionExpression, unknown> = (node, scope) => {
	const body = node.body

	return (...args: any) => {
		const meta: ParserMeta = {
			onFunction: true,
			onLoop: false,
			onSwitch: false,

			doReturn: false,
			doBreak: false,
			doContinue: false,
		}

		const localScope = clone(scope)

		let argIndex = 0
		for (const paramNode of node.params) {
			patternHandler(paramNode, localScope, args[argIndex])
			argIndex++
		}

		if (body.type === 'BlockStatement') statementHandler(body, localScope, meta)
		else expressionHandler(body, localScope)

		updateOriginal(scope, localScope)

		return meta.returnValue
	}

	// const paramHandler = (scopeSnapshot: Scope, argumentList: ArrowFunctionArgument[]) => {
	// 	for (const iStr in node.params) {
	// 		const i = Number(iStr)
	// 		const param = node.params[i]
	// 		const argument = argumentList[i]

	// 		let value: any
	// 		if (!argument) value = undefined
	// 		else if (argument.type === 'SpreadElement') continue
	// 		else value = expressionHandler(argument, scopeSnapshot)

	// 		patternHandler(param, scopeSnapshot, value)
	// 	}
	// }

	// return (scopeSnapshot: Scope) => {
	// 	const meta: ParserMeta = {
	// 		onFunction: true,
	// 		onLoop: false,
	// 		onSwitch: false,

	// 		doReturn: false,
	// 		doBreak: false,
	// 		doContinue: false,
	// 	}

	// 	const getLocals = (argumentList: ArrowFunctionArgument[]) => {
	// 		Object.assign(scopeSnapshot, scope)

	// 		const { scope: localScope, meta: localMeta } = createChildParserData(
	// 			scopeSnapshot,
	// 			meta
	// 		)
	// 		paramHandler(localScope, argumentList)
	// 		return { localScope, localMeta }
	// 	}

	// 	const exec = (localScope: Scope, localMeta: ParserMeta) => {
	// 		if (body.type === 'BlockStatement') blockStatementHandler(body, localScope, localMeta)
	// 		else expressionHandler(body, localScope)

	// 		updateParentData({ scope: scopeSnapshot, meta }, { scope: localScope, meta: localMeta })
	// 		return meta.returnValue
	// 	}

	// 	return {
	// 		getLocals,
	// 		exec,
	// 	}
	// }
}

const assignmentExpressionHandler: Handler<AssignmentExpression, unknown> = (node, scope) => {
	if (node.type !== 'AssignmentExpression') return
	const left = node.left

	const right = node.right
	let value = expressionHandler(left as Expression, scope) as any
	const newValue = expressionHandler(right, scope) as any

	if (node.operator === '%=') value %= newValue
	else if (node.operator === '&&=') value &&= newValue
	else if (node.operator === '&=') value &= newValue
	else if (node.operator === '**=') value **= newValue
	else if (node.operator === '*=') value *= newValue
	else if (node.operator === '+=') value += newValue
	else if (node.operator === '-=') value -= newValue
	else if (node.operator === '/=') value /= newValue
	else if (node.operator === '<<=') value <<= newValue
	else if (node.operator === '=') value = newValue
	else if (node.operator === '>>=') value >>= newValue
	else if (node.operator === '>>>=') value >>>= newValue
	else if (node.operator === '??=') value ??= newValue
	else if (node.operator === '^=') value ^= newValue
	else if (node.operator === '|=') value |= newValue
	else if (node.operator === '||=') value ||= newValue

	patternHandler(left, scope, value)
}
const binaryExpressionHandler: Handler<BinaryExpression, unknown> = (node, scope) => {
	const left: any = expressionHandler(node.left, scope)
	const right: any = expressionHandler(node.right, scope)
	const operator = node.operator
	if (operator == '!=') return left != right
	if (operator == '!==') return left !== right
	if (operator == '%') return left % right
	if (operator == '&') return left & right
	if (operator == '*') return left * right
	if (operator == '**') return left ** right
	if (operator == '+') return left + right
	if (operator == '-') return left - right
	if (operator == '/') return left / right
	if (operator == '<') return left < right
	if (operator == '<<') return left << right
	if (operator == '<=') return left <= right
	if (operator == '==') return left == right
	if (operator == '===') return left === right
	if (operator == '>') return left > right
	if (operator == '>=') return left >= right
	if (operator == '>>') return left >> right
	if (operator == '>>>') return left >>> right
	if (operator == '^') return left ^ right
	if (operator == 'in') return left in right
	// if (operator == 'instanceof') return left instanceof right
	if (operator == '|') return left | right
}

const callExpressionHandler: Handler<CallExpression, unknown> = (node, scope) => {
	const argumentValueList = []
	for (const argument of node.arguments) {
		argumentValueList.push(expressionHandler(argument as Expression, scope))
	}

	const callee = expressionHandler(node.callee as Expression, scope) as Function

	const result = callee(...argumentValueList)

	return result

	// const calleeFactory = expressionHandler(
	// 	node.callee as Expression,
	// 	scope
	// ) as PalaceArrowFunctionFactory
	// const callee = calleeFactory(scope)
	// const { localScope, localMeta } = callee.getLocals(node.arguments)
	// return callee.exec(localScope, localMeta)
}
const conditionalExpressionHandler: Handler<ConditionalExpression, unknown> = (node, scope) => {
	const test = expressionHandler(node.test, scope)
	const consequent = expressionHandler(node.consequent, scope)
	const alternate = expressionHandler(node.alternate, scope)
	return test ? consequent : alternate
}
// const functionExpressionHandler: Handler<FunctionExpression, unknown> = (node, scope) => {} // -----
const identifierHandler: Handler<Identifier, string> = (node, scope): string => {
	return scope[node.name]
}
const literalHandler: Handler<Literal, unknown> = (node, scope) => {
	return node.value
}
const logicalExpressionHandler: Handler<LogicalExpression, unknown> = (node, scope) => {
	const left = expressionHandler(node.left, scope)
	if (node.operator === '&&' && !left) return false
	const right = expressionHandler(node.right, scope)
	if (node.operator === '&&') return left && right
	if (node.operator === '||') return left || right
	if (node.operator === '??') return left ?? right
}
const memberExpressionHandler: Handler<MemberExpression, any> = (node, scope) => {
	const object: any = expressionHandler(node.object as Expression, scope)
	let value

	if (node.computed) {
		const key = expressionHandler(node.property as Expression, scope) as string
		value = object[key]
	} else {
		value = expressionHandler(node.property as Expression, object)
	}

	if (typeof value == 'function') {
		value = value.bind(object)
	}

	return value
}

const objectExpressionHandler: Handler<ObjectExpression, unknown> = (node, scope) => {
	const obj: any = {}
	const propertyList = node.properties as Property[]
	for (const property of propertyList) {
		const key = property.key as Identifier

		const value = property.value as Expression
		obj[key.name] = expressionHandler(value, scope)
	}
	return obj
}
const blockStatementHandler: Handler<BlockStatement, unknown> = (node, scope, meta: ParserMeta) => {
	if (node.type !== 'BlockStatement') return

	const localScope = clone(scope)

	for (const blockNode of node.body) {
		Object.assign(localScope, statementHandler(blockNode, localScope, meta))
		if (meta.doBreak || meta.doContinue || meta.doReturn) break
	}

	updateOriginal(scope, localScope)
}
const sequenceExpressionHandler: Handler<SequenceExpression, unknown> = (node, scope) => {
	let lastResult: unknown
	for (const expression of node.expressions) {
		lastResult = expressionHandler(expression, scope)
	}
	return lastResult
}
const thisExpressionHandler: Handler<ThisExpression, unknown> = (node, scope) => {} // -----
const staticBlockHandler: Handler<StaticBlock, unknown> = (node, scope) => {} // ------

// const emptyStatementHandler: Handler<EmptyStatement, unknown> = (node, scope) => {} // -----
// const debuggerStatementHandler: Handler<DebuggerStatement, unknown> = (node, scope) => {} // -----
// const withStatementHandler: Handler<WithStatement, unknown> = (node, scope) => {} // -----
const returnStatementHandler: Handler<ReturnStatement, unknown> = (
	node,
	scope,
	meta: ParserMeta
) => {
	if (node.type !== 'ReturnStatement') return
	if (!meta.onFunction) throw new Error('RETURN ERROR')
	const argument = node.argument
	if (argument === null) meta.returnValue = null
	else if (argument === undefined) meta.returnValue = undefined
	else meta.returnValue = expressionHandler(argument, scope)
	meta.doReturn = true
}
// const labeledStatementHandler: Handler<LabeledStatement, unknown> = (node, scope) => {} // -----
const breakStatementHandler: Handler<BreakStatement, unknown> = (node, scope, meta: ParserMeta) => {
	if (node.type !== 'BreakStatement') return
	if (!meta.onLoop) throw new Error('BREAK ERROR')
	meta.doBreak = true
}
const continueStatementHandler: Handler<ContinueStatement, unknown> = (
	node,
	scope,
	meta: ParserMeta
) => {
	if (node.type !== 'ContinueStatement') return
	if (!meta.onLoop) throw new Error('CONTINUE ERROR')
	meta.doContinue = true
}
// const directiveHandler: Handler<Directive, unknown> = (node, scope) => {} // ------
const ifStatementHandler: Handler<IfStatement, unknown> = (node, scope, meta) => {
	if (node.type !== 'IfStatement') return

	const test = expressionHandler(node.test, scope)
	if (test) statementHandler(node.consequent, scope, meta)
	else if (node.alternate) statementHandler(node.alternate, scope, meta)
}
// const switchStatementHandler: Handler<SwitchStatement, unknown> = (
// 	node,
// 	scope,
// 	meta: ParserMeta
// ) => {} // -----
const whileStatementHandler: Handler<WhileStatement, unknown> = (node, scope, meta) => {
	if (node.type !== 'WhileStatement') return
	let test = expressionHandler(node.test, scope) as boolean

	while (test) {
		test = expressionHandler(node.test, scope) as boolean
		statementHandler(node.body, scope, meta)
	}
}
// const doWhileStatementHandler: Handler<DoWhileStatement, unknown> = (node, scope) => {} // -----
const forStatementHandler: Handler<ForStatement, unknown> = (node, scope, meta: ParserMeta) => {
	if (node.type !== 'ForStatement') return
	const localMeta = clone(meta)
	const localScope = clone(scope)

	localMeta.onLoop = true

	const init = node.init
	if (init?.type === 'VariableDeclaration') variableDeclarationHandler(init, localScope)
	else if (init !== undefined && init !== null) expressionHandler(init, localScope)

	const test = node.test
	const getContinue = () => {
		if (test !== undefined && test !== null)
			return expressionHandler(test, localScope) as boolean
	}

	const update = node.update
	let forContinue = getContinue()

	const body = node.body
	while (forContinue) {
		statementHandler(body, localScope, localMeta)
		if (localMeta.doBreak) break
		if (update !== undefined && update !== null) expressionHandler(update, localScope)
		forContinue = getContinue()
		localMeta.doContinue = false
	}

	updateParentMeta(meta, localMeta)
	updateOriginal(scope, localScope)
}

const forInStatementHandler: Handler<ForInStatement, unknown> = (node, scope, meta) => {
	if (node.type !== 'ForInStatement') return
	const right = expressionHandler(node.right, scope) as any

	for (const value in right) {
		const left = node.left
		if (left.type === 'VariableDeclaration') {
			left.declarations[0].init = {
				type: 'Literal',
				value,
			}
			variableDeclarationHandler(left, scope)
		} else patternHandler(left, scope, value)

		statementHandler(node.body, scope, meta)
	}
}
const forOfStatementHandler: Handler<ForOfStatement, unknown> = (node, scope, meta) => {
	if (node.type !== 'ForOfStatement') return
	const right = expressionHandler(node.right, scope) as any

	for (const value of right) {
		const left = node.left
		if (left.type === 'VariableDeclaration') {
			left.declarations[0].init = {
				type: 'Literal',
				value,
			}
			variableDeclarationHandler(left, scope)
		} else patternHandler(left, scope, value)

		statementHandler(node.body, scope, meta)
	}
}

// Expression Unary Operations
const unaryExpressionHandler: Handler<UnaryExpression, unknown> = (node, scope) => {
	const argument = node.argument
	const value: any = expressionHandler(argument, scope)
	if (node.operator === '!') return !value
	if (node.operator === '+') return +value
	if (node.operator === '-') return -value
	if (node.operator === 'delete') {
		delete scope[value]
		return
	}
	if (node.operator === '~') return ~value
}
const updateExpressionHandler: Handler<UpdateExpression, unknown> = (node, scope) => {
	const argument = node.argument as Identifier | MemberExpression
	let value = expressionHandler(argument, scope) as number
	const oldValue = value
	if (node.operator === '++') value++
	else if (node.operator === '--') value--

	patternHandler(argument, scope, value)

	return oldValue
}

// Expression Binary Operations
const patternHandler: Handler<Pattern, undefined> = (node, scope, value) => {
	if (node.type === 'Identifier') {
		const key = node.name
		scope[key] = value
	}
	if (node.type === 'MemberExpression') {
		const object: any = expressionHandler(node.object as Expression, scope)
		let property = node.property

		if (node.computed) {
			const keyValue = expressionHandler(property as Expression, scope) as string
			object[keyValue] = value
			return
		}

		if (property.type === 'Identifier') {
			patternHandler(property as Pattern, object, value)
			return
		}

		const propertyValue: any = expressionHandler(property as Expression, scope)
		object[propertyValue] = value
	}
	if (node.type === 'ObjectPattern') objectPatternHandler(node as ObjectPattern, scope, value)
	if (node.type === 'ArrayPattern') arrayPatternHandler(node as ArrayPattern, scope, value)
	if (node.type === 'RestElement') restElementHandler(node as RestElement, scope)
	if (node.type === 'AssignmentPattern')
		assignmentPatternHandler(node as AssignmentPattern, scope)
}

const objectPatternHandler: Handler<ObjectPattern, undefined> = (node, scope, value) => {
	const propertyList = node.properties as Property[]
	for (const property of propertyList) {
		const valueKey = property.key as Identifier
		const key = property.value as Identifier
		scope[key.name] = value[valueKey.name]
	}
}
const arrayPatternHandler: Handler<ArrayPattern, undefined> = (node, scope, value) => {
	const elementList = node.elements
	for (const i in elementList) {
		const left = elementList[i]
		const rValue = value[i]

		patternHandler(left as Pattern, scope, rValue)
	}
}
const restElementHandler: Handler<RestElement, string> = (node, scope) => {
	return ''
}
const assignmentPatternHandler: Handler<AssignmentPattern, string> = (node, scope) => {
	return ''
}

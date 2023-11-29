import { extractModel } from '@/evaluator'
import { describe, expect, test } from 'bun:test'

const loopStatementTest = () => {
	test('should sum correctly using empty statement in for', () => {
		const jsString = `
const value = 0
for (let i = 1; i <= 4; value += i++);`
		const { scope } = extractModel(jsString)
		expect(scope.value).toBe(10)
		expect(scope.i).toBeUndefined()
	})
	test('should sum correctly using empty statement in for', () => {
		const jsString = `
const value = 0
for (let i = 1; i <= 4; value += i++) {
	value += i
}`
		const { scope } = extractModel(jsString)
		expect(scope.value).toBe(20)
		expect(scope.i).toBeUndefined()
	})
	test('should loop using while statement', () => {
		const jsString = `
let doContinue = true
let i = 2
while (doContinue) {
	if (i === 30) {
		let surPlus = 4
		doContinue = false
		i += surPlus
	}
	i++
}`
		const { scope } = extractModel(jsString)
		expect(scope.doContinue).toBe(false)
		expect(scope.i).toBe(36)
		expect(scope.surPlus).toBeUndefined()
	})
	test('should loop using for in statement in object', () => {
		const jsString = `
const obj = { a: '1', b: '2', c: '3' }
const value = 'z'
for (const key in obj) {
	value += key
}`
		const { scope } = extractModel(jsString)
		expect(scope.value).toBe('zabc')
	})
	test('should loop using for in statement in list', () => {
		const jsString = `
const arr = ['1', '2', '3' ]
const value = '0'
for (const key in arr) {
	value += key
}`
		const { scope } = extractModel(jsString)
		expect(scope.value).toBe('0012')
	})
	test('should loop using for of statement', () => {
		const jsString = `
const arr = ['x', 'y', 'z']
const value = 'a'
for (const arrValue of arr) {
	value += arrValue
}`
		const { scope } = extractModel(jsString)
		expect(scope.value).toBe('axyz')
	})

	test('should break in for statement', () => {
		const jsString = `
let value = 0
for (let i = 0; i < 10; i++) {
	if (i === 6) break
	value++
}`
		const { scope } = extractModel(jsString)
		expect(scope.value).toBe(6)
	})
	test('should break in for statement', () => {
		const jsString = `
let value = 0
for (let i = 0; i < 10; i++) {
	if (i === 6) continue
	value++
}`
		const { scope } = extractModel(jsString)
		expect(scope.value).toBe(9)
	})
}

const logicalExpressionTest = () => {
	test('should return right using && expression', () => {
		const jsString = `
const value1 = true && true
const value2 = true && false
const value3 = false && true
const value4 = false && false`
		const { scope } = extractModel(jsString)
		expect(scope.value1).toBe(true)
		expect(scope.value2).toBe(false)
		expect(scope.value3).toBe(false)
		expect(scope.value4).toBe(false)
	})
	test('should return right using || expression', () => {
		const jsString = `
const value1 = true || true
const value2 = true || false
const value3 = false || true
const value4 = false || false`
		const { scope } = extractModel(jsString)
		expect(scope.value1).toBe(true)
		expect(scope.value2).toBe(true)
		expect(scope.value3).toBe(true)
		expect(scope.value4).toBe(false)
	})
}
const conditionalExpressionTest = () => {
	test('should get true side of conditional expression', () => {
		const jsString = `
let foo = true
const value = foo ? 1 : 2`
		const { scope } = extractModel(jsString)
		expect(scope.value).toBe(1)
	})
	test('should get false side of conditional expression', () => {
		const jsString = `
let foo = false
const value = foo ? 1 : 2`
		const { scope } = extractModel(jsString)
		expect(scope.value).toBe(2)
	})
}

const ifStatementTest = () => {
	test('should update value in if statement true', () => {
		const jsString = `
let value = 'foo'
if (true) value = 'bar'`
		const { scope } = extractModel(jsString)
		expect(scope.value).toBe('bar')
	})
	test('should not update value in else statement if false', () => {
		const jsString = `
let value = 'foo'
if (false) value = 'bar'
else value = 'baz'`
		const { scope } = extractModel(jsString)
		expect(scope.value).toBe('baz')
	})
}

const blockStatementTest = () => {
	test('should execute code in if block', () => {
		const jsString = `
let value = 2
if (true) {
	value += 3
	value += 4
}`
		const { scope } = extractModel(jsString)
		expect(scope.value).toBe(9)
	})
	test('should not pass local scope variable to global scope', () => {
		const jsString = `
let value = 2
if (true) {
	let foo = 5
	value += 3
	value += 4
	value = foo + 1
}`
		const { scope } = extractModel(jsString)
		expect(scope.value).toBe(6)
		expect(scope.foo).toBeUndefined()
	})
}

const arrowFunctionExpressionTest = () => {
	test('should create and execute function', () => {
		const jsString = `
let value = 2
const updateValue = () => {
	let plus = 3
	value += plus
}
updateValue()
`
		const { scope } = extractModel(jsString)
		expect(scope.updateValue).toBeFunction()
		expect(scope.plus).toBeUndefined()
		expect(scope.value).toBe(5)
	})
	test('should execute function with arguments', () => {
		const jsString = `
let value = 2
const updateValue = (plus) => {
	value += plus
}
updateValue(5)
`
		const { scope } = extractModel(jsString)
		expect(scope.plus).toBeUndefined()
		expect(scope.value).toBe(7)
	})
	test('should create and execute function in object', () => {
		const jsString = `
let value = 'foo'

const obj = {
	updateValue: () => {
		value = 'bar'
	}
}

obj.updateValue()`
		const { scope } = extractModel(jsString)
		expect(scope.value).toBe('bar')
	})
	test('should get returned value from function', () => {
		const jsString = `
const getValue = () => {
	return 'baz'
}

const value = getValue()`
		const { scope } = extractModel(jsString)
		expect(scope.value).toBe('baz')
	})
	test('should get returned undefined from function', () => {
		const jsString = `
const getValue = () => {
	return
}

const value = getValue()`
		const { scope } = extractModel(jsString)
		expect(scope.value).toBeNull()
	})
}

// const switchStatementTest = () => {
// 	const generateJsString = (test: string) => {
// 		return `
// let value = 0
// const test = '${test}'
// switch(test) {
// 	case 'foo':
// 		value = 1
// 		break
// 	case 'bar':
// 		let plus = 2
// 		value = plus
// 	case 'baz':
// 		value += plus + 1
// 		break
// 	default:
// 		value = -1
// }`
// 	}
// 	test.only('should return value correctly in switch [1]', () => {
// 		const jsString = generateJsString('foo')
// 		const { scope } = extractModel(jsString)
// 		expect(scope.value).toBe(1)
// 	})
// }

describe('Statements', () => {
	describe('Loop statement', loopStatementTest)
	describe('Logical expression', logicalExpressionTest)
	describe('Conditional expression', conditionalExpressionTest)
	describe('If statement', ifStatementTest)
	describe('Block statement', blockStatementTest)
	describe('Arrow Function expression', arrowFunctionExpressionTest)
	// describe('Switch statement', switchStatementTest)
})

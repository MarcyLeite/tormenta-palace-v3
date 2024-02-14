import { executePlsCode } from '@/evaluator'
import { describe, expect, test } from 'bun:test'

const variableDeclarationTest = () => {
	test('should create variable', () => {
		const jsString = `
const foo = 2`
		const scope = executePlsCode(jsString)

		expect(scope).toHaveProperty('foo')
		expect(scope.foo).toBe(2)
	})
	test('should create multiple variables in one line', () => {
		const jsString = `
const foo = 2, bar = 3`
		const scope = executePlsCode(jsString)

		expect(scope).toHaveProperty('foo')
		expect(scope.foo).toBe(2)
		expect(scope).toHaveProperty('bar')
		expect(scope.bar).toBe(3)
	})
	test('sould attribute variable value to variable', () => {
		const jsString = `
const foo = 2
const bar = foo`
		const scope = executePlsCode(jsString)

		expect(scope).toHaveProperty('bar')
		expect(scope.bar).toBe(2)
	})
	test('should through error when changing const variable', () => {
		const jsString = `
const foo = 2
const foo = 3`
		expect(() => {
			executePlsCode(jsString)
		}).toThrow("Identifier 'foo' has already been declared")
	})
	test('sould create changable variable', () => {
		const jsString = `
let bar = 3
let foo = 2
foo = bar`
		const scope = executePlsCode(jsString)

		expect(scope).toHaveProperty('foo')
		expect(scope.foo).toBe(3)
	})
}

const arrayDeclarationTest = () => {
	test('should attribute variable using array [1]', () => {
		const jsString = `
const [foo, bar] = [1]`
		const scope = executePlsCode(jsString)

		expect(scope).toHaveProperty('foo')
		expect(scope).toHaveProperty('bar')
		expect(scope.foo).toBe(1)
		expect(scope.bar).toBeUndefined()
	})
	test('should attribute variable using array [2]', () => {
		const jsString = `
const [foo, bar] = [1, 2, 3]`
		const scope = executePlsCode(jsString)

		expect(scope.foo).toBe(1)
		expect(scope.bar).toBe(2)
	})
	test('should attribute variable using array [3]', () => {
		const jsString = `
const baz = 4
const [foo, bar] = [1, baz]`
		const scope = executePlsCode(jsString)

		expect(scope.foo).toBe(1)
		expect(scope.bar).toBe(4)
	})
}

const objectDeclarationTest = () => {
	test('should attribute variable using Object [1]', () => {
		const jsString = `
const { foo, bar } = { foo: 1, bar: 2 }`
		const scope = executePlsCode(jsString)

		expect(scope.foo).toBe(1)
		expect(scope.bar).toBe(2)
	})
	test('should attribute variable using Object [2]', () => {
		const jsString = `
const { foo, bar } = { foo: 1 }`
		const scope = executePlsCode(jsString)

		expect(scope.foo).toBe(1)
		expect(scope.bar).toBeUndefined()
	})
	test('should attribute variable using Object [3]', () => {
		const jsString = `
const { foo, bar } = { foo: 1, bar: 2, baz: 3 }`
		const scope = executePlsCode(jsString)

		expect(scope.foo).toBe(1)
		expect(scope.bar).toBe(2)
	})
	test('should attribute variable using Object [4]', () => {
		const jsString = `
const { foz: foo, baz: bar } = { foo: 1, bar: 2, baz: 3 }`
		const scope = executePlsCode(jsString)

		expect(scope.foo).toBeUndefined()
		expect(scope.bar).toBe(3)
	})
}

const objectBehaviorTest = () => {
	test('should create empty object', () => {
		const jsString = `
const obj = {}`
		const scope = executePlsCode(jsString)
		expect(scope.obj).toStrictEqual({})
	})
	test('should create object with property', () => {
		const jsString = `
const obj = { foo: 1 }`
		const scope = executePlsCode(jsString)
		expect(scope.obj).toStrictEqual({ foo: 1 })
	})
	test('should update object property', () => {
		const jsString = `
const obj = { foo: 1 }
obj.foo = 2`
		const scope = executePlsCode(jsString)
		expect(scope.obj).toStrictEqual({ foo: 2 })
	})
	test('should update object property using key instead of property', () => {
		const jsString = `
const obj = { foo: 1 }
obj['foo'] = 2`
		const scope = executePlsCode(jsString)
		expect(scope.obj).toStrictEqual({ foo: 2 })
	})
	test('should update object property using computed in key', () => {
		const jsString = `
const key = 'foo'
const obj = { foo: 1 }
obj[key] = 2`

		const scope = executePlsCode(jsString)
		expect(scope.obj).toStrictEqual({ foo: 2 })
	})
	test('should get value from array', () => {
		const jsString = `
const arr = ['foo']
const bar = arr[0]`

		const scope = executePlsCode(jsString)
		expect(scope.bar).toBe('foo')
	})
}

const arrayBehaviorTest = () => {
	test('should create array object', () => {
		const jsString = `
const arr = [0, 1]`
		const scope = executePlsCode(jsString)
		expect(scope.arr).toStrictEqual([0, 1])
	})
}

describe('Basic Variable assignment', () => {
	describe('Variable declaration', variableDeclarationTest)
	describe('Array pattern', arrayDeclarationTest)
	describe('Array behavior', arrayBehaviorTest)
	describe('Object pattern', objectDeclarationTest)
	describe('Object behavior', objectBehaviorTest)
})

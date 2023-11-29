import { extractModel } from '@/evaluator'
import { describe, expect, test } from 'bun:test'

const binaryExpressionTest = () => {
	test('should calculate value', () => {
		const jsString = `
const value = 2 + 3 + 4`
		const { scope } = extractModel(jsString)
		expect(scope.value).toStrictEqual(9)
	})
	test('should calculate value', () => {
		const jsString = `
const value = 3**3 + 4*(8 - 5) / 6`
		const { scope } = extractModel(jsString)
		expect(scope.value).toStrictEqual(29)
	})
	test('should calculate value', () => {
		const jsString = `
const value = 9 / 3 == 3`
		const { scope } = extractModel(jsString)
		expect(scope.value).toStrictEqual(true)
	})
	test('should calculate value using variables', () => {
		const jsString = `
const a = 9, b = 6
const value = a - 3 == b`
		const { scope } = extractModel(jsString)
		expect(scope.value).toStrictEqual(true)
	})
	test('should calculate value updating variable', () => {
		const jsString = `
let value = 2
value = value + 4`
		const { scope } = extractModel(jsString)
		expect(scope.value).toStrictEqual(6)
	})
	test('should calculate value updating object property', () => {
		const jsString = `
let obj = { a: 3, b: 4 }
obj.a = obj.a + obj.b`
		const { scope } = extractModel(jsString)
		expect(scope.obj.a).toStrictEqual(7)
	})
	test('should auto increment value', () => {
		const jsString = `
let value = 9
value++`
		const { scope } = extractModel(jsString)
		expect(scope.value).toStrictEqual(10)
	})
	test('should auto increment object value', () => {
		const jsString = `
let obj = { value: 9 }
obj.value++`
		const { scope } = extractModel(jsString)
		expect(scope.obj.value).toStrictEqual(10)
	})
	test('should auto decrement custom value', () => {
		const jsString = `
let value = 1
value -= 4`
		const { scope } = extractModel(jsString)
		expect(scope.value).toStrictEqual(-3)
	})
}

const othersTest = () => {
	test('should create unary value', () => {
		const jsString = `
const value = -1`
		const { scope } = extractModel(jsString)
		expect(scope.value).toStrictEqual(-1)
	})
	test('should work sequence Expression', () => {
		const jsString = `
let a = 0
const value = (a++, a)`
		const { scope } = extractModel(jsString)
		expect(scope.value).toStrictEqual(1)
	})
}

describe('Basic Operations', () => {
	describe('Binary Expression', binaryExpressionTest)
	describe('Other tests', othersTest)
})

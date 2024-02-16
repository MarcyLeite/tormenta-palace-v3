import type { EntityHandler, PlsInterface } from './entity-handler'
import { createEntityHandler } from './entity-handler'
import { beforeEach, describe, expect, test } from 'bun:test'

let entityHandler: EntityHandler

const interfaceTest = () => {
	let plsInterface: PlsInterface
	const generateTestEntity = () => {
		const testEntity = {
			title: 'Entity',
			description: 'Test Entity',
			pools: ['category1', 'category2'],
		}
		return Object.assign({}, testEntity)
	}
	beforeEach(() => {
		plsInterface = entityHandler.plsInterface
	})
	test('should add new Palace Entity and retrieve values', () => {
		plsInterface.register('newEntity', generateTestEntity())

		const entityDict = entityHandler.getEntities()

		expect(entityDict).toBeDefined()
		expect(entityDict).toHaveProperty('newEntity')

		const entityMeta = entityDict['newEntity'].meta
		expect(entityMeta).toBeDefined()

		expect(entityMeta.title).toBe('Entity')
		expect(entityMeta.description).toBe('Test Entity')
		expect(entityMeta.pools).toBeDefined()

		if (!entityMeta.pools) return
		expect(entityMeta.pools[0]).toBe('category1')
		expect(entityMeta.pools[1]).toBe('category2')
	})
	test('should only retrieve meta values with pls interface', () => {
		// TODO improve when entity get complex
		plsInterface.register('newEntity', generateTestEntity())

		const entityDict = plsInterface.getAll()['newEntity']
		const keys = Object.keys(entityDict)

		expect(keys).toHaveLength(3)
		expect(keys).toContain('title')
		expect(keys).toContain('description')
		expect(keys).toContain('pools')

		expect(entityDict['pools']).toContain('category1')
		expect(entityDict['pools']).toContain('category2')
	})
	test('should not change entity when original object get changed', () => {
		const testEntity = generateTestEntity()
		plsInterface.register('newEntity', generateTestEntity())
		testEntity.title = 'foo'

		const entityDict = entityHandler.getEntities()
		expect(entityDict['newEntity'].meta.title).toBe('Entity')
	})
}

describe('Entity handler', () => {
	beforeEach(() => {
		entityHandler = createEntityHandler()
	})
	describe('Palace Interface', interfaceTest)
})

import { createEngine } from '@/engine'
import { describe, expect, test } from 'bun:test'
import bundler from '@/bundler.test'

describe('Palace engine', () => {
	test('should add interface', () => {
		const engine = createEngine([bundler.carScript])

		const entityDict = engine.getEntities()
		expect(entityDict['attribute.car']).toBeDefined()

		if (!entityDict['attribute.car']) return

		const meta = entityDict['attribute.car'].meta
		expect(meta.title).toBe('Carisma')
		expect(meta.description).toBe('Smile')
		if (!meta.pools) return
		expect(meta.pools[0]).toBe('attribute')
	})
})

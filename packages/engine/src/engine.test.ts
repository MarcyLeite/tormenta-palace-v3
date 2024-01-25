import { createEngine } from '@/engine'
import { describe, expect, test } from 'bun:test'

describe('Palace engine', () => {
	test('should add interface', () => {
		const jsString = `palace.entity.register('attribute.car', {
			title: 'Carisma',
			description: 'Smile',
			pools: ['attribute'],
		})`

		const engine = createEngine()
		engine.run(jsString)

		const entityDict = engine.getEntities()
		expect(entityDict['attribute.car']).toBeDefined()

		const meta = entityDict['attribute.car'].meta
		console.log(entityDict['attribute.car'])
		expect(meta.title).toBe('Carisma')
		expect(meta.description).toBe('Smile')
		expect(meta.pools[0]).toBe('attribute')
	})
})

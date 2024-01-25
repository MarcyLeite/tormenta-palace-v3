import { createEngine } from '@/engine'
import { describe, expect, test } from 'bun:test'

describe('Palace engine', () => {
	test('should add interface', () => {
		const jsString = `palace.registry.register('attribute.car', {
			title: 'Carisma',
			description: 'Smile',
			pools: ['attribute'],
		})`

		const engine = createEngine()
		engine.run(jsString)

		const registryDict = engine.getRegistries()
		expect(registryDict['attribute.car']).toBeDefined()

		const meta = registryDict['attribute.car'].meta
		console.log(registryDict['attribute.car'])
		expect(meta.title).toBe('Carisma')
		expect(meta.description).toBe('Smile')
		expect(meta.pools[0]).toBe('attribute')
	})
})

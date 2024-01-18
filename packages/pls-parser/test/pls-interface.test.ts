import { engineFactory } from '@/engine'
import { describe, expect, test } from 'bun:test'

describe('Palace Interface', () => {
	test.only('should add interface', () => {
		let awnserQuestion = 'no awnser'
		const simpleInterface = {
			awnserQuestion: (awnser: string) => {
				awnserQuestion = awnser
			},
		}

		const plsEngine = engineFactory()
		plsEngine.setGlobal('simpleInterface', simpleInterface)
		plsEngine.run('simpleInterface.awnserQuestion("42")')

		expect(awnserQuestion).toBe('42')
	})
	// test.only('should add registry', () => {
	// 	let testId: string = ''
	// 	let testObj: any = {}

	// 	const jsString = `palace.registry.register('attribute.car', {
	// 		title: 'Carisma',
	// 		description: 'Smile',
	// 		pools: ['attribute'],
	// 	})`
	// 	const { scope, models } = executePlsCode(jsString)
	// 	console.log(testId)
	// })
})

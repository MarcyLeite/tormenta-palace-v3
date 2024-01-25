import { parserFactory } from '@/parser'
import { describe, expect, test } from 'bun:test'

describe('Palace Interface', () => {
	test('should add interface', () => {
		let awnserQuestion = 'no awnser'
		const simpleInterface = {
			awnserQuestion: (awnser: string) => {
				awnserQuestion = awnser
			},
		}

		const plsEngine = parserFactory()
		plsEngine.setGlobal('simpleInterface', simpleInterface)
		plsEngine.run('simpleInterface.awnserQuestion("42")')

		expect(awnserQuestion).toBe('42')
	})
})

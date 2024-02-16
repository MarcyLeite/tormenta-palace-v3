import type { FormElement, SheetObject } from './builder/builder.types'

import builder from '@/builder'
import bundler from '@/bundler.test'
import { beforeEach, expect, test, describe } from 'bun:test'

describe('Builder', () => {
	beforeEach(() => {})
	test('should generate base sheet', () => {
		const { sheet } = builder.createSheet([bundler.simpleAttributeComposer])
		expect(sheet).toHaveProperty('attributes')

		const attributes = sheet.attributes as SheetObject

		expect(attributes).toHaveProperty('des')
		expect(attributes).toHaveProperty('car')
		expect(attributes.des).toBe(-5)
		expect(attributes.car).toBe(-5)
	})
	test('should populate form with race options', () => {
		const { form } = builder.createSheet([bundler.humanoRace, bundler.raceAspect])
		expect(form).toHaveProperty('/races/')

		const formRaces = form['/races/'] as FormElement
		expect(formRaces.status).toBe('warn')
		expect(formRaces.fields).toHaveLength(1)

		const raceField = formRaces.fields[0]
		expect(raceField.label).toBe('Escolha a raça: ')
		expect(raceField.type).toBe('combo')

		const humanoOption = raceField.options[0]
		expect(humanoOption.value).toBe('race.humano')
		expect(humanoOption.display).toBe('Humano')
	})
	test('should set sheet race to "humano"', () => {
		const { sheet, form } = builder.createSheet([bundler.humanoRace, bundler.raceAspect], {
			'/races/': ['race.humano'],
		})

		const formRaces = form['/races/'] as FormElement
		expect(formRaces.status).toBe('ok')

		expect(sheet).toHaveProperty('race')
		expect(sheet.race).toBe('Humano')
	})
})

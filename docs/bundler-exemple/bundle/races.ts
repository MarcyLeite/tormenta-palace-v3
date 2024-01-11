import poolHandler from '@/pool-handler'

const meta = {
	title: 'Raça',
	description: 'Humans, Elfs, Dwarfs, taht stuff',
	pools: ['aspect'],
}

const sheetBehavior: RegistrySheetBehavior = (args) => {
	let chosenRaceId: string = args[0].toString()
	const getBuilderInfo = () => {
		let status: BuilderStatus = 'warn'
		if (chosenRaceId) status = 'ok'

		const raceField = poolHandler.toField('Escolha a caça: ', 'race')

		return {
			fields: [raceField],
			status,
		}
	}

	const updateSheet = (queue: any) => {
		queue.add(args[0])
	}

	return {
		getBuilderInfo,
		updateSheet,
	}
}

palace.registry.register('aspect.raca', meta, sheetBehavior)

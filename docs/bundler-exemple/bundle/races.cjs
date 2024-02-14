const builderBehavior = (args) => {
	let chosenRaceId = undefined
	if (args && args.length > 0) {
		chosenRaceId = args[0]
	}
	const getBuilderInfo = () => {
		let status = 'warn'
		if (chosenRaceId) status = 'ok'

		const raceField = poolHandler.toField('Escolha a raça: ', 'race')

		return {
			fields: [raceField],
			status,
		}
	}

	const updateSheet = (sheet, queue) => {
		if (!chosenRaceId) return
		const race = palace.entity.getAll()[chosenRaceId]
		sheet.race = race.title

		queue.add(args[0])
		return sheet
	}

	return {
		getBuilderInfo,
		updateSheet,
	}
}

palace.entity.register('races', {
	builderBehavior: builderBehavior,
	composePhase: true,
})

const carScript = `
palace.entity.register('attribute.car', {
    title: 'Carisma',
    description: 'Smile',
    pools: ['attribute'],
})
`

const desScript = `
palace.entity.register('attribute.des', {
    title: 'Destreza',
    description: 'Leroooy',
    pools: ['attribute'],
})
`

const simpleAttributeComposer = `
const attributes = {
    des: -5,
    car: -5
}

const builderBehavior = () => {
	return {
		updateSheet: (sheet) => {
			sheet.attributes = attributes
			return sheet
		},
	}
}

palace.entity.register('attributes', {
	builderBehavior: builderBehavior,
	composePhase: true,
})
`

const poolHandler = `

const generateFilter = (keyList) => {
	return (filteredDict, [entityKey, entity]) => {
		for (const key of keyList) {
			if (entity.pools.includes(key)) filteredDict[entityKey] = entity
		}
		return filteredDict
	}
}

const getEntities = (keyList) => {
	const filter = generateFilter(keyList)

	
	const entityDict = palace.entity.getAll()
	const entityEntriesList = Object.entries(entityDict)
	const entityDictFiltered = entityEntriesList.reduce(filter, {})

	return entityDictFiltered
}
const toField = (label, pool) => {
	const entityList = getEntities([pool])

	const options = []

	for (const [id, entity] of Object.entries(entityList)) {
		options.push({ value: id, display: entity.title })
	}

	return {
		label: label,
		type: 'combo',
		options
	}
}

const poolHandler = {
	generateFilter,
	getEntities,
	toField
}
`

const humanoRace = `
palace.entity.register('race.humano', {
    title: 'Humano',
    description: "Hi, I'm a dummy :D",
    pools: ['race'],
})
`

const raceAspect = `${poolHandler}

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
`

export default { carScript, desScript, simpleAttributeComposer, raceAspect, humanoRace }

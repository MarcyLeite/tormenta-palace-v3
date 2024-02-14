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
		options,
	}
}

export default {
	getEntities,
	toField,
}

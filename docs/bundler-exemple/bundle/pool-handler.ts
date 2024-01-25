const generateFilter = (keyList: string[]) => {
	return (filteredDict: any, [key, entity]) => {
		if (keyList.includes(key)) filteredDict[key] = entity
		return filteredDict
	}
}

const getEntities = (keyList: string[]) => {
	const filter = generateFilter(keyList)

	const entityDict = palace.entity.getAll()
	const entityEntriesList = Object.entries<any>(entityDict)
	const entityDictFiltered = entityEntriesList.reduce(filter, {})

	return entityDictFiltered
}
const toField = (label: string, pool: string) => {
	const entityList = getEntities([pool])

	const field: any[] = []
	for (const entity of entityList) {
		field.push()
	}
}

export default {
	getEntities,
	toField,
}

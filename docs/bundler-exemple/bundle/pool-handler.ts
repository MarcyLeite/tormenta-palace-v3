const generateFilter = (keyList: string[]) => {
	return (filteredDict: any, [key, registry]) => {
		if (keyList.includes(key)) filteredDict[key] = registry
		return filteredDict
	}
}

const getRegistries = (keyList: string[]) => {
	const filter = generateFilter(keyList)

	const registryDict = palace.registry.getAll()
	const registryEntriesList = Object.entries<any>(registryDict)
	const registryDictFiltered = registryEntriesList.reduce(filter, {})

	return registryDictFiltered
}
const toField = (label: string, pool: string) => {
	const registryList = getRegistries([pool])

	const field: any[] = []
	for (const registry of registryList) {
		field.push()
	}
}

export default {
	getRegistries,
	toField,
}

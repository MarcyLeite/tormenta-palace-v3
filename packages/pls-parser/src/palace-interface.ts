type EntityArgs = string | number | boolean
type BuilderStatus = 'ok' | 'warn' | 'error'

interface EntityMeta {
	title: string
	description: string
	pools: string[]
}

type EntityFactory = (args: EntityArgs[]) => {
	getBuilderInfo?: () => {
		fields: Field[]
		status: BuilderStatus
	}
	updateSheet?: (queue: QueueItem[]) => void
}

type Field = any
type QueueItem = any
type ComposerFunction = () => any

type EntityRegister = (id: string, meta: EntityMeta, entityFactory?: EntityFactory) => void
type EntityGetAll = () => Dict<EntityMeta>

interface PalaceInterface {
	entity: {
		register: EntityRegister
		getAll: EntityGetAll
	}
	composer: {
		register: (composerFunction: ComposerFunction) => void
	}
}

export default () => {
	const entityDict: Dict<{ meta: EntityMeta; factory?: EntityFactory }> = {}

	const registerEntity: EntityRegister = (id, meta, entityFactory) => {
		entityDict[id] = { meta, factory: entityFactory }
	}

	const getAllEntities: EntityGetAll = () => {
		return Object.entries(entityDict).reduce((dict, [key, value]) => {
			if (!value) return dict

			dict[key] = value.meta
			return dict
		}, {} as Dict<EntityMeta>)
	}

	const composerList: Function[] = []

	const palaceInterface: PalaceInterface = {
		entity: {
			register: registerEntity,
			getAll: getAllEntities,
		},
		composer: {
			register: (callback: Function) => {
				composerList.push(callback)
			},
		},
	}

	return {
		interface: palaceInterface,
	}
}

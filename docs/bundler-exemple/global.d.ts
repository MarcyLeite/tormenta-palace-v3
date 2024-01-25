type Dict<T> = { [index: string]: T }

type Field = any
type QueueItem = any
type ComposerFunction = () => any

interface Palace {
	entity: {
		register: (id: string, meta: EntityMeta, sheetBehavior?: EntitySheetBehavior) => void
		getAll: () => Dict<EntityMeta>
	}
	composer: {
		register: (composerFunction: ComposerFunction) => void
	}
}

declare global {
	type EntityArgs = string | number | boolean
	type BuilderStatus = 'ok' | 'warn' | 'error'

	interface EntityMeta {
		title: string
		description: string
		pools: string[]
	}

	type EntitySheetBehavior = (args: EntityArgs[]) => {
		getBuilderInfo?: () => {
			fields: Field[]
			status: BuilderStatus
		}
		updateSheet?: (queue: QueueItem[]) => void
	}

	export const palace: Palace
}

export {}

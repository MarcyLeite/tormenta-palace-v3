type Field = any
type QueueItem = any
type ComposerFunction = () => any
type BuilderStatus = 'ok' | 'warn' | 'error'

export interface EntityMeta {
	title: string
	description: string
	pools: string[]
}

type EntityArgs = string | number | boolean

export type EntitySheetBehavior = (args: EntityArgs[]) => {
	getBuilderInfo?: () => {
		fields: Field[]
		status: BuilderStatus
	}
	updateSheet?: (queue: QueueItem[]) => void
}

export interface PalacePlsInterface {
	entity: {
		register: (id: string, meta: EntityMeta, sheetBehavior?: EntitySheetBehavior) => void
		getAll: () => Dict<EntityMeta>
	}
	composer: {
		register: (composerFunction: ComposerFunction) => void
	}
}

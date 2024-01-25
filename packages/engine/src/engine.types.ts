type Field = any
type QueueItem = any
type ComposerFunction = () => any
type BuilderStatus = 'ok' | 'warn' | 'error'

export interface RegistryMeta {
	title: string
	description: string
	pools: string[]
}

type RegistryArgs = string | number | boolean

export type RegistrySheetBehavior = (args: RegistryArgs[]) => {
	getBuilderInfo?: () => {
		fields: Field[]
		status: BuilderStatus
	}
	updateSheet?: (queue: QueueItem[]) => void
}

export interface PalacePlsInterface {
	registry: {
		register: (id: string, meta: RegistryMeta, sheetBehavior?: RegistrySheetBehavior) => void
		getAll: () => Dict<RegistryMeta>
	}
	composer: {
		register: (composerFunction: ComposerFunction) => void
	}
}

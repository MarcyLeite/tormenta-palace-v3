type Dict<T> = { [index: string]: T }

type Field = any
type QueueItem = any
type ComposerFunction = () => any

interface Palace {
    registry: {
        register: (id: string, meta: RegistryMeta, sheetBehavior?: RegistrySheetBehavior) => void
        getAll: () => Dict<RegistryMeta>
    }
    composer: {
        register: (composerFunction: ComposerFunction) => void
    }
}

declare global {
    type RegistryArgs = string | number | boolean
    type BuilderStatus = 'ok' | 'warn' | 'error'

    interface RegistryMeta {
        title: string
        description: string
        pools: string[]
    }
    
    type RegistrySheetBehavior = (args: RegistryArgs[]) => {
        getBuilderInfo?: () => {
            fields: Field[]
            status: BuilderStatus
        }
        updateSheet?: (queue: QueueItem[]) => void
    }
    
    export const palace: Palace
}

export {}
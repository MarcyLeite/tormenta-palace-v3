type RegistryArgs = string | number | boolean
type BuilderStatus = 'ok' | 'warn' | 'error'

interface RegistryMeta {
    title: string
    description: string
    pools: string[]
}

type RegistryFactory = (args: RegistryArgs[]) => {
    getBuilderInfo?: () => {
        fields: Field[]
        status: BuilderStatus
    }
    updateSheet?: (queue: QueueItem[]) => void
}

type Field = any
type QueueItem = any
type ComposerFunction = () => any

type RegistryRegister = (id: string, meta: RegistryMeta, registryFactory?: RegistryFactory) => void
type RegistryGetAll = () => Dict<RegistryMeta>

interface PalaceInterface {
    registry: {
        register: RegistryRegister
        getAll: RegistryGetAll
    }
    composer: {
        register: (composerFunction: ComposerFunction) => void
    }
}

export default () => {    
    const registryDict: Dict<{meta: RegistryMeta, factory?: RegistryFactory}> = {}
    
    const registerRegistry: RegistryRegister = (id, meta, registryFactory) => {
        registryDict[id] = {meta, factory: registryFactory}
    }

    const getAllRegistries: RegistryGetAll = () => {
        return Object.entries(registryDict).reduce((dict, [key, value]) => {
            if (!value) return dict
            
            dict[key] = value.meta
            return dict
        }, {} as Dict<RegistryMeta>)
    }

    const composerList: Function[] = []

    const palaceInterface: PalaceInterface = {
        registry: {
            register: registerRegistry,
            getAll: getAllRegistries
        },
        composer: {
            register: (callback: Function) => {
                composerList.push(callback)
            }
        }
    }

    return {
        interface: palaceInterface
    }
}
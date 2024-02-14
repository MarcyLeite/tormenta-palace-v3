import { BuilderBehavior } from '@/builder/builder.types'

export interface EntityMeta {
	title: string
	description: string
	pools: string[]
}

export interface Entity {
	meta: EntityMeta
	builderBehavior?: BuilderBehavior
	composePhase?: boolean
}

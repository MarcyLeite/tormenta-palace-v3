export type SheetProperty = string | number | boolean | Array<SheetProperty> | SheetObject
type BuilderStatus = 'ok' | 'warn' | 'error'

export interface SheetObject {
	[key: string]: SheetProperty
}

type FieldType = 'combo'
type FieldOption = {
	display: string
	value: string | number | boolean
}

export interface Field {
	label: string
	type: FieldType
	options: FieldOption[]
}

export interface ComboField extends Field {
	type: 'combo'
}

export interface QueueInterface {
	add: (entityId: string) => void
}

export type FormElement = {
	fields: Field[]
	status: BuilderStatus
}

export type BuilderBehavior = (args?: any) => {
	getBuilderInfo?: () => FormElement
	updateSheet: (sheet: SheetObject, queue: QueueInterface) => void
}

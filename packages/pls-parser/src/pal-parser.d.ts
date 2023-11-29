import { Identifier, ObjectExpression, Property } from 'estree'
import { Parser } from 'acorn'

declare const palParser: typeof Parser
declare interface PalModelDeclaration {
	type: 'palModelDeclaration'
	start: number
	end: number
	id: Identifier
	body: ObjectExpression
}

declare interface PalProperty extends Omit<Property, 'type'> {
	type: 'palProperty'
	static: boolean
}

declare interface PalModel extends Omit<ObjectExpression, 'properties'> {
	properties: PalProperty[]
}

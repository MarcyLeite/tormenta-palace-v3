import { PlsScript } from '@/global.types'
import { Engine, createEngine, Entity } from '@/engine'
import { SheetObject, FormElement } from './builder.types'

interface QueueItem {
	parent: string
	entry: [string, Entity]
}

const queueRun = (
	engine: Engine,
	queue: QueueItem[],
	sheet: SheetObject,
	form: Dict<FormElement>,
	answers: Dict<any>
) => {
	const queueItem = queue[0]
	if (!queueItem) return false

	const parent = queueItem.parent
	const entry = queueItem.entry

	const entityId = entry[0]
	const entity = entry[1]

	if (!entity.builderBehavior) return true

	const mePath = `${parent}${entityId}/`

	const queueAdd = (entityId: string) => {
		const entityDict = engine.getEntities()
		const toAddEntity = entityDict[entityId]
		queue.push({
			parent: mePath,
			entry: [entityId, toAddEntity],
		})
	}

	const args = answers[mePath]
	const builderBehavior = entity.builderBehavior(args)

	let builderInfo
	if (builderBehavior.getBuilderInfo) {
		builderInfo = builderBehavior.getBuilderInfo()
	}
	const updatedSheet = builderBehavior.updateSheet(sheet, { add: queueAdd })

	Object.assign(sheet, updatedSheet)
	form[mePath] = builderInfo
}

const createSheet = (plsScriptList: PlsScript[], answers: Dict<any> = {}) => {
	const engine = createEngine(plsScriptList)
	const sheet: SheetObject = {}

	const entityDict = engine.getEntities()

	const rootParent = '/'
	const queue: QueueItem[] = []
	const form: Dict<FormElement> = {}

	for (const entityEntry of Object.entries(entityDict)) {
		const entity = entityEntry[1]
		if (!entity.composePhase || !entity.builderBehavior) continue

		queue.push({
			parent: rootParent,
			entry: entityEntry,
		})
	}

	for (let i = 0; i < 10000; i++) {
		if (queue.length === 0) break
		queueRun(engine, queue, sheet, form, answers)
		queue.shift()
	}

	return {
		sheet: sheet as SheetObject,
		form,
	}
}

export default {
	createSheet,
}

palace.entity.register('attribute.for', {
	title: 'Força',
	description: 'Birrrl',
	pools: ['attribute'],
})

palace.entity.register('attribute.des', {
	title: 'Destreza',
	description: 'Fast as f*ck boyy',
	pools: ['attribute'],
})

palace.entity.register('attribute.con', {
	title: 'Constituição',
	description: 'TANK',
	pools: ['attribute'],
})

palace.entity.register('attribute.int', {
	title: 'Inteligencia',
	description: '2 + 2 = 5',
	pools: ['attribute'],
})

palace.entity.register('attribute.sab', {
	title: 'Sabedoria',
	description: '2 + 2 = 22',
	pools: ['attribute'],
})

palace.entity.register('attribute.car', {
	title: 'Carisma',
	description: '2 + 2 = SONG',
	pools: ['attribute'],
})

const setAttributes = (sheet: any) => {
	sheet.attributes = {
		for: -5,
		des: -5,
		con: -5,
		int: -5,
		sab: -5,
		car: -5,
	}
	return sheet
}

palace.entity.register('aspect.attributes', {
	title: 'Attributes',
	description: 'Things on your character',
	pools: ['aspect'],
	builderBehavior: () => {
		return {
			updateSheet: setAttributes,
		}
	},
	composePhase: true,
})

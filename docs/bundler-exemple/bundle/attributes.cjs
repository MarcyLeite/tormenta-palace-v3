const ATTRIBUTE_BASE_VALUE = -5

palace.entity.register('attribute.des', {
	title: 'Destreza',
	description: 'Leroooy',
	pools: ['attribute'],
})

palace.entity.register('attribute.car', {
	title: 'Carisma',
	description: 'Smile',
	pools: ['attribute'],
})

const attributes = {
	des: -5,
	car: -5,
}

const builderBehavior = () => {
	return {
		updateSheet: (sheet) => {
			sheet.attributes = attributes
			return sheet
		},
	}
}

palace.entity.register('attributes', {
	builderBehavior: builderBehavior,
	composePhase: true,
})

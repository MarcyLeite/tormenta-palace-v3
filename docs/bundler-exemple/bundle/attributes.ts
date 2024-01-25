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

palace.composer.register(() => {
	return {
		attributes: {
			des: ATTRIBUTE_BASE_VALUE,
			car: ATTRIBUTE_BASE_VALUE,
		},
	}
})

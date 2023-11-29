import poolHandler from palaceTK.poolHandler

define races {
    static title = 'Raças',
    static description = 'Humans, Elfs, Dwards, that stuff'
    
    construct = (chosenRaceId) => {
        this.chosenRaceId = chosenRaceId
    }

    updateSheet = (_, queue) => {
        queue.add(this.chosenRaceId)
    }

    getBuilderInfo = () => {
        status = STATUS.warn
        if (chosenRaceId == this.chosenRaceId) status = STATUS.ok

        raceField = poolHandler.toField('Escolha a raça: ', 'race')

        return {
            fields = [raceField],
            status
        }
    }
}
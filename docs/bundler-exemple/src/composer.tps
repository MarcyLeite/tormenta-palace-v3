import poolHandler from palaceTK.poolHandler
import meta from palaceTK.meta

define composer {
    static ATTRIBUTE_BASE_VALUE = -5
    
    static addAttributes = (sheet) => {
        sheet.attributes = {}
        attributeList = poolHandler.get('attribute')

        for (attribute in attributeList) {
            attributeValue = complexValue.create()

            attributeValue.setValue('base', ATTRIBUTE_BASE_VALUE)
            sheet.attributes[attribute.id] = attributeValue
        }
    }

    static addSkills = (sheet) => {
        getHalfLevel = () => {
            return sheet.level.total() / 2
        }

        getTrainedBonus = () => {
            if(!skillValue.get('trained')) return 0
            
            level = sheet.level.total()
            if level <= 6 return 2
            if level <= 14 return 4
            return 6
        }
        
        sheet.skills = {}
        skillList = poolHandler.get('skill')

        for (skill in skillList) {
            skillValue = complexValue.create()

            if (skill.onlyTrained) skillValue.set('onlyTrained', true)
            if (skill.armorPenalty) skillValue.set('armorPenalty', true)

            skillValue.set('trained', false)

            getAttribute = sheet.attributes[skill.attribute].total()
            skillValue.setValue('attribute', getAttribute)

            skillValue.setValue('halfLevel', getHalfLevel)
            skillValue.setValue('trainedBonus', getTrainedBonus)
        
            sheet.skills[skill.id] = skillValue
        }
    }

    updateSheet = () => {

    }
}


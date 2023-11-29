import { Parser, tokTypes, TokenType } from 'acorn'

// MUDAR PARA MODEL
const plsKeyDict = { register: 'plsRegister' }

function addKeyword(keyword, keywords) {
	const str = keywords.toString().replace(')$', `|${keyword})$`).slice(1, -1)

	return RegExp(str)
}

function palaceScript() {
	for (const key in plsKeyDict) {
		Parser.acorn.keywordTypes[key] = new TokenType(key, {
			keyword: key,
		})
	}

	return class extends Parser {
		parse() {
			for (const key in plsKeyDict) {
				this.keywords = addKeyword(key, this.keywords)
			}
			return super.parse()
		}
		parseStatement(context, topLevel, exports) {
			if (this.type === Parser.acorn.keywordTypes['register']) {
				this.parseRegisterStatement()
			}
			return super.parseStatement(context, topLevel, exports)
		}
		parseRegisterStatement() {
			const node = this.startNode()
			node.type = plsKeyDict.register
			this.next()

			const label = this.parseIdent()
			node.label = label
			if (this.value !== 'in') throw new Error('ININININ')
			this.next()

			const group = this.parseIdent()
			node.group = group

			var privateNameMap = this.enterClassBody()
			var classBody = this.startNode()
			var hadConstructor = false
			classBody.body = []
			this.expect(tokTypes.braceL)
			while (this.type !== tokTypes.braceR) {
				var element = this.parseClassElement(node.superClass !== null)
				if (element) {
					classBody.body.push(element)
					if (element.type === 'MethodDefinition' && element.kind === 'constructor') {
						if (hadConstructor) {
							this.raiseRecoverable(
								element.start,
								'Duplicate constructor in the same class'
							)
						}
						hadConstructor = true
					} else if (
						element.key &&
						element.key.type === 'PrivateIdentifier' &&
						isPrivateNameConflicted(privateNameMap, element)
					) {
						this.raiseRecoverable(
							element.key.start,
							"Identifier '#" + element.key.name + "' has already been declared"
						)
					}
				}
			}
			this.next()
			node.body = this.finishNode(classBody, 'ClassBody')
			this.exitClassBody()
			console.log(node)
			return this.finishNode(node, 'RegisterStatement')
		}
	}
}

export const palParser = Parser.extend(palaceScript)

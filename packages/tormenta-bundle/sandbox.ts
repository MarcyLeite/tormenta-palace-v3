import engine from 'engine'
import { Glob } from 'bun'

const buildPath = './build'

const glob = new Glob('*')

const scriptList: string[] = []

for (const file of glob.scanSync(buildPath)) {
	const script = Bun.file(`${buildPath}/${file}`)
	scriptList.push(await script.text())
}

const { sheet } = engine.builder.createSheet(scriptList)

console.log(sheet)

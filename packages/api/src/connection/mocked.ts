import { Glob } from 'bun'
import type { Connection } from '.'

const mockBundlePath = Bun.env.BUNDLE_PATH

const glob = new Glob('*')

const scriptList: string[] = []

for (const file of glob.scanSync(mockBundlePath)) {
	const script = Bun.file(`${mockBundlePath}/${file}`)
	scriptList.push(await script.text())
}

export default {
	getBundle: async (id: string) => scriptList,
} as Connection

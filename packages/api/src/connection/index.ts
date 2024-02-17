import firebase from './firebase'
import mocked from './mocked'

export type Bundle = string[]
export type Connection = {
	getBundle: (id: string) => Promise<Bundle>
}

export default Bun.env.NODE_ENV == 'development' ? mocked : firebase

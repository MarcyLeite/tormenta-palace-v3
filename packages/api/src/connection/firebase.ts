import type { Connection } from '.'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: 'AIzaSyDBO1H81GiblDWGeTp5qux7XkL4YmYYsYk',
	authDomain: 'tormenta-palace-fa815.firebaseapp.com',
	projectId: 'tormenta-palace-fa815',
	storageBucket: 'tormenta-palace-fa815.appspot.com',
	messagingSenderId: '719191237431',
	appId: '1:719191237431:web:d79ee2fb254c664edbb0b2',
}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const bundleRef = collection(db, 'bundles')
const bundleSnapshot = await getDocs(bundleRef)

export default {
	getBundle: async (id: string) => {
		return bundleSnapshot.docs.map((doc) => doc.data().scripts)
	},
} as Connection

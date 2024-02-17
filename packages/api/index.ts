import connection from '@/connection'
import engine from 'engine'

export default {
	getBundle: connection.getBundle,
	builder: engine.builder,
}

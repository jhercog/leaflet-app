import Dexie from 'dexie'
import { Location, Layer, Setting } from './models'

const db = new Dexie('AppDB')
db.version(1).stores({
  layers: '&_id',
  locations: '&_id,&name',
  settings: '&_id,&key'
})
db.open()

db.locations.mapToClass(Location)
db.layers.mapToClass(Layer)
db.settings.mapToClass(Setting)

export { db }

import $l from 'leaflet/dist/leaflet-src.js'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import 'leaflet/dist/leaflet.css'
import 'vue-json-pretty/lib/styles.css'
import { boot } from 'quasar/wrappers'
import { toRaw } from 'vue'
import { useAppStore, useLayersStore } from 'stores'
import { db } from 'db'
import { nanoid } from 'nanoid'
import { useDevicePixelRatio } from '@vueuse/core'

import { liveQuery } from 'dexie'

const { pixelRatio } = useDevicePixelRatio()
const ratio = pixelRatio.value > 1 ? '@2x' : ''
const mbToken = process.env.MAPBOX_API_KEY

let mbAttribution = '<a href="https://www.mapbox.com/about/maps/">©Mapbox</a>'
mbAttribution += '<a href="http://www.openstreetmap.org/about/">©OpenStreetMap</a>'
mbAttribution += '<a href="https://www.mapbox.com/map-feedback/#/-74.5/40/10">Improve</a>'

const vectorLayer = $l.tileLayer(`https://api.mapbox.com/styles/v1/berba-app/clbhuoa59000814owkt97kdu9/draft/tiles/256/{z}/{x}/{y}${ratio}?access_token={mbToken}`, { // eslint-disable-line
  attribution: mbAttribution,
  maxZoom: 19,
  mbToken
})
vectorLayer.name = 'vector'
// mapbox://styles/berba-app/clbhuoa59000814owkt97kdu9/draft

const imageLayer = $l.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { // eslint-disable-line
  attribution: 'Earthstar Geographics | Powered by <a href="https://www.esri.com/">Esri</a>',
  maxZoom: 19
})
vectorLayer.name = 'image'

const baseGroup = $l.featureGroup()
baseGroup.base = 'vector'
const drawingGroup = $l.featureGroup()
const selectionGroup = $l.featureGroup()

export default boot(async ({ app }) => {
  // https://github.com/dexie/Dexie.js/issues/1528#issuecomment-1226978955
  const drawnLayersObservable = liveQuery(async () => {
    let layers = await db.layers.toArray()
    layers = layers.map(layer => {
      layer.selected = false
      return layer
    })

    return layers
  })
  // const drawnLayersObservable = liveQuery(async () => await useLayersStore().getAllLayers())
  drawnLayersObservable.subscribe(
    features => (useLayersStore().$patch({ features })),
    // async features => (await useLayersStore().updateFeatures(features)),
    err => console.error(err)
  )

  // const currentGeolocation = {
  //   type: 'Feature',
  //   bbox: [15.821635, 45.740837, 16.106974, 45.939537],
  //   geometry: {
  //     type: 'Point',
  //     coordinates: [15.977259, 45.813190]
  //   },
  //   properties: {
  //     name: 'Zagreb City'
  //   }
  // }

  // const { _id } = await useLocationsStore().getCurrentGeolocation() ?? {}

  // useAppStore().$patch({ currentGeolocation })

  // await db.locations.put({
  //   _id: _id ?? nanoid(),
  //   name: 'currentGeolocation',
  //   ...currentGeolocation
  // })

  const currentGeolocation = await db.settings.get({ key: 'currentGeolocation' })
  const bounds = $l.latLngBounds($l.latLng(45.939537, 16.106974), $l.latLng(45.740837, 15.821635))

  if (currentGeolocation === undefined) {
    const setting = {
      _id: nanoid(),
      key: 'currentGeolocation',
      val: {
        bounds,
        latitude: 45.813190,
        latlng: {
          lat: 45.813190,
          lng: 15.977259
        },
        longitude: 15.977259,
        timestamp: Date.now()
      }
    }
    db.settings.put(setting)
    useAppStore().$patch({ currentGeolocation: setting })
  } else {
    const { _northEast, _southWest } = currentGeolocation.val.bounds
    currentGeolocation.val.bounds = $l.latLngBounds(
      $l.latLng(_northEast.lat, _northEast.lng),
      $l.latLng(_southWest.lat, _southWest.lng)
    )
    useAppStore().$patch({ currentGeolocation })
  }

  const drawerOpened = await db.settings.get({ key: 'drawerOpened' })
  if (drawerOpened === undefined) {
    const setting = {
      _id: nanoid(),
      key: 'drawerOpened',
      val: false
    }
    db.settings.put(setting)
    useAppStore().$patch({ drawerOpened: setting })
  } else {
    useAppStore().$patch({ drawerOpened })
  }

  // await db.settings.put(currentGeolocation)

  app.provide('$db', db)

  app.provide('$l', $l)
  app.provide('$vectorLayer', vectorLayer)
  app.provide('$imageLayer', imageLayer)
  app.provide('$baseGroup', baseGroup)
  app.provide('$drawingGroup', drawingGroup)
  app.provide('$selectionGroup', selectionGroup)

  useAppStore().$patch({ vectorLayer: toRaw(vectorLayer) })
  useAppStore().$patch({ imageLayer: toRaw(imageLayer) })
  useAppStore().$patch({ baseGroup: toRaw(baseGroup) })
  useAppStore().$patch({ drawingGroup: toRaw(drawingGroup) })
  useAppStore().$patch({ selectionGroup: toRaw(selectionGroup) })
})

export {
  $l
  // baseGroup,
  // drawingGroup,
  // selectionGroup
}

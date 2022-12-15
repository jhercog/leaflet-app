import { db } from 'db'
import { $l } from 'boot/initApp.js'
import { toRaw } from 'vue'
import { merge } from 'lodash' // eslint-disable-line

const { layers } = db

export const updateFeatures = function (features) {
  return new Promise((resolve, reject) => {
    this.$patch({ features })
    resolve(true)
  })
}

export const getLayerFromGeoJson = function (feature) {
  const geoLayer = $l.geoJSON(feature, {
    style: (feature) => {
      return toRaw(feature.properties?.options) ?? {}
    },
    pointToLayer: (feature, latlng) => {
      switch (feature.properties.type) {
        case 'Marker': return new $l.Marker(latlng)
        case 'Circle': return new $l.Circle(latlng, feature.properties.options)
        case 'CircleMarker': return new $l.CircleMarker(latlng, feature.properties.options)
        case 'Text': return new $l.CircleMarker(latlng)
      }
    },
    onEachFeature: (feature, layer) => {
      feature.properties.leafletType = feature.properties?.type
      switch (feature.properties?.type) {
        case 'Marker':
          layer.options.icon = $l.divIcon(feature.properties?.options.icon.options)
          break
        case 'Text':
          feature.properties.leafletType = 'Marker'
          layer.options = merge(layer.options)
          // console.log(feature.properties.options)

          break
        case 'Line':
          feature.properties.leafletType = 'Polyline'
          break
        default:
          break
      }
    },
    markersInheritOptions: true
  })

  const layers = []
  // console.log('getLayerFromGeoJson', geoLayer)

  geoLayer.getLayers().forEach(layer => {
    const latlng = layer._latlng ? layer.getLatLng() : layer.getLatLngs()
    // console.log('Loop', layer.feature.properties)
    // console.log('Loop', { ...geoLayer.options, ...layer.options })
    // console.log('Loop', layer)
    layers.push(new $l[layer.feature.properties.leafletType](latlng, { ...geoLayer.options, ...layer.options }))
  })

  return layers
}

export const getGeoJsonFromLayer = function (layer) {
  const geoJson = this.$clone(layer.toGeoJSON())
  if (!geoJson.properties) {
    geoJson.properties = {}
  }

  const options = this.$clone(merge(geoJson.properties.options, layer.options, {
    // _id: layer.pm.options.featureId,
    featureName: layer.pm.options.featureName,
    featureDescription: layer.pm.options.featureDescription,
    featureIcon: layer.pm.options.featureIcon
  }))

  geoJson.properties.options = options

  geoJson.properties.type = layer.pm._shape

  switch (layer.pm._shape) {
    case 'Circle':
      break
    case 'Marker':
      console.log('getGeoJsonFromLayer', layer.pm._shape)
      geoJson.properties.options.icon.options.className = 'q-marker-icon'
      break
    case 'Text':
      // geoJson.properties.options.markerStyle = layer.pm.options.markerStyle
      // geoJson.properties.type = 'Marker'
      break
    default:

      break
  }

  return geoJson
}

export const saveLayer = async function (layer) {
  // console.log('Layer to save', layer)
  const layerToSave = merge(this.getGeoJsonFromLayer(layer), {
    _id: layer.pm.options.featureId
  })
  const features = this.features
  const featureIndex = this.features.findIndex(f => f._id === layerToSave._id)
  features[featureIndex] = layerToSave
  this.$patch({ features })

  console.log('Layer to save', layerToSave)

  try {
    await layers.put(layerToSave)
    return layerToSave
  } catch (err) {
    console.error(err)
  }
}

export const updateLayer = async function (layer) {
  const layerToUpdate = merge(this.getGeoJsonFromLayer(layer), {
    _id: layer.pm.options.featureId
  })

  try {
    await layers.put(layerToUpdate)
    return layerToUpdate
  } catch (err) {
    console.error(err)
  }
}

export const removeLayer = async function ({ _id }) {
  try {
    await layers.delete(_id)
  } catch (err) {
    console.error(err)
  }
}

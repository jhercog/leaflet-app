// import { selectionGroup } from 'boot/initApp'
import { db } from 'db'
import { useLayersStore } from '../Layers'
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import { toRaw } from 'vue'
import { merge } from 'lodash'

export const toggleDrawer = function (val) {
  this.$patch({ drawerOpened: { val } })
  db.settings.put(toRaw(this.drawerOpened))
}

export const updateCurrentGeolocation = async function (e) {
  const { sourceTarget, target, type, ...val } = e
  const loc = await db.settings.put({ _id: this.currentGeolocation._id, key: 'currentGeolocation', val })
  console.log('updateCurrentGeolocation', loc)
  const currentGeolocation = merge({ val }, this.currentGeolocation)
  this.$patch({ currentGeolocation })
  // console.log(this.currentGeolocation, currentGeolocation)
}

export const zoomBounds = function (val) {

}

export const selectLayer = function ({ id, _id }) {
  useLayersStore().selectFeature(_id, true)
  if (this.selectedLayersIds.has(id)) {
    this.deselectLayer({ id })
  } else {
    this.selectedLayersIds.add(id)
  }
}

export const deselectLayer = function ({ id, _id }) {
  useLayersStore().selectFeature(_id, false)
  this.selectedLayersIds.delete(id)
}

export const selectLayers = function ({ ids }) {
  for (const id of ids) {
    this.selectLayer({ id })
  }
}

export const deselectLayers = function ({ ids, all = false }) {
  if (all) {
    this.selectedLayersIds.clear()
    // toRaw(this.map).pm.disableGlobalEditMode()
  } else {
    for (const id of ids) {
      this.deselectLayer({ id })
    }
  }
}

export const setColor = function ({ type, color }) {
  const selectedLayers = this.selectionGroup.getLayers()
  const allEqualColors = selectedLayers.every(layer => layer.options[type] === selectedLayers[0].options[type])
  if (selectedLayers.length > 0) {
    if (allEqualColors) {
      this.$patch({ [`temp${useChangeCase(type, 'pascalCase').value}`]: color })
    } else {
      this.setTempNoColor(type)
    }
  } else {
    this.$patch({ [`path${useChangeCase(type, 'pascalCase').value}`]: color })
    this.unsetTempColor(type)
  }
}

export const setTempNoColor = function (type) {
  type = useChangeCase(type, 'pascalCase').value
  this.$patch({ [`temp${type}`]: this[`no${type}`] })
}

export const unsetTempColor = function (type) {
  type = useChangeCase(type, 'pascalCase').value
  this.$patch({ [`temp${type}`]: this[`path${type}`] })
}

export const setSelectionColor = function ({ type, color }) {
  const selectedLayers = this.selectionGroup.getLayers()
  this.setColor({ type, color })
  for (const layer of selectedLayers) {
    if (layer.feature.properties.type === 'Marker') {
      const icon = this.markerIcon
      icon.options.className = 'q-marker-icon active'
      layer.setIcon(icon)
    } else if (layer.feature.properties.type === 'Text') {
      console.log(layer)
      if (type === 'color') {
        layer.pm.getElement().style.color = color
      } else if (type === 'fillColor') {
        layer.pm.getElement().style.background = color
      }
      layer.options[type] = color
      layer.feature.properties.options[type] = color
    } else {
      layer.setStyle({ [type]: color })
      layer.feature.properties.options[type] = color
    }

    useLayersStore().saveLayer(layer)
  }
}

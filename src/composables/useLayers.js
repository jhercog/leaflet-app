import { inject, computed, toRaw } from 'vue' // eslint-disable-line
import { debounce } from 'quasar'
import { useLayersStore, useAppStore } from 'stores'
import { isEmpty, merge } from 'lodash'

export const useLayers = () => {
  const $l = inject('$l')
  const $map = computed(() => toRaw(useAppStore().map)) // eslint-disable-line
  const $drawingGroup = computed(() => useAppStore().drawingGroup)
  const $selectionGroup = computed(() => useAppStore().selectionGroup)
  const selectedLayersIds = computed(() => useAppStore().selectedLayersIds) // eslint-disable-line
  // const $drawingGroup = inject('$drawingGroup')
  // const $selectionGroup = inject('$selectionGroup')
  const drawerItemFocused = computed(() => useAppStore().drawerItemFocused)
  const debounceSaving = debounce(layer => (useLayersStore().saveLayer(layer)))

  const onLayerCreate = async e => { // eslint-disable-line
    useAppStore().$patch({ selectedTool: 'Select' })

    const { layer } = e
    // layer.options.pmIgnore = false
    // $l.PM.reInitLayer('On layer create', layer)

    layer.on('click', onLayerClick)
    layer.on('pm:enable', onLayerEnable)
    layer.on('pm:disable', onLayerDisable)
    layer.on('pm:edit', onLayerEdit)
    layer.on('pm:textchange', onLayerTextChange)
    layer.on('pm:cut', onLayerCut)
    layer.on('pm:rotateend', onLayerRotate)
    layer.on('pm:remove', onLayerRemove)

    layer._id = layer.pm.options.featureId

    if (layer.pm._shape === 'Marker') {
      //
    } else if (layer.pm._shape === 'Text') {
      const { color, fillColor, fillOpacity, className } = layer.pm.options
      layer.options = merge(layer.options, { color, fillColor, fillOpacity, className })
      layer.pm.getElement().style.color = layer.pm.options.color
      layer.pm.getElement().style.background = layer.pm.options.fillColor
    }
    layer.feature = await useLayersStore().saveLayer(layer)

    // console.log(layer)

    // console.log($map.value)
    // layer._map.pm.disableDraw()

    // setTimeout(() => {
    //   onLayerClick(e)
    // }, 10)
    // layer.pm.enable()
  }

  const insertLayer = (feature) => {
    const layers = useLayersStore().getLayerFromGeoJson(feature)
    for (const layer of layers) {
      layer.addTo($drawingGroup.value)
      layer.feature = feature
      // layer.options.pmIgnore = false
      // $l.PM.reInitLayer(layer)
      layer.on('click', onLayerClick)
      layer.on('pm:enable', onLayerEnable)
      layer.on('pm:disable', onLayerDisable)
      layer.on('pm:edit', onLayerEdit)
      layer.on('pm:textchange', onLayerTextChange)
      layer.on('pm:cut', onLayerCut)
      layer.on('pm:rotateend', onLayerRotate)
      // layer.on('pm:dragend', onLayerDragEnd)
      layer.on('pm:remove', onLayerRemove)
      if (layer.feature.properties.type === 'Marker') {
        //
      } else if (layer.feature.properties.type === 'Text') {
        layer.pm.getElement().style.color = layer.options.color
        layer.pm.getElement().style.background = layer.options.fillColor
      }
    }
  }

  const onLayerDragEnd = e => { // eslint-disable-line
    console.log('drag end', e)
    const layer = e.layer || e.target
    if (layer.pm) {
      // onLayerClick(e)
      if (layer.pm._initMarkers) {
        layer.pm._initMarkers()
      }
      if (layer.pm.applyOptions) {
        layer.pm.applyOptions()
      }
    }
  }

  const onLayerClick = e => {
    e.originalEvent?.preventDefault()
    $l.DomEvent?.stopPropagation(e)
    $l.DomEvent?.stop(e)
    const { target } = e

    if (target.pm.layerDragEnabled && target.pm.layerDragEnabled()) return
    if ($map.value.pm.globalDragModeEnabled()) return
    if ($map.value.pm.globalCutModeEnabled()) return
    if ($map.value.pm.globalRotateModeEnabled()) return
    if ($map.value.pm.globalRemovalModeEnabled()) return

    if ($map.value.pm.Keyboard.isShiftKeyPressed()) {
      target.pm.toggleEdit()
    } else {
      for (const l of $selectionGroup.value.getLayers()) {
        if (l._leaflet_id !== target._leaflet_id) {
          l.pm.disable()
        }
      }

      if (!target.pm.enabled()) {
        target.pm.enable()
      }
    }
  }

  const onLayerEnable = ({ target: layer }) => {
    layer._map.pm.disableGlobalDragMode()
    useAppStore().selectLayer({ id: layer._leaflet_id, _id: layer.feature._id })
    layer.addTo($selectionGroup.value)
    const { color, fillColor } = layer.options
    useAppStore().setColor({ type: 'color', color })
    useAppStore().setColor({ type: 'fillColor', color: fillColor })
    // layer.options.className = 'q-marker-icon__active'
    if (layer.feature.properties.type === 'Marker') {
      const icon = layer.getIcon()
      useAppStore().tempFillColor = icon.options.color
      icon.className = 'q-marker-icon active'
      icon.options.className = 'q-marker-icon active'
      layer.setIcon(icon)
    }
  }

  const onLayerDisable = ({ target: layer }) => {
    useAppStore().deselectLayer({ id: layer._leaflet_id, _id: layer.feature._id })
    $selectionGroup.value.removeLayer(layer)
    useAppStore().unsetTempColor('color')
    useAppStore().unsetTempColor('fillColor')
    if (layer.feature.properties.type === 'Marker') {
      const icon = layer.getIcon()

      useAppStore().unsetTempColor('tempFillColor')
      icon.className = 'q-marker-icon'
      icon.options.className = 'q-marker-icon'
      layer.setIcon(icon)
    }
  }

  const onLayerEdit = ({ layer }) => {
    if (layer.cut) return
    useLayersStore().saveLayer(layer)
  }

  const onLayerTextChange = ({ layer }) => {
    if (layer.options.text !== layer.feature.properties.options.text) {
      debounceSaving(layer)
    }
  }

  const onLayerCut = ({ layer, originalLayer }) => {
    useAppStore().$patch({ selectedTool: 'Select' })
    originalLayer.cut = true
    const layerToSave = merge(layer, {
      feature: {
        properties: originalLayer.feature.properties,
        selected: originalLayer.feature.selected,
        _id: originalLayer.feature._id
      }
    })
    // console.log('onLayerCut', { layer, originalLayer })
    // const _id = originalLayer.feature._id
    // const { name, description } = originalLayer.feature.properties
    // const icon = getIcon(layer.feature.geometry.type)
    useLayersStore().saveLayer(layerToSave)
  }

  const onLayerRotate = ({ layer, originalLayer }) => {
    useAppStore().$patch({ selectedTool: 'Select' })
  }

  const onLayerRemove = e => {
    // console.log('remove', e.layer._removeIcon())
    // e.layer._removeIcon()

    // useAppStore().$patch({ selectedTool: 'Select' })
    // $l.DomEvent.stopPropagation(e)
    const _id = e.layer._id || e.layer.feature?._id
    // console.log('On Layer remove', _id)
    if (_id) {
      useLayersStore().removeLayer({ _id })
    }
    if (e.layer.feature.properties.type === 'Marker') {
      e.layer.getElement().remove()
    }
  }

  // const selectLayers = layersIds => {
  //   for (const layerId of layersIds) { // eslint-disable-line
  //     console.log($drawingGroup.getLayer(layerId))
  //     $drawingGroup.getLayer(layerId).pm.enable()
  //     // console.log('---')
  //   }
  // }
  const onKeyDownDelete = e => {
    if (!drawerItemFocused.value) {
      if (!isEmpty(selectedLayersIds.value)) {
        for (const layer of $selectionGroup.value.getLayers()) {
          layer.pm.remove()
        }
      }
    }
  }

  return {
    insertLayer,
    onLayerCreate,
    onLayerRemove,
    onKeyDownDelete,
    onLayerClick
  }
}

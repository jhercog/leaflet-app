import { inject, provide, computed, ref, reactive, toRaw, nextTick } from 'vue' // eslint-disable-line
import { useQuasar } from 'quasar'
import { useLocationsStore, useLayersStore, useAppStore } from 'stores' // eslint-disable-line
import { useLayers, useComponentHtml } from 'composables' // eslint-disable-line
import { isEmpty } from 'lodash'

export const useMap = () => {
  const $q = useQuasar()
  const $l = inject('$l')
  // const $map = ref(null)
  const $map = computed({
    get: () => toRaw(useAppStore().map),
    set: map => (useAppStore().$patch({ map: toRaw(map) }))
  })
  provide('$map', $map)

  const $baseGroup = computed(() => useAppStore().baseGroup)
  const $drawingGroup = computed(() => useAppStore().drawingGroup)
  const $selectionGroup = computed(() => useAppStore().selectionGroup) // eslint-disable-line
  const $vectorLayer = computed(() => useAppStore().vectorLayer)
  const currentGeolocation = computed(() => useAppStore().currentGeolocation)

  // const $baseGroup = inject('$baseGroup')
  // const $drawingGroup = inject('$drawingGroup')
  // const $vectorLayer = inject('$vectorLayer')

  const { insertLayer, onLayerCreate, onLayerRemove, onKeyDownDelete } = useLayers() // eslint-disable-line
  const features = computed(() => useLayersStore().features)
  const loadingMap = ref(true)

  const onMapClick = e => { // eslint-disable-line
    // e.originalEvent.preventDefault()
    // $l.DomEvent.stop(e)
    $l.DomEvent.stop(e)
    const layers = $selectionGroup.value.getLayers()
    if (!isEmpty(layers)) {
      for (const layer of layers) {
        layer.pm.disable()
      }
    }
    // $map.value.pm.disableGlobalEditMode()
    // $map.value.pm.disableGlobalDragMode() // Sjebe marker
    // $map.value.pm.disableGlobalCutMode()
    // $map.value.pm.disableGlobalRotateMode()
    // $map.value.pm.disableGlobalRemovalMode()
    // $map.value.pm.disableDraw()

    for (const layer of $selectionGroup.value.getLayers()) {
      layer.disable()
    }

    // toRaw($map.value).pm.disableGlobalEditMode()
    // if (!$map.value.pm.globalDrawModeEnabled()) {
    // $map.value.pm.disableGlobalEditMode()
    // $map.value.pm.disableGlobalRotateMode()
    // useAppStore().deselectLayers({ all: true })
    // }
    // if (e.target.pm.globalDragModeEnabled()) {
    //   $map.value.target.pm.disableGlobalDragMode()
    // }
    // if (e.target.pm.globalDragModeEnabled()) {
    //   $map.value.target.pm.disableGlobalDragMode()
    // }
  }

  const onLocationFound = e => {
    $q.loadingBar.stop()
    useAppStore().updateCurrentGeolocation(e)
    $map.value.flyToBounds(e.bounds, { padding: [50, 50] })
  }

  const onLocationError = e => {

  }

  const onDrag = e => { // eslint-disable-line
    // const layer = e.layer || e.target
    // if (layer.pm) {
    //   if (layer.pm._initMarkers) {
    //     layer.pm._initMarkers()
    //   }
    //   if (layer.pm.applyOptions) {
    //     layer.pm.applyOptions()
    //   }
    // }
  }

  const onDrawEnd = e => { // eslint-disable-line

  }

  const onKeydown = e => {
    e.stopPropagation()
    if (e.key === 'Delete' || e.key === 'Backspace') {
      onKeyDownDelete(e)
    }
  }

  const createMap = async () => {
    // const currentGeolocation = useAppStore().currentGeolocation

    if (!$map.value) {
      $map.value = $l.map('mapContainer', {
        maxBounds: [[-90, -180], [90, 180]],
        zoomControl: false,
        doubleClickZoom: false,
        boxZoom: false,
        center: currentGeolocation.value.val.latlng,
        zoom: 13

      })

      // useAppStore().$patch({ map: $map.value })

      $map.value.attributionControl.setPrefix(false)
      $map.value.pm.setGlobalOptions({ layerGroup: $drawingGroup.value })

      for (const feature of features.value) {
        insertLayer(feature)
      }

      $baseGroup.value.addLayer($vectorLayer.value)
      $map.value.addLayer($baseGroup.value)
      $map.value.addLayer($drawingGroup.value)
      // $map.value.pm.addControls({
      //   position: 'topright',
      //   drawCircle: false
      // })

      $map.value.on('click', onMapClick)
      // $map.value.on('mouseup', e => {
      //   console.log('mouseup')
      // })
      $map.value.on('locationfound', onLocationFound)
      $map.value.on('locationerror', onLocationError)
      $map.value.on('pm:create', onLayerCreate)
      $map.value.on('pm:drag', e => onDrag)
      $map.value.on('pm:drawend', e => onDrawEnd)

      $map.value.whenReady(async () => {
        loadingMap.value = false
        let { bounds } = currentGeolocation.value.val
        if (!isEmpty($drawingGroup.value.getBounds())) {
          bounds = $drawingGroup.value.getBounds()
        }

        setTimeout(() => {
          $map.value.flyToBounds(bounds, { padding: [50, 50] })
        }, 300)
      })
    }
  }

  const destroyMap = () => {
    const mapContainer = $l.DomUtil.get('mapContainer')
    if (mapContainer?._leaflet_id != null) {
      mapContainer._leaflet_id = null
    }
  }

  const resizeMap = (size) => {
    $map.value?.invalidateSize()
    $map.value?.setMinZoom($map.value.getBoundsZoom([[-90, -180], [90, 180]], true))
  }

  return {
    loadingMap,
    createMap,
    destroyMap,
    resizeMap,
    onKeydown,
    onMapClick
  }
}

import { inject, ref, computed, toRaw } from 'vue'
import { useQuasar, colors } from 'quasar'
import { useLocationsStore, useAppStore } from 'stores'
import { nanoid } from 'nanoid'
import { isEmpty, merge } from 'lodash'

export const useControls = () => {
  const { getPaletteColor } = colors
  const $q = useQuasar()
  const $l = inject('$l') // eslint-disable-line
  const Draw = new $l.PM.Draw() // eslint-disable-line
  // const $map = inject('$map')
  const $map = computed(() => toRaw(useAppStore().map))
  const $baseGroup = computed(() => useAppStore().baseGroup)
  const $drawingGroup = computed(() => useAppStore().drawingGroup)
  const $selectionGroup = computed(() => useAppStore().selectionGroup)
  const $vectorLayer = computed(() => useAppStore().vectorLayer)
  const $imageLayer = computed(() => useAppStore().imageLayer)
  const color = computed(() => useAppStore().tempColor)
  const fillColor = computed(() => useAppStore().tempFillColor)

  const disableAll = () => {
    $map.value.pm.disableGlobalEditMode()
    $map.value.pm.disableGlobalDragMode()
    $map.value.pm.disableGlobalCutMode()
    $map.value.pm.disableGlobalRotateMode()
    $map.value.pm.disableGlobalRemovalMode()
    $map.value.pm.disableDraw()
  }

  const baseOptions = {
    snappable: true,
    snapDistance: 10,
    snapMiddle: true,
    snapSegment: true,
    requireSnapToFinish: false,
    tooltips: false,
    allowSelfIntersection: true,
    finishOn: 'dblclick',
    continueDrawing: false,
    //
    featureId: nanoid(),
    featureDescription: 'No description'
  }

  const { setCurrentGeolocation } = useLocationsStore() // eslint-disable-line

  const baselayerIcon = ref('mdi-earth')
  const baselayerTtTxt = ref('Show Satellite')
  const editDragEnabled = ref(false) // eslint-disable-line

  const tempFillColor = computed(() => useAppStore().tempFillColor)
  const tempColor = computed(() => useAppStore().tempColor)

  const selectedTool = computed({
    get: () => useAppStore().selectedTool,
    set: selectedTool => (useAppStore().$patch({ selectedTool }))
  })

  // Drawing Controls
  const drawMarker = () => {
    selectedTool.value = 'Marker'
    disableAll()
    console.log()
    $map.value.pm.enableDraw('Marker', merge(baseOptions, {
      featureName: 'Untitled Marker',
      featureIcon: 'mdi-map-marker',
      cursorMarker: true,
      markerEditable: false,
      markerStyle: {
        icon: useAppStore().markerIcon,
        color: useAppStore().tempColor
      }
    }))
  }

  const drawCircleMarker = () => {
    selectedTool.value = 'CircleMarker'
    disableAll()
    $map.value.pm.enableDraw('CircleMarker', merge(baseOptions, {
      featureName: 'Untitled Circle Marker',
      featureIcon: 'mdi-map-marker-circle',
      templineStyle: { color: color.value },
      hintlineStyle: { color: fillColor.value },
      pathOptions: {
        color: color.value,
        fillColor: fillColor.value,
        fillOpacity: 0.2,
        weight: 2
      }
    }))
  }

  const drawLine = () => {
    selectedTool.value = 'Line'
    disableAll()
    $map.value.pm.enableDraw('Line', merge(baseOptions, {
      featureName: 'Untitled Polyline',
      featureIcon: 'mdi-vector-polyline',
      templineStyle: { color: color.value },
      hintlineStyle: { color: fillColor.value },
      pathOptions: {
        color: color.value,
        weight: 2
      }
    }))
  }

  const drawPolygon = () => {
    selectedTool.value = 'Polygon'
    disableAll()
    $map.value.pm.enableDraw('Polygon', merge(baseOptions, {
      featureName: 'Untitled Polygon',
      featureIcon: 'mdi-vector-polygon-variant',
      templineStyle: { color: color.value },
      hintlineStyle: { color: fillColor.value },
      pathOptions: {
        color: color.value,
        fillColor: fillColor.value,
        fillOpacity: 0.2,
        weight: 2
      }
    }))
  }

  const drawRectangle = () => {
    selectedTool.value = 'Rectangle'
    disableAll()
    $map.value.pm.enableDraw('Rectangle', merge(baseOptions, {
      featureName: 'Untitled Rectangle',
      featureIcon: 'mdi-vector-square',
      templineStyle: { color: color.value },
      hintlineStyle: { color: fillColor.value },
      pathOptions: {
        color: color.value,
        fillColor: fillColor.value,
        fillOpacity: 0.2,
        weight: 2
      }
    }))
  }

  const drawCircle = () => {
    selectedTool.value = 'Circle'
    disableAll()
    $map.value.pm.enableDraw('Circle', merge(baseOptions, {
      featureName: 'Untitled Circle',
      featureIcon: 'mdi-vector-circle-variant',
      templineStyle: { color: color.value },
      hintlineStyle: { color: fillColor.value },
      pathOptions: {
        color: color.value,
        fillColor: fillColor.value,
        fillOpacity: 0.2,
        weight: 2
      }
    }))
  }

  const drawText = () => {
    selectedTool.value = 'Text'
    disableAll()
    useAppStore().$patch({ tempColor: getPaletteColor('primary-0') })
    console.log(merge(baseOptions, {
      featureName: 'Untitled Text',
      featureIcon: 'mdi-format-text',
      className: 'q-text-marker',
      color: getPaletteColor('primary-0'),
      fillColor: useAppStore().tempFillColor,
      fillOpacity: 0.2,
      textOptions: {
        className: 'q-text-marker',
        text: 'Enter some text...'
      }
    }))
    $map.value.pm.enableDraw('Text', merge(baseOptions, {
      featureName: 'Untitled Text',
      featureIcon: 'mdi-format-text',
      className: 'q-text-marker',
      color: getPaletteColor('primary-0'),
      fillColor: useAppStore().tempFillColor,
      fillOpacity: 0.2,
      textOptions: {
        className: 'q-text-marker',
        text: 'Enter some text...'
      }
    }))
  }

  // Transform Controls
  const selectLayer = () => {
    selectedTool.value = 'Select'
    disableAll()
    // $map.value.pm.disableGlobalEditMode()
    // $map.value.pm.disableGlobalDragMode()
    // $map.value.pm.disableGlobalCutMode()
    // $map.value.pm.disableGlobalRotateMode()
    // $map.value.pm.disableGlobalRemovalMode()
    // $map.value.pm.disableDraw()
  }

  const dragLayer = () => {
    selectedTool.value = 'Drag'
    disableAll()
    // const selectedLayers = $selectionGroup.getLayers()
    // for (const layer of selectedLayers) {
    //   layer.pm.enableLayerDrag()
    // }
    //
    const layers = $drawingGroup.value.getLayers()
    for (const layer of layers) {
      layer.pm.enableLayerDrag()
    }

    // $map.value.pm.enableGlobalDragMode()
    // $selectionGroup.pm.enableGlobalDragMode()

    // if (!editDragEnabled.value) {
    //   console.log('drag')
    //   const layers = $l.PM.Utils.findLayers($map.value)
    //   layers.forEach((layer) => {
    //     layer.pm.enableLayerDrag()
    //     layer.pm.enable()
    //   })
    //   editDragEnabled.value = true
    // } else {
    //   console.log('undrag')
    //   // enable another mode to disable it then
    //   $map.value.pm.enableGlobalDragMode()
    //   $map.value.pm.disableGlobalDragMode()
    //   editDragEnabled.value = false
    // }
  }

  const cutLayer = () => {
    selectedTool.value = 'Cut'
    disableAll()
    $map.value.pm.enableDraw('Cut', merge(baseOptions, {
      templineStyle: { color: 'red', weight: 2, dashArray: '10 10' },
      hintlineStyle: { color: 'red', weight: 2, dashArray: '10 10' },
      layersToCut: $selectionGroup.value.getLayers()
    }))
  }

  const rotateLayer = () => {
    disableAll()
    selectedTool.value = 'Rotate'
    $map.value.pm.enableGlobalRotateMode()
    // const layers = $drawingGroup.value.getLayers()
    // for (const layer of layers) {
    //   console.log(toRaw(layer))
    //   toRaw(layer).pm.enableRotate()
    // }
  }

  const removeLayer = () => {
    disableAll()
    selectedTool.value = 'Remove'
    $map.value.pm.enableGlobalRemovalMode()
  }

  // View Controls
  const zoomIn = () => {
    $map.value.setZoom($map.value.getZoom() + 1)
  }

  const zoomOut = () => {
    $map.value.setZoom($map.value.getZoom() - 1)
  }

  const toggleBaselayer = () => {
    $q.loadingBar.start()
    switch ($baseGroup.value.base) {
      case 'vector':
        $imageLayer.value.addTo($baseGroup.value)
        $baseGroup.value.removeLayer($vectorLayer.value)
        $baseGroup.value.base = 'image'
        baselayerIcon.value = 'mdi-web'
        baselayerTtTxt.value = 'Show Vector'
        break
      case 'image':
        $vectorLayer.value.addTo($baseGroup.value)
        $baseGroup.value.removeLayer($imageLayer.value)
        $baseGroup.value.base = 'vector'
        baselayerIcon.value = 'mdi-earth'
        baselayerTtTxt.value = 'Show Satellite'
        break
    }
    $q.loadingBar.stop()
  }

  const locateUser = async () => {
    $q.loadingBar.start()
    $map.value.locate({ enableHighAccuracy: true, maxZoom: 19 })
    // $map.value.locate()
    // const currentGeolocation = await setCurrentGeolocation()
  }

  const fitToBoundaries = () => {
    let { bounds } = useAppStore().currentGeolocation.val
    if (!isEmpty($drawingGroup.value.getBounds())) {
      bounds = $drawingGroup.value.getBounds()
    }
    $map.value.flyToBounds(bounds, { padding: [50, 50] })
  }

  const fitToSelection = () => {
    if (!isEmpty($selectionGroup.value.getLayers())) {
      $map.value.flyToBounds($selectionGroup.value.getBounds(), { padding: [50, 50] })
    }
  }

  return {
    drawMarker,
    drawCircleMarker,
    drawLine,
    drawPolygon,
    drawRectangle,
    drawCircle,
    drawText,
    //
    selectLayer,
    dragLayer,
    cutLayer,
    rotateLayer,
    removeLayer,
    //
    zoomIn,
    zoomOut,
    toggleBaselayer,
    locateUser,
    fitToBoundaries,
    fitToSelection,
    //
    baselayerIcon,
    baselayerTtTxt,
    tempFillColor,
    tempColor
  }
}

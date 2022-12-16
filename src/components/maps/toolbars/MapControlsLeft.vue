<template>
  <div class="q-controls q-controls__left">
    <q-list class="q-list--toolbar">
      <MapControl
        v-for="(control, i) in drawingToolbar"
        :key="i"
        v-bind="control"
      />
    </q-list>

    <q-list class="q-list--toolbar">
      <MapControl
        v-for="(control, i) in transformToolbar"
        :key="i"
        v-bind="control"
      />
    </q-list>

    <q-list class="q-list--toolbar">
      <MapControl
        v-for="(control, i) in propertiesToolbar"
        :key="i"
        v-bind="control"
      />
    </q-list>
  </div>
</template>

<script setup>
import { reactive, shallowRef } from 'vue'
// import { useAppStore } from 'stores'
import { useControls } from 'composables'
import MapControl from 'components/maps/toolbars/MapControl.vue'
import ColorPicker from 'components/maps/toolbars/ColorPicker.vue'

// const { draw } = useAppStore()
const ttPos = 'right'
const {
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
  tempFillColor,
  tempColor
} = useControls()

const drawingToolbar = reactive([
  {
    name: 'Marker',
    icon: 'mdi-map-marker',
    ttTxt: 'Draw Marker',
    ttPos,
    onClick: drawMarker
  },
  {
    name: 'CircleMarker',
    icon: 'mdi-map-marker-circle',
    ttTxt: 'Draw Circle Marker',
    ttPos,
    active: false,
    onClick: drawCircleMarker
  },
  {
    name: 'Line',
    icon: 'mdi-vector-polyline',
    ttTxt: 'Draw Polyline',
    ttPos,
    active: false,
    onClick: drawLine
  },
  {
    name: 'Polygon',
    icon: 'mdi-vector-polygon-variant',
    ttTxt: 'Draw Polygon',
    ttPos,
    active: false,
    onClick: drawPolygon
  },
  {
    name: 'Rectangle',
    icon: 'mdi-vector-square',
    ttTxt: 'Draw Rectangle',
    ttPos,
    active: false,
    onClick: drawRectangle
  },
  {
    name: 'Circle',
    icon: 'mdi-vector-circle-variant',
    ttTxt: 'Draw Circle',
    ttPos,
    active: false,
    onClick: drawCircle
  },
  {
    name: 'Text',
    icon: 'mdi-format-text',
    ttTxt: 'Draw Text',
    ttPos,
    active: false,
    onClick: drawText
  }
])

const transformToolbar = reactive([
  {
    name: 'Select',
    icon: 'mdi-cursor-default',
    ttTxt: 'Select Layer',
    ttPos,
    active: true,
    onClick: selectLayer
  },
  {
    name: 'Drag',
    icon: 'mdi-cursor-move',
    ttTxt: 'Drag Layer',
    ttPos,
    active: false,
    onClick: dragLayer
  },
  {
    name: 'Cut',
    icon: 'mdi-box-cutter',
    ttTxt: 'Cut Layer',
    ttPos,
    active: false,
    onClick: cutLayer
  },
  {
    name: 'Rotate',
    icon: 'mdi-format-rotate-90',
    ttTxt: 'Rotate Layer',
    ttPos,
    active: false,
    onClick: rotateLayer
  },
  {
    name: 'Remove',
    icon: 'mdi-delete',
    ttTxt: 'Remove Layer',
    ttPos,
    active: false,
    onClick: removeLayer
  }
])

const propertiesToolbar = reactive([
  {
    icon: 'mdi-square',
    iconColor: tempFillColor,
    ttTxt: 'Fill Color',
    ttPos,
    menu: {
      menuPos: 'right',
      component: shallowRef(ColorPicker),
      componentProps: {
        label: 'Fill Color',
        type: 'fillColor',
        size: 150
      }
    }
  },
  {
    icon: 'mdi-square-outline',
    iconColor: tempColor,
    ttTxt: 'Stroke Color',
    ttPos,
    menu: {
      menuPos: 'right',
      component: shallowRef(ColorPicker),
      componentProps: {
        label: 'Stroke Color',
        type: 'color',
        size: 150
      }
    }
  }
])

</script>

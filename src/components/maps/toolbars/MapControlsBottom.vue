<template>
  <div class="q-controls q-controls__bottom">
    <q-list class="q-list--toolbar horizontal">
      <MapControl
        v-for="(control, i) in viewToolbar"
        :key="i"
        v-bind="control"
      />
    </q-list>
  </div>
</template>

<script setup>
import { reactive } from 'vue' // eslint-disable-line
import { useControls } from 'composables'
import MapControl from 'components/maps/toolbars/MapControl.vue'

const ttPos = 'top'
const {
  zoomIn,
  zoomOut,
  toggleBaselayer,
  locateUser,
  fitToBoundaries,
  fitToSelection,
  baselayerIcon,
  baselayerTtTxt
} = useControls()

// const toggleBaselayerTool = reactive({ icon: baselayerIcon.value, ttTxt: baselayerTtTxt.value, ttPos, onClick: toggleBaselayer })

const viewToolbar = reactive([
  { icon: 'mdi-plus', ttTxt: 'Map Zoom In', ttPos, onClick: zoomIn },
  { icon: 'mdi-minus', ttTxt: 'Map Zoom Out', ttPos, onClick: zoomOut },
  { icon: baselayerIcon, ttTxt: baselayerTtTxt, ttPos, onClick: toggleBaselayer },
  { icon: 'mdi-crosshairs-gps', ttTxt: 'Locate Me', ttPos, onClick: locateUser },
  { icon: 'mdi-fit-to-screen-outline', ttTxt: 'Fit to Boundaries', ttPos, onClick: fitToBoundaries },
  { icon: 'mdi-fit-to-screen', ttTxt: 'Fit to Selection', ttPos, onClick: fitToSelection }
])
</script>

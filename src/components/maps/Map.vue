<template>
  <div
    id="mapContainer"
    :style="{fontFamily: 'IbM Plex Sans'}"
    class="bg-primary-9"
  >
    //@click.stop="onMapClick"
    //@touchstart.passive.stop
    //@mousedown.passive.stop
    <MapControlsLeft />
    <MapControlsBottom />
    <Loader :loading="loadingMap" />
    <q-resize-observer
      debounce="100"
      @resize="resizeMap"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useMap } from 'composables'
import Loader from 'components/Loader.vue'
import MapControlsLeft from 'components/maps/toolbars/MapControlsLeft.vue'
import MapControlsBottom from 'components/maps/toolbars/MapControlsBottom.vue'

const { loadingMap, createMap, destroyMap, resizeMap, onKeydown, onMapClick } = useMap() // eslint-disable-line
// const loadingMap = ref(true)

onMounted(() => {
  destroyMap()
  createMap()
  addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  removeEventListener('keydown', onKeydown)
})
</script>

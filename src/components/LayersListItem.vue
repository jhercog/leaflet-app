<template>
  <!-- <q-item
    clickable
    :active="selected"
    @click="selectLayer"
  > -->
  <q-expansion-item
    expand-separator
    expand-icon-toggle
    clickable
    :active="selected"
    @click="selectLayer"
  >
    <template #header>
      <q-item-section
        v-if="featureIcon"
        avatar
        :style="{minWidth: 0}"
      >
        <q-icon :name="featureIcon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <input
            v-model="featureName"
            type="text"
            @focus="drawerItemFocused = true"
            @blur="drawerItemFocused = false"
            @input="onChangeName"
          >
        </q-item-label>
        <q-item-label caption>
          <input
            v-model="featureDescription"
            type="text"
            @focus="drawerItemFocused = true"
            @blur="drawerItemFocused = false"
            @input="onChangeDescription"
          >
        </q-item-label>
      </q-item-section>
    </template>
    <q-card class="bg-primary-10 text-primary-4">
      <q-card-section>
        <pre>{{ $drawingGroup.getLayer(props._leaflet_id).toGeoJSON() }}</pre>
      </q-card-section>
    </q-card>
  </q-expansion-item>
  <!-- </q-item> -->
</template>

<script setup>
import { computed } from 'vue'
import { debounce } from 'quasar'
import { useAppStore, useLayersStore } from 'stores'
import { useLayers } from 'composables'

const { onLayerClick } = useLayers()

const props = defineProps({
  _id: { type: String, default: '' }, // eslint-disable-line
  _leaflet_id: { type: Number, default: '' }, // eslint-disable-line
  featureName: { type: String, default: '' },
  featureDescription: { type: String, default: '' },
  featureIcon: { type: String, default: '' },
  selected: { type: Boolean, default: false },
  geometry: { type: Object, default: null }
})

const $drawingGroup = computed(() => useAppStore().drawingGroup)
const layer = computed(() => $drawingGroup.value.getLayer(props._leaflet_id))
const geoJson = computed(() => layer.value.toGeoJSON()) // eslint-disable-line
const drawerItemFocused = computed({ // eslint-disable-line
  get: () => useAppStore().drawerItemFocused,
  set: val => useAppStore().$patch({ drawerItemFocused: val })
})
const featureName = computed({
  get: () => props.featureName,
  set: val => {
    layer.value.options.featureName = val
    layer.value.feature.properties.options.featureName = val
    debounceSaving(layer.value)
  }
})
const featureDescription = computed({
  get: () => props.featureDescription,
  set: val => {
    layer.value.options.featureDescription = val
    layer.value.feature.properties.options.featureDescription = val
    debounceSaving(layer.value)
  }
})

const debounceSaving = debounce(layer => (useLayersStore().saveLayer(layer))) // eslint-disable-line

const selectLayer = () => {
  onLayerClick({ target: layer.value })
}
console.log(props.geometry)
</script>

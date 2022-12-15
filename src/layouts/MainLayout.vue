<template>
  <q-layout
    view="hHr lpr fFr"
    container
  >
    <q-header elevated>
      <q-toolbar>
        <q-icon
          name="mdi-earth"
          size="1.5rem"
          color="accent"
        />
        <q-toolbar-title class="text-bold text-subtitle1 text-primary-2">
          Open Range <span class="text-primary-6 text-weight-regular"> | demo app</span>
        </q-toolbar-title>

        <q-btn
          flat
          round
          dense
          icon="mdi-menu"
          class="text-primary-2"
          @click="drawerOpened = !drawerOpened"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerOpened"
      side="right"
      :width="400"
    >
      <q-scroll-area :style="{ paddingTop: `${headerHeight}px` }">
        <q-list class="q-list--drawer">
          <q-item v-if="layers.length === 0">
            <q-item-section
              avatar
              :style="{ minWidth: 0 }"
            >
              <q-icon name="mdi-layers-off-outline" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold">
                No Layers
              </q-item-label>
              <q-item-label caption>
                Please draw some layers
              </q-item-label>
            </q-item-section>
          </q-item>
          <LayersListItem
            v-for="layer in layers"
            :key="layer._id"
            v-bind="layer"
          />
        </q-list>
      </q-scroll-area>

      <q-list
        class="q-list--header"
        :style="{ height: `${headerHeight}px` }"
      >
        <q-item>
          <q-item-section
            avatar
            :style="{ minWidth: 0 }"
          >
            <q-icon name="mdi-layers" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">
              Drawn Layers
            </q-item-label>
            <q-item-label caption>
              {{ layers.length }} objects drawn
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div
        class="z-top absolute-bottom-right text-primary-6 q-mx-sm q-my-xs"
        :style="{ fontSize: '0.625rem', lineHeight: '1rem' }"
      >
        <a
          href="https://vuejs.org/"
          target="_blank"
        >Vue</a> · <a
          href="https://quasar.dev/"
          target="_blank"
        >Quasar</a> · <a
          href="https://leafletjs.com/"
          target="_blank"
        >Leaflet</a> · <a
          href="https://geoman.io/"
          target="_blank"
        >Geoman</a> · <a
          href="https://dexie.org/"
          target="_blank"
        >Dexie</a>
      </div>
    </q-drawer>

    <q-page-container>
      <RouterView />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import LayersListItem from 'components/LayersListItem.vue'
import { ref, computed } from 'vue'
import { useLayersStore, useAppStore } from 'stores' // eslint-disable-line
import { RouterView } from 'vue-router'

const $drawingGroup = computed(() => useAppStore().drawingGroup)
const features = computed(() => useLayersStore().features)
const headerHeight = ref(48)

const layers = computed(() => {
  return $drawingGroup.value.getLayers().map(l => {
    return {
      _id: l.feature?._id ?? '',
      _leaflet_id: l._leaflet_id,
      featureName: l.feature?.properties.options.featureName ?? '',
      featureDescription: l.feature?.properties.options.featureDescription ?? '',
      featureIcon: l.feature?.properties.options.featureIcon ?? '',
      selected: features.value.find(f => f._id === l.feature?._id)?.selected ?? false,
      geometry: l.feature?.geometry
    }
  })
})

const drawerOpened = computed({
  get: () => useAppStore().drawerOpened.val,
  set: val => {
    useAppStore().toggleDrawer(val)
  }
})

</script>

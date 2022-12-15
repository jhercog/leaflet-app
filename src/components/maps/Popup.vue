<template>
  <div
    v-if="title"
    class="leaflet-popup-content-title"
  >
    {{ title }}
  </div>
  <div class="leaflet-popup-content-caption">
    <template
      v-for="(caption, i) in captions"
      :key="i"
    >
      <div
        v-if="caption.txt.length > 0"
        class="leaflet-popup-content-caption"
      >
        {{ caption.txt }}
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  house_number: { type: String, default: '' }, // eslint-disable-line
  road: { type: String, default: '' },
  suburb: { type: String, default: '' },
  city: { type: String, default: '' },
  city_district: { type: String, default: '' }, // eslint-disable-line
  town: { type: String, default: '' },
  village: { type: String, default: '' }, // Selo
  hamlet: { type: String, default: '' }, // Zaselak
  region: { type: String, default: '' }, // Regija
  municipality: { type: String, default: '' }, // Općina
  postcode: { type: String, default: '' },
  county: { type: String, default: '' },
  country: { type: String, default: '' },
  state: { type: String, default: '' },
  country_code: { type: String, default: '' }, // eslint-disable-line
  building: { type: String, default: '' },
  neighbourhood: { type: String, default: '' },
  leisure: { type: String, default: '' },
  amenity: { type: String, default: '' },
  historic: { type: String, default: '' },
  locality: { type: String, default: '' },
  natural: { type: String, default: '' }, // Prirodna ljepota
  shop: { type: String, default: '' },
  residential: { type: String, default: '' },
  tourism: { type: String, default: '' },
  isolated_dwelling: { type: String, default: '' }, // eslint-disable-line
  craft: { type: String, default: '' },
  'ISO3166-2-lvl6': { type: String, default: '' }, // eslint-disable-line
  'ISO3166-2-lvl4': { type: String, default: '' } // eslint-disable-line
})

const captions = computed(() => [
  { txt: [props.road, props.house_number].filter(Boolean).join(', ') },
  { txt: props.suburb },
  { txt: [props.city, props.county, props.country].filter(Boolean).join(', ') }
])
</script>

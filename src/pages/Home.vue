<template>
  <q-page class="flex flex-center">
    <Map
      ref="mapRef"
    />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useMeta } from 'quasar'
import Map from 'components/maps/Map.vue'

const { title, description } = useRoute().meta
useMeta({ title, description, equiv: { 'http-equiv': 'Content-Security-Policy', content: 'upgrade-insecure-requests' } })

const mapRef = ref(null)
</script>

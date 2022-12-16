<template>
  <q-card class="bg-primary-0">
    <q-card-section
      class="q-px-sm q-pt-sm q-pb-none text-center text-caption text-bold"
      :style="{background: color ?? 'black', color: getContrastingColor()}"
    >
      {{ label }}
    </q-card-section>

    <q-card-section class="q-pa-none">
      <q-color
        v-model="color"
        flat
        square
        no-header-tabs
        no-footer
        class="bg-transparent"
        :style="{width: `${size}px`}"
        @change="onColorChange"
      />
    </q-card-section>

    <q-card-actions class="q-pa-none">
      <q-btn
        flat
        no-caps
        size="sm"
        class="full-width"
      >
        Same as {{ type === 'color' ? 'Fill Color' : 'Stroke Color' }}
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useAppStore } from 'stores'
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import { colors } from 'quasar' // eslint-disable-line

const props = defineProps({
  label: { type: String, default: null },
  type: { type: String, default: null },
  size: { type: Number, default: 150 }
})

const color = computed({
  get: () => useAppStore()[`temp${useChangeCase(props.type, 'pascalCase').value}`],
  set: val => {
    useAppStore().setSelectionColor({ type: props.type, color: val })
  }
})

const getContrastingColor = () => {
  // console.log('wengjemrkjg', colors.luminosity(color.value))
  return 'white'
}
const onColorChange = e => {

}
watch(() => color, val => {
  console.log(val)
})
</script>

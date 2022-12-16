<template>
  <q-item
    v-ripple
    clickable
    class="q-control q-pa-none"
    :style="{minWidth: 0, minHeight: 0}"
    :active="isActive"
    @click.stop="onClick"
  >
    <q-btn
      class="q-pa-xs"
      :style="{minWidth: 0, minHeight: 0}"
      unelevated
    >
      <q-tooltip
        class="bg-primary-10"
        :anchor="align[ttPos].anchor"
        :self="align[ttPos].self"
        :transition-show="align[ttPos].ts"
        :transition-hide="align[ttPos].th"
        :offset="[4, 4]"
      >
        {{ ttTxt }}
      </q-tooltip>
      <q-icon
        :name="icon"
        :style="{color: iconColor}"
      />
      <q-menu
        v-if="!isEmpty(menu)"
        :anchor="align[menu.menuPos].anchor"
        :self="align[menu.menuPos].self"
        :transition-show="align[menu.menuPos].ts"
        :transition-hide="align[menu.menuPos].th"
        :offset="[4, 4]"
      >
        <component
          :is="menu.component"
          v-bind="menu.componentProps"
        />
      </q-menu>
    </q-btn>
  </q-item>
</template>

<script setup>
import { computed } from 'vue'
import { isEmpty } from 'lodash'
import { useAppStore } from 'stores'

const props = defineProps({
  name: { type: String, default: null },
  icon: { type: String, default: 'mdi-help' },
  iconColor: { type: String, default: null },
  ttTxt: { type: String, default: 'Default Tooltip' },
  ttPos: { type: String, default: 'right' },
  active: { type: Boolean, default: false },
  menu: { type: Object, default: () => {} },
  onClick: { type: Function, default: () => {} }
})

const align = {
  top: { anchor: 'top middle', self: 'bottom middle', ts: 'jump-up', th: 'jump-down' },
  right: { anchor: 'center left', self: 'center right', ts: 'jump-left', th: 'jump-right' },
  bottom: { anchor: 'bottom middle', self: 'top middle', ts: 'jump-down', th: 'jump-up' },
  left: { anchor: 'center right', self: 'center left', ts: 'jump-right', th: 'jump-left' }
}

const isActive = computed(() => props.name === useAppStore().selectedTool)
</script>

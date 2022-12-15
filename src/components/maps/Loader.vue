<template>
  <Transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <div
      v-show="loading"
      class="q-page-loader absolute-full flex items-center justify-center z-top bg-primary-10"
    >
      <q-spinner-oval
        color="accent"
        size="6em"
      />
    </div>
  </Transition>
</template>

<script setup>

const props = defineProps({
  loading: { type: Boolean, default: false }
})

</script>

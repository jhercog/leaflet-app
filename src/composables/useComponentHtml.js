import { createApp, h } from 'vue'
import { useQuasar } from 'quasar'

// https://vuejs.org/guide/extras/render-function.html#rendering-slots
export const useComponentHtml = () => {
  const $q = useQuasar()

  const getHtml = (Component, containerClass = null, props = {}, slots = {}, ctx = '') => {
    const el = document.createElement('div')
    if (containerClass) el.classList.add(containerClass)
    const App = createApp({
      setup: () => () => h(Object.assign({}, Component), { ...props })
    // setup: () => () => h(Object.assign({}, Component), { ...props }, () => slots)
    })
    App.config.globalProperties.$q = $q
    App.mount(el)
    el.removeAttribute('data-v-app')
    return el
  }

  return {
    getHtml
  }
}

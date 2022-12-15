import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
export { useAppStore } from './App'
export { useLocationsStore } from './Locations'
export { useLayersStore } from './Layers'
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia()

  pinia.use(({ store }) => {
    store.$clone = function (obj) {
      return JSON.parse(JSON.stringify(obj))
    }
  })

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia
})

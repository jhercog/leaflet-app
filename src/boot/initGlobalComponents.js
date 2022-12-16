import { boot } from 'quasar/wrappers'

export default boot(async ({ app }) => {
  const globalComponents = {
    ColorPicker: await import('src/components/maps/toolbars/ColorPicker.vue')
  }

  for (const key in globalComponents) {
    app.component(key, globalComponents[key].default)
    app.provide(key, globalComponents[key].default)
  }
})

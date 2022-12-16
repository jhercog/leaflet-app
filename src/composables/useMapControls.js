import { ref, resolveComponent, inject } from 'vue' // eslint-disable-line
import { useComponentHtml } from 'composables'
import MapControl from 'components/maps/toolbars/MapControl.vue'

export const useMapControls = () => {
  const $l = inject('$l')
  const { getHtml } = useComponentHtml()

  $l.ToggleBasemaps = $l.Control.extend({
    options: { position: 'topleft' },

    initialize (options) {
      $l.Util.setOptions(this, options)
      this.layers = options.layers
      this.activeIndex = 0
      this.activeLayer = options.layers[0]
      this.icon = ref(null)
    },

    onAdd (map) {
    // const QBtn = resolveComponent('QBtn')
    // const Button = resolveComponent('Button')
      this.activeLayer.layer.addTo(map).bringToBack()
      this.icon.value = this.layers[1].icon
      const control = getHtml(MapControl, 'leaflet-control-container', {
        currentIcon: this.icon,
        map,
        color: 'primary',
        onClick: e => this._nextLayer()
      })
      return control
    },

    onRemove (map) {},

    _nextLayer () {
      const nextIndex = this.activeIndex < this.layers.length - 1 ? this.activeIndex + 1 : 0
      this.icon.value = nextIndex < this.layers.length - 1 ? this.layers[nextIndex + 1].icon : this.layers[0].icon
      this._map.removeLayer(this.activeLayer.layer)
      this.activeIndex = nextIndex
      this.activeLayer = this.layers[nextIndex]
      this.activeLayer.layer.addTo(this._map).bringToBack()
    }
  })

  $l.toggleBasemaps = options => new $l.ToggleBasemaps(options)
}

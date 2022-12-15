import { $l } from 'boot/initApp'
import marker from 'assets/marker-icon.svg'

export const markerIcon = function () {
  // const shadow = require('leaflet/dist/images/marker-shadow.png')
  console.log('get marker')
  const icon = $l.divIcon({
    html: `<div class="q-marker-icon__wrapper" style="color:${this.tempFillColor};">${decodeURIComponent(escape(atob(marker.replace('data:image/svg+xml;base64,', ''))))}</div>`,
    className: 'q-marker-icon',
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    shadowUrl: 'assets/marker-shadow.png',
    shadowSize: [36, 12],
    shadowAnchor: [18, 6],
    color: this.tempFillColor
  })
  return icon
}

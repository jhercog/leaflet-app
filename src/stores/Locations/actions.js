import { db } from 'db'
import { Notify } from 'quasar'

export const getCurrentGeolocation = async function () {
  return db.locations.get({ name: 'currentGeolocation' })
}

export const setCurrentGeolocation = async function (options) {
  options = {
    ...options,
    enableHighAccuracy: true,
    maximumAge: 3e4,
    timeout: 27e3,
    navigator: typeof window !== 'undefined' ? window.navigator : void 0
  }
  const isSupported = options.navigator && 'geolocation' in options.navigator

  let currentGeolocation = await this.getCurrentGeolocation()

  if (isSupported) {
    const permission = await navigator.permissions.query({ name: 'geolocation' })
    switch (permission.state) {
      case 'denied':
        // currentGeolocation = await this.fetchIpifyGeolocation()
        break
      default:
        currentGeolocation = { ...currentGeolocation, ...await this.fetchNavigatorGeolocation(options) }
        break
    }
  } else {
    Notify.create({
      message: 'Geolocation is not supported by this browser.'
    })
  }
  db.locations.put(currentGeolocation)
  return currentGeolocation
}

export const fetchNavigatorGeolocation = async function (options) {
  let position, watcher, currentGeolocation
  try {
    position = await new Promise((resolve, reject) => {
      watcher = navigator.geolocation.watchPosition(pos => resolve(pos.coords), reject, options)
    })
    currentGeolocation = await this.fetchNominatimGeolocation({ lat: position.latitude, lon: position.longitude })
    if (watcher && navigator) navigator.geolocation.clearWatch(watcher)
  } catch (err) {
    console.error(err)
  }

  return currentGeolocation
}

export const fetchNominatimGeolocation = async function ({ lat, lon }) {
  const url = new URL('https://nominatim.openstreetmap.org/reverse?')
  const urlParams = new URLSearchParams({
    lat,
    lon,
    format: 'geojson',
    'accept-language': 'en',
    email: process.env.APP_EMAIL
  })
  url.search = urlParams.toString()

  let geolocation
  try {
    const data = await fetch(url.href, { mode: 'cors' })
    geolocation = await data.json()
  } catch (err) {
    console.error(err)
  }

  return geolocation.features[0]
}

export const fetchIpifyGeolocation = async function () {
  const url = new URL('https://geo.ipify.org/api/v2/country,city')
  const urlParams = new URLSearchParams({ apiKey: process.env.IPIFY_API_KEY })
  url.search = urlParams.toString()
  console.log(url)

  let geolocation
  try {
    const data = await fetch(url.href)
    const json = await data.json()
    const { lat, lng, ...rest } = json.location
    const properties = {
      ...rest,
      as: json.as,
      ip: json.ip,
      isp: json.isp
    }
    const bboxOffset = 2000 / 111139 // 1km each side from center.
    geolocation = {
      bbox: [lng - bboxOffset, lat - bboxOffset, lng + bboxOffset, lat + bboxOffset],
      geometry: {
        coordinates: [lng, lat]
      },
      properties
    }
  } catch (err) {
    // geolocation = fetchNominatimGeolocation()
    console.error(err)
  }

  return geolocation
}

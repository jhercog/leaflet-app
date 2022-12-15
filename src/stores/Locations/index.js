import { defineStore, acceptHMRUpdate } from 'pinia'
import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

export const useLocationsStore = defineStore('locations', {
  state,
  getters: { ...getters },
  actions: { ...mutations, ...actions }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLocationsStore, import.meta.hot))
}

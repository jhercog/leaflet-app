import { defineStore, acceptHMRUpdate } from 'pinia'
import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

export const useAppStore = defineStore('app', {
  state,
  getters: { ...getters },
  actions: { ...mutations, ...actions }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}

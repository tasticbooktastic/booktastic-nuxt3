import { defineStore } from 'pinia'
import api from '~/api'

export const useGroupStore = defineStore({
  id: 'group',
  state: () => ({
    list: {},
    messages: {},
    _remember: {},
  }),
  actions: {
    async fetch(id) {
      // TODO Caching/force
      id = parseInt(id)

      let group = null

      if (!isNaN(id)) {
        group = await api().group.fetch(
          id,
          // TODO How to handle extra information like this which slows down the call?
          true,
          true,
          true,
          true,
          function (data) {
            if (data && data.ret === 10) {
              // Not hosting a group isn't worth logging.
              return false
            } else {
              return true
            }
          }
        )

        if (group) {
          this.list[id] = group
        }
      }

      return group
    },
    remember(id, val) {
      this._remember[id] = val
    },
    async fetchMessages(id) {
      id = parseInt(id)
      const messages = await api().group.fetchMessages(id)

      if (messages) {
        this.messages[id] = messages
      }
    },
  },
  getters: {
    get: (state) => (idOrName) => {
      let ret = null

      if (!isNaN(idOrName)) {
        // Numeric - find by id
        idOrName = parseInt(idOrName)
        return state.list[idOrName] ? state.list[idOrName] : null
      } else {
        // Not - scan for match
        const lower = (idOrName + '').toLowerCase()

        Object.keys(state.list).forEach((key) => {
          const group = state.list[key]
          if (group) {
            if (group.nameshort.toLowerCase() === lower) {
              ret = group
            }
          }
        })
      }

      return ret
    },
    getMessages: (state) => (id) => {
      if (id in state.messages) {
        return state.messages[id]
      } else {
        return []
      }
    },
    remembered: (state) => (id) => state._remember[id],
  },
})

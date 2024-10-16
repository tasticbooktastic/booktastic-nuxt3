import { defineStore } from 'pinia'
import { nextTick } from 'vue'
import api from '~/api'

export const useSearchStore = defineStore({
  id: 'search',
  state: () => ({
    list: [],
    fetching: null,
  }),
  actions: {
    init(config) {
      this.config = config
    },
    async fetch(userid) {
      if (this.fetching) {
        await this.fetching
        await nextTick()
      } else {
        this.fetching = api(this.config).usersearch.fetch(userid)
        this.list = await this.fetching
        this.fetching = null
      }
    },
    async delete(id, userid) {
      await api(this.config).usersearch.del(id)

      await this.fetch(userid)
    },
  },
  getters: {
    get: (state) => (id) => {
      return state.list.find((i) => i.id === id)
    },
  },
})

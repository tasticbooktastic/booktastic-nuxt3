import { defineStore } from 'pinia'
import { nextTick } from 'vue'
import api from '~/api'

export const useShelfStore = defineStore({
  id: 'shelf',
  state: () => ({
    list: {},
    booksByShelf: {},
    all: [],
    forUser: [],
    forGroup: [],
  }),
  actions: {
    init(config) {
      this.config = config
      this.fetching = {}
    },
    async fetch(id, force) {
      try {
        if (force || !this.list[id]) {
          if (this.fetching[id]) {
            await this.fetching[id]
            await nextTick()
          } else {
            this.fetching[id] = api(this.config).shelf.fetch(id, false)
            const item = await this.fetching[id]
            this.list[id] = item
            this.fetching[id] = null
          }
        }
      } catch (e) {
        console.log('Failed to fetch shelf', id, e)
      }

      return this.list[id]
    },
    async fetchAll(id) {
      this.all = (await api(this.config).shelf.list()) || []

      this.all.forEach((shelf) => {
        this.list[shelf.id] = shelf
      })
    },
    async fetchList(id) {
      this.forUser = (await api(this.config).shelf.list(id)) || []
    },
    async fetchBooks(id) {
      const books = await api(this.config).shelf.listBooks(id)

      this.booksByShelf[id] = books
    },
    async fetchGroup(id) {
      this.forGroup = await api(this.config).shelf.listGroup(id)
    },
    async add(data) {
      console.log('Add shelf', data)
      const ret = await api(this.config).shelf.add(data)
      console.log('Returned', ret)

      if (ret?.id) {
        await this.fetch(ret.id, true)
      }

      return ret.id
    },
    async save(data) {
      await api(this.config).shelf.save(data)
      await this.fetch(data.id, true)
    },
    async delete(id) {
      await api(this.config).self.del(id)
      this.list[id] = null
    },
  },
  getters: {
    byId: (state) => (id) => {
      return state.list[id]
    },
    booksById: (state) => (id) => {
      return state.booksByShelf[id]
    },
    allShelves: (state) => {
      return state.all
    },
  },
})

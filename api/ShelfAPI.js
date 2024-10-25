import BaseAPI from '@/api/BaseAPI'

export default class ShelfAPI extends BaseAPI {
  fetch(id, logError = true) {
    return this.$getv2('/shelf/' + id, {}, logError)
  }

  list(id) {
    return this.$getv2('/shelf')
  }

  listGroup(id) {
    return this.$getv2('/shelf/group/' + id)
  }

  listBooks(id) {
    return this.$getv2('/shelf/' + id + '/books')
  }

  save(data) {
    return this.$patchv2('/shelf', data)
  }

  async add(data) {
    console.log('Add to shelf')
    const ret = await this.$putv2('/shelf', data)
    console.log('API call returned', ret)
    return ret
  }

  del(id) {
    return this.$delv2('/shelf', { id })
  }
}

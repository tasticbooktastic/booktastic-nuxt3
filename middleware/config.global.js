import { useMessageStore } from '~/stores/message'
import { useGroupStore } from '~/stores/group'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  // We're having trouble accessing the Nuxt config from within a Pinia store.  So instead we access it here, then
  // pass it in to each store via an init() action.
  const runtimeConfig = useRuntimeConfig()

  const groupStore = useGroupStore()
  const messageStore = useMessageStore()
  const authStore = useAuthStore()

  groupStore.init(runtimeConfig)
  messageStore.init(runtimeConfig)
  authStore.init(runtimeConfig)
})

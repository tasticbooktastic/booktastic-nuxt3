import { defineStore } from 'pinia'
import { LoginError, SignUpError } from '../api/BaseAPI'
import { useComposeStore } from '../stores/compose'
import api from '~/api'

export const useAuthStore = defineStore({
  id: 'auth',
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,

        // We don't persist much about the user, to avoid data getting 'stuck'.  All we need is enough to log us
        // in, and information about which users have been used on this device.
        paths: ['jwt', 'persistent', 'userlist'],
      },
    ],
  },
  state: () => ({
    config: null,
    $api: null,

    // For APIv2
    jwt: null,

    // For APIv2,
    persistent: null,

    forceLogin: false,
    user: null,
    groups: [],
    loggedInEver: false,
    userlist: [],
    loginType: null,
  }),
  actions: {
    init(config) {
      this.config = config
      this.$api = api(config)
    },
    setUser(value) {
      if (value) {
        // Remember that we have successfully logged in at some point.
        this.loggedInEver = true
        this.user = value

        // Ensure we don't store any password (it shouldn't get persisted anyway, but let's be careful).
        delete this.user.password

        this.addRelatedUser(value.id)

        if (this.forceLogin) {
          // We have logged in.
          this.forceLogin = false
        }
      } else if (this.user || this.user === {}) {
        this.user = null
      }
    },
    async addRelatedUser(id) {
      // Keep track of which users we log in as.
      if (!this.userlist) {
        this.userlist = []
      }

      if (!this.userlist.includes(id)) {
        if (this.userlist.length > 9) {
          this.userlist.pop()
        }

        this.userlist.unshift(id)

        // Logged in as multiple users.  Let the server know.
        await this.$api.session.related(this.userlist)
      }
    },
    logout() {
      this.setUser(null)
      this.$api.session.logout()
      this.$axios.defaults.headers.common.Authorization = null
      this.$axios.setToken(false)
    },
    async forget() {
      this.$api.session.forget()
      await this.$api.session.forget()
      await this.logout()
    },
    async login(params) {
      const res = await this.$api.session.login(params)
      const { ret, status, user, persistent } = res

      if (ret === 0 && user) {
        // Successful login.
        //
        // Save the persistent session token.
        this.persistent = persistent

        // Login succeeded.  Set the user, which will trigger various rerendering if we were required to be logged in.
        this.setUser(user)

        // We need to fetch the user again to get the groups, which aren't returned by the login API.
        // TODO Make them, then.
        await this.fetchUser()
      } else {
        // Login failed.
        throw new LoginError(ret, status)
      }
    },
    async lostPassword(params) {
      const res = await this.$axios.post(process.env.API + '/session', {
        action: 'LostPassword',
        email: params.email,
      })

      return res
    },
    async unsubscribe(params) {
      const res = await this.$axios.post(process.env.API + '/session', {
        action: 'Unsubscribe',
        email: params.email,
      })

      return res.data
    },
    async signup(params) {
      const res = await this.$axios.put(process.env.API + '/user', params)
      const { ret, status } = res.data

      if (res.status === 200 && res.data.ret === 0) {
        this.forceLogin = false

        // We need to fetch the user to get the groups, persistent token etc.
        await this.fetchUser()
      } else {
        // Sign up failed.
        throw new SignUpError(ret, status)
      }
    },
    async fetchUser() {
      // We're so vain, we probably think this call is about us.
      const { me, persistent, groups } = await this.$api.session.fetch({
        components: [
          'me',
          'groups',
          'aboutme',
          'phone',
          'notifications',
          'expectedreplies',
        ],
      })

      if (me) {
        // Save the persistent session token.
        this.persistent = persistent

        if (groups && groups.length) {
          this.groups = groups
        } else {
          // We asked for groups but got none, so we're not a member of any.
          this.groups = []
        }

        // Set the user, which will trigger various re-rendering if we were required to be logged in.
        this.setUser(me)

        const composeStore = useComposeStore()
        const email = composeStore.email

        if (me.email && email !== me.email) {
          // Save off our current email from the account for use in post composing.  Old values might be stuck
          // because persisted.
          composeStore.email = me.email
        }
      }
    },
    async saveAboutMe(value) {
      await this.saveAndGet({
        aboutme: value,
      })
    },
    async saveEmail(params) {
      const data = await this.$api.session.save(params)
      await this.fetchUser()
      return data
    },
    async unbounce(params) {
      await this.$api.user.unbounce(params.id)
      this.user.bouncing = 0
    },
    async saveAndGet(params) {
      await this.$api.session.save(params)
      await this.fetchUser()
      return this.user
    },
    async setGroup(params) {
      await this.$api.memberships.update(params)
    },
    async leaveGroup(params) {
      await this.$api.memberships.leaveGroup(params)
      await this.fetchUser()
      return this.user
    },
    async joinGroup(params) {
      await this.$api.memberships.joinGroup(params)
      await this.fetchUser()
      return this.user
    },
    async addRelatedUserUser(params) {
      this.addRelatedUser(params.id)

      if (this.userlist.length > 1) {
        // Logged in as multiple users.  Let the server know.
        await this.$api.session.related(this.userlist)
      }
    },
  },
  getters: {
    member: (state) => (id) => {
      let ret = false

      if (state.user) {
        for (const group of state.groups) {
          if (parseInt(group.id) === parseInt(id)) {
            ret = group.role ? group.role : group.myrole
          }
        }
      }

      return ret
    },
  },
})

<template>
  <div class="d-flex flex-column justify-content-between height">
    <div v-if="!me" class="info d-flex justify-content-around text-center">
      <div>
        <h1 class="text--largest-responsive">
          Booktastic - lend and borrow books with people nearby
        </h1>
        <p class="text--medium-responsive black font-weight-bold">
          This is a proof of concept.
        </p>
        <p>
          Take a photo of a bookshelf and we'll try to identify the books. Make
          sure it's in focus and well-lit. Something like this:
        </p>
        <b-img src="/example.jpg" width="300" class="mb-2" />
        <client-only>
          <BreakpointFettler />
        </client-only>
        <div class="w-100 d-flex justify-content-around">
          <ShelfUpload />
        </div>
      </div>
    </div>
    <MainFooter class="thefooter" />
  </div>
</template>
<script>
import { useRoute } from 'vue-router'
import { buildHead } from '../composables/useBuildHead'
import { useMiscStore } from '../stores/misc'
import MainFooter from '~/components/MainFooter'
import { useRouter } from '#imports'
import BreakpointFettler from '~/components/BreakpointFettler.vue'

export default {
  components: {
    MainFooter,
    BreakpointFettler,
  },
  setup() {
    const runtimeConfig = useRuntimeConfig()
    const route = useRoute()

    const head = buildHead(
      route,
      runtimeConfig,
      'Booktastic - distributed local library, only with a snappier name.',
      "This is a proof of concept.  We'll explain what it is later.",
      null,
      {
        class: 'landing',
      }
    )

    useHead(head)

    // Preload some images to speed page load.
    // TODO
    const miscStore = useMiscStore()

    return {
      miscStore,
    }
  },
  data() {
    return {
      userWatch: null,
      ourBackground: false,
      timeToPlay: false,
    }
  },
  computed: {
    breakpoint() {
      // We show different stuff on xs screens.  In SSR we can't tell what the screen size will be.  But removing
      // the irrelevant option from the DOM once the client loads will save some network/CPU.
      const store = useMiscStore()

      return process.server ? null : store.breakpoint
    },
  },
  mounted() {
    if (process.client) {
      if (this.me) {
        this.goHome()
      }
    }
  },
  beforeUnmount() {
    if (this.userWatch) {
      this.userWatch()
    }
  },
  methods: {
    goHome() {
      const nextroute = '/browse'
      const router = useRouter()
      const route = useRoute()

      console.log('route', route)
      this.$nextTick(() => {
        router.push(nextroute)
      })
    },
  },
}
</script>
<style scoped lang="scss">
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins/_breakpoints';

.black {
  color: $color-black !important;
}

.shadow {
  box-shadow: 0px 0px 20px 10px grey !important;

  @include media-breakpoint-down(md) {
    box-shadow: 0px 0px 10px 5px grey !important;
  }

  @include media-breakpoint-down(md) {
    box-shadow: none;
  }
}

.iconlarge {
  min-width: 48px;
}

.thefooter {
  position: fixed;
  bottom: 50px;
  margin-left: 50px;
  margin-right: 50px;
}

main {
  margin-top: 0px;
}
</style>

<template>
  <OurUploader v-model="currentAtts" class="bg-white" />
</template>
<script setup>
import { useShelfStore } from '~/stores/shelf'
import { useRouter } from '#imports'

const currentAtts = ref([])

const shelfStore = useShelfStore()

const uploadedId = ref(null)
let uploaded = false

watch(
  currentAtts,
  async (newVal, oldVal) => {
    console.log('currentAtts', newVal)

    if (newVal?.length && !uploaded) {
      uploaded = true

      // We've uploaded an image to TUSD - let's save it to the server.
      console.log('Add via store')
      uploadedId.value = await shelfStore.add(newVal[0])

      if (uploadedId.value) {
        console.log('Added', uploadedId.value)
        const router = useRouter()
        router.push(`/shelf/${uploadedId.value}`)
      }
    }
  },
  {
    deep: true,
  }
)
</script>

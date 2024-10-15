<template>
  <div>
    <div v-if="uploaded">
      <NuxtImg width="200" :src="uploaded.externaluid" provider="weserv" />
      <div class="small">Image ID: {{ uploaded.id }}</div>
      <div class="small">Image UID: {{ uploaded.externaluid }}</div>
    </div>
    <OurUploader v-else v-model="currentAtts" class="bg-white" />
  </div>
</template>
<script setup>
import { useShelfStore } from '~/stores/shelf'

const currentAtts = ref([])

const shelfStore = useShelfStore()

const uploadedId = ref(null)
const uploaded = computed(() => {
  return shelfStore.byId(uploadedId.value)
})

watch(
  currentAtts,
  async (newVal) => {
    console.log('currentAtts', newVal)

    if (newVal?.length) {
      // We've uploaded an image to TUSD - let's save it to the server.
      console.log('Add via store')
      uploadedId.value = await shelfStore.add(newVal[0])
    }
  },
  {
    deep: true,
  }
)
</script>

<template>
  <div>
    <OurUploader v-model="currentAtts" class="bg-white" />
    <div v-for="att in currentAtts" :key="att.id">
      <NuxtImg width="200" :src="delivery + '/' + att.ouruid" />
    </div>
  </div>
</template>
<script setup>
const currentAtts = ref([])

const runtimeConfig = useRuntimeConfig()
const delivery = runtimeConfig.public.IMAGE_DELIVERY
</script>

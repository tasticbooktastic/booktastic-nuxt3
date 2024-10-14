<template>
  <div>
    <OurUploader v-model="currentAtts" class="bg-white" />
    <div v-for="att in currentAtts" :key="att.id">
      <div class="d-flex flex-column text-center">
        <NuxtImg width="200" :src="att.ouruid" provider="weserv" />
        Image: {{ att.ouruid }}
      </div>
    </div>
  </div>
</template>
<script setup>
const currentAtts = ref([])
</script>

<template>
  <div>
    <h1>Shelf</h1>
    <p v-if="processing" class="pulsate">Processing image...</p>
    <p v-else>Image processed:</p>
    <ul>
      <li v-for="book in books" :key="book.id">
        <strong>
          {{ book.title }}
        </strong>
        &nbsp;<em>{{ authorsString(book.authors) }}</em>
        <span class="small text-faded"> ISBN {{ book.isbn13 }} </span>
      </li>
    </ul>
    <div v-if="shelf">
      <NuxtImg width="100vw" :src="shelf.externaluid" provider="weserv" />
      <div class="small">Image ID: {{ shelf.id }}</div>
      <div class="small">Image UID: {{ shelf.externaluid }}</div>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { useShelfStore } from '~/stores/shelf'

const route = useRoute()
const id = parseInt(route.params.id)

const processing = ref(true)

const shelfStore = useShelfStore()

const books = computed(() => shelfStore.booksById(id))
const shelf = computed(() => shelfStore.byId(id))

async function checkProcessed() {
  await shelfStore.fetch(id, true)

  if (shelf.value.processed) {
    // Processed, get the books
    processing.value = false
    await shelfStore.fetchBooks(id)
  } else {
    setTimeout(checkProcessed, 1000)
  }
}

function authorsString(authors) {
  return authors.map((a) => a.name).join(', ')
}

onMounted(() => {
  checkProcessed()
})
</script>

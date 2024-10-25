<template>
  <div>
    <h1>Shelf</h1>
    <div v-if="processing">
      <p class="pulsate">Processing image...</p>
      <p>
        This may take a minute or two. If it takes longer than that, something
        has gone wrong.
      </p>
    </div>
    <div v-else>
      <p>Image processed:</p>
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
        <div class="d-flex mb-2">
          <b-button variant="white" class="mr-2" @click="rotateLeft"
            >Rotate Left</b-button
          >
          <b-button variant="white" @click="rotateRight">Rotate Right</b-button>
        </div>
        <NuxtImg
          class="w-100"
          width="100vw"
          :modifiers="mods"
          :src="shelf.externaluid"
          provider="weserv"
        />
        <div class="small">Image ID: {{ shelf.id }}</div>
        <div class="small">Image UID: {{ shelf.externaluid }}</div>
      </div>
      <p>
        You can force the photo to be rescanned. Only really for use when
        debugging, so please don't use it unless you know what you're doing.
      </p>
      <b-button variant="white" @click="reprocess"> Re-process </b-button>
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
const mods = ref({})

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

async function reprocess() {
  const update = shelf.value
  update.processed = false
  await shelfStore.save(update)
  processing.value = true
  checkProcessed()
}

function rotate(deg) {
  let curr = mods.value?.ro || 0
  curr += deg

  // Ensure between 0 and 360
  curr = (curr + 360) % 360

  mods.value.ro = curr
}

function rotateLeft() {
  rotate(90)
}

function rotateRight() {
  rotate(-90)
}

onMounted(() => {
  checkProcessed()
})
</script>

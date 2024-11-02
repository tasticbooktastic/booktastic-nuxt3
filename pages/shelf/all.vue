<template>
  <div>
    <b-form-input
      v-model="filter"
      type="search"
      placeholder="Type to filter data (e.g. on Rating)"
    ></b-form-input>

    <b-table
      striped
      :items="shelves"
      :fields="fields"
      :filter="filter"
      :sort-by="[
        {
          key: 'id',
          order: 'desc',
        },
        {
          key: 'rating',
          order: 'asc',
        },
      ]"
    >
      <template #cell(id)="data">
        <nuxt-link :to="`/shelf/${data.value}`">{{ data.value }}</nuxt-link>
      </template>
      <template #cell(created)="data">
        {{ datetimeshort(data.value) }}
      </template>
      <template #cell(externaluid)="data">
        <nuxt-link :to="`/shelf/${data.item.id}`">
          <NuxtImg height="200px" :src="data.value" provider="weserv" />
        </nuxt-link>
      </template>
      <template #cell(rating)="data">
        <b-badge :variant="ratingVariant(data.value)">{{
          data.value ? data.value : 'Not rated'
        }}</b-badge>
      </template>
    </b-table>
    {{ shelves }}
  </div>
</template>
<script setup>
import { useShelfStore } from '~/stores/shelf'

const shelfStore = useShelfStore()

await shelfStore.fetchAll()

const shelves = computed(() => shelfStore.allShelves)
const fields = [
  {
    key: 'id',
    sortable: true,
  },
  { key: 'created', sortable: true },
  { key: 'externaluid' },
  { key: 'rating', sortable: true, filterByFormatted: true },
]

function ratingVariant(rating) {
  if (rating === 'Bad') {
    return 'danger'
  } else if (rating === 'OK' || !rating) {
    return 'warning'
  } else {
    return 'success'
  }
}

const filter = ref(null)
</script>

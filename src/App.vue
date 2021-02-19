<template>
  <v-app>
    <v-main>
      <calendar />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Calendar from '@/components/Calendar.vue'

@Component({
  components: {
    Calendar
  }
})
export default class App extends Vue {}
</script>

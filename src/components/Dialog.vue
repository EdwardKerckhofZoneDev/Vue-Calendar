<template>
  <v-dialog v-model="event.dialog" max-width="800" persistent>
    <v-card>
      <v-container>
        <v-btn @click="$emit('close')" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-form @submit.prevent="addEvent">
          <v-text-field
            v-model="event.name"
            type="text"
            label="event name (required)"
          ></v-text-field>
          <v-text-field
            v-model="event.details"
            type="text"
            label="detail"
          ></v-text-field>
          <v-row>
            <v-col
              ><p>Day:</p>
              <v-date-picker v-model="event.day"></v-date-picker
            ></v-col>
          </v-row>
          <v-row justify="space-around" align="center">
            <v-col style="width: 350px; flex: 0 1 auto;">
              <h2>Start:</h2>
              <v-time-picker
                v-model="event.start"
                format="24hr"
                :max="event.end"
              ></v-time-picker>
            </v-col>
            <v-col style="width: 350px; flex: 0 1 auto;">
              <h2>End:</h2>
              <v-time-picker
                v-model="event.end"
                format="24hr"
                :min="event.start"
              ></v-time-picker>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                v-model="event.color"
                type="color"
                label="color (click to open color menu)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-btn
            type="submit"
            color="primary"
            class="mr-4"
            @click.stop="event.dialog = false"
          >
            create event
          </v-btn>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    event: {
      dialog: true,
      name: null,
      details: null,
      start: null,
      end: null,
      day: null,
      color: 'black'
    }
  }),
  methods: {
    addEvent() {
      if (
        this.event.name &&
        this.event.start &&
        this.event.end &&
        this.event.day
      ) {
        const start = new Date(this.event.day + 'T' + this.event.start)
        const end = new Date(this.event.day + 'T' + this.event.end)
        const event = {
          name: this.event.name,
          color: this.event.color,
          details: this.event.details,
          start,
          end
        }
        this.$emit('add-event', event)
        this.resetForm()
      } else alert('Please fill in all the required fields.')
    },

    resetForm() {
      this.event.name = ''
      this.event.start = ''
      this.event.end = ''
      this.event.day = ''
      this.event.details = ''
    }
  }
}
</script>

<style>
input[type='color'] {
  height: 50px;
}
</style>

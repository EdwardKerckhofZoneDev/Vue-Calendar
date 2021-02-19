<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            class="mr-4"
            @click="next"
          >
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          :weekdays="weekdays"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn @click="deleteEvent(selectedEvent.id)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <span v-if="currentlyEditing !== selectedEvent.id">{{
                selectedEvent.details
              }}</span>

              <form v-else @submit.prevent="">
                <textarea-autosize
                  v-model="selectedEvent.details"
                  type="text"
                  style="width: 100%"
                  :min-height="100"
                  :max-height="300"
                  placeholder="add note"
                ></textarea-autosize>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="primary"
                v-if="currentlyEditing !== selectedEvent.id"
                @click.prevent="editEvent(selectedEvent)"
              >
                Edit
              </v-btn>
              <v-btn
                text
                color="primary"
                v-else
                @click.prevent="updateEvent(selectedEvent)"
              >
                Save
              </v-btn>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { db } from '@/firebase'

export default {
  data: () => ({
    focus: '',
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days'
    },
    event: {
      name: null,
      details: null,
      start: null,
      end: null,
      color: '#1976D2'
    },
    weekdays: [1, 2, 3, 4, 5, 6, 0],
    currentlyEditing: null,
    showDialog: false,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: []
  }),

  mounted() {
    this.getEvents()
  },

  methods: {
    async getEvents() {
      try {
        const snapshot = await db.collection('events').get()
        const events = []
        snapshot.forEach(doc => {
          const docData = doc.data()
          docData.id = doc.id
          events.push({
            ...docData,
            start: this.convertTimestrampToDate(docData.start.seconds),
            end: this.convertTimestrampToDate(docData.end.seconds)
          })
        })
        this.events = events
      } catch (error) {
        console.log(error)
      }
    },

    async updateEvent(event) {
      try {
        await db
          .collection('events')
          .doc(this.currentlyEditing)
          .update({
            details: event.details
          })

        this.resetOptions()
      } catch (error) {
        console.log(error)
      }
    },

    async deleteEvent(eventId) {
      if (window.confirm('Are you sure you want to delete this event?'))
        try {
          await db
            .collection('events')
            .doc(eventId)
            .delete()
          this.resetOptions()
          this.getEvents()
        } catch (error) {
          console.log(error)
        }
    },

    resetOptions() {
      this.selectedOpen = false
      this.currentlyEditing = null
    },

    viewDay({ date }) {
      this.type = 'day'
      this.focus = date
    },

    getEventColor(event) {
      return event.color
    },

    setToday() {
      this.focus = ''
    },

    prev() {
      this.$refs.calendar.prev()
    },

    next() {
      this.$refs.calendar.next()
    },

    editEvent(event) {
      this.currentlyEditing = event.id
    },

    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => (this.selectedOpen = true), 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },

    updateRange({ start, end }) {
      this.start = start
      this.end = end
    },

    convertTimestrampToDate(timestamp) {
      return new Date(timestamp * 1000)
    },

    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    }
  }
}
</script>

<template>
  <v-snackbar v-model="alert" :color="color" bottom  multi-line>
    {{ text }}
    <template v-slot:action="{ attrs }">
      <v-btn :color="closeColor" text v-bind="attrs" @click="close">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
import { mapGetters, mapActions } from "vuex"

export default {
  name: "alert",
  computed: {
    ...mapGetters({
      status: "alert/status",
      color: "alert/color",
      closeColor: "alert/closeColor",
      text: "alert/text",
    }),
    alert: {
      get() {
        return this.status
      },
      set(value) {
        this.setAlert({
          status: value,
        })
      },
    },
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    close() {
      this.setAlert({
        status: false,
      })
    },
  },
}
</script>

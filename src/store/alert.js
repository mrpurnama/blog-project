export default {
    namespaced: true,
    state: {
      status: false,
      color: "success",
      text: "",
      closeColor: "red"
    },
    mutations: {
      set: (state, payload) => {
        state.status = payload.status
        state.color = payload.color
        state.text = payload.text
        state.closeColor = payload.closeColor
      },
    },
    actions: {
      set: ({ commit }, payload) => {
        commit("set", payload)
      },
    },
    getters: {
      status: (state) => state.status,
      color: (state) => state.color,
      text: (state) => state.text,
      closeColor: (state) => state.closeColor,
    },
  }
  
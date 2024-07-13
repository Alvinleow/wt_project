import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    user: null, // Initially, no user is logged in
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    CLEAR_USER(state) {
      state.user = null;
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await axios.post(
          "http://localhost:8081/api/accounts/login",
          credentials
        );
        const user = response.data.account; // Assuming the response includes the account details
        commit("SET_USER", user);
      } catch (error) {
        console.error("Error logging in:", error);
        throw error;
      }
    },
    logout({ commit }) {
      commit("CLEAR_USER");
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
    userId: (state) => (state.user ? state.user._id : null),
    user: (state) => state.user,
  },
});

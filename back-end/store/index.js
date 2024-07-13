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
    ENROLL_COURSE(state, courseId) {
      if (!state.user.enrolledCourses.includes(courseId)) {
        state.user.enrolledCourses.push(courseId);
      }
    },
    UNENROLL_COURSE(state, courseId) {
      state.user.enrolledCourses = state.user.enrolledCourses.filter(
        (id) => id !== courseId
      );
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
    async enrollInCourse({ commit, state }, courseId) {
      try {
        await axios.put(`http://localhost:8081/api/accounts/enroll`, {
          userId: state.user._id,
          courseId,
        });
        commit("ENROLL_COURSE", courseId);
      } catch (error) {
        console.error("Error enrolling in course:", error);
        throw error;
      }
    },
    async unenrollFromCourse({ commit, state }, courseId) {
      try {
        await axios.put(`http://localhost:8081/api/accounts/unenroll`, {
          userId: state.user._id,
          courseId,
        });
        commit("UNENROLL_COURSE", courseId);
      } catch (error) {
        console.error("Error unenrolling from course:", error);
        throw error;
      }
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
    userId: (state) => (state.user ? state.user._id : null),
    user: (state) => state.user,
  },
});
<template>
  <div class="main">
    <NavBar />
    <div class="main-content">
      <UserContactForm v-if="userLevel === 0" />
      <AdminContactPage v-else-if="userLevel === 1" />
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import UserContactForm from "../components/ContactPage/UserContactForm.vue";
import AdminContactPage from "../components/ContactPage/AdminContactPage.vue";
import { mapState } from 'vuex';

export default {
  name: "ContactPage",
  components: {
    NavBar,
    UserContactForm,
    AdminContactPage,
  },
  computed: {
    ...mapState(['user']),
    userLevel() {
      return this.user ? this.user.accountLevel : 0;
    },
  },
};
</script>
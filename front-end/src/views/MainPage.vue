<template>
  <div class="main">
    <div class="content">
      <TextSection />
      <ButtonSection
        v-if="!showLoginForm && !showRegisterForm"
        @show-login="showLogin"
        @show-register="showRegister"
      />
      <LoginSection v-if="showLoginForm" />
      <RegisterSection v-if="showRegisterForm" />
    </div>
  </div>
</template>

<script>
import TextSection from "../components/MainPage/TextSection.vue";
import ButtonSection from "../components/MainPage/ButtonSection.vue";
import LoginSection from "../components/MainPage/LoginSection.vue";
import RegisterSection from "../components/MainPage/RegisterSection.vue";

export default {
  name: "MainPage",
  components: {
    TextSection,
    ButtonSection,
    LoginSection,
    RegisterSection,
  },
  data() {
    return {
      showLoginForm: false,
      showRegisterForm: false,
    };
  },
  methods: {
    showLogin() {
      this.showLoginForm = true;
      this.showRegisterForm = false;
    },
    showRegister() {
      this.showRegisterForm = true;
      this.showLoginForm = false;
    },
  },
};
</script>

<style scoped>
.main {
  display: flex;
  align-items: center;
  justify-content: center;
}
.content {
  display: flex;
  width: 80%;
  justify-content: space-between;
  align-items: center;
}
</style>

<template>
  <div class="main">
    <NavBar />
    <div class="main-content">
      <ContactForm />
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import ContactForm from "../components/ContactPage/ContactForm.vue";

export default {
  name: "ContactPage",
  components: {
    NavBar,
    ContactForm,
  },
};
</script>

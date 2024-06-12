<template>
  <div class="main">
    <NavBar />
    <AboutContent />
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import AboutContent from "../components/AboutPage/AboutContent.vue";

export default {
  name: "AboutPage",
  components: {
    NavBar,
    AboutContent,
  },
};
</script>

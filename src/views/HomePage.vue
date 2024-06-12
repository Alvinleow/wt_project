<template>
  <div class="main">
    <NavBar />
    <HomeContent />
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import HomeContent from "../components/HomePage/HomeContent.vue";

export default {
  name: "Home",
  components: {
    NavBar,
    HomeContent,
  },
};
</script>

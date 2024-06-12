<template>
  <div class="main">
    <NavBar />
    <CourseMaterials />
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import CourseMaterials from "../components/CourseMaterialsPage/CourseMaterials.vue";

export default {
  name: "CourseMaterialsPage",
  components: {
    NavBar,
    CourseMaterials,
  },
};
</script>

<style scoped></style>

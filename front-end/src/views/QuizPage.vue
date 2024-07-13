<template>
  <div class="main">
    <NavBar />
    <QuizMaterials />
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import QuizMaterials from "../components/QuizMaterialsPage/QuizMaterials.vue";

export default {
  name: "QuizPage",
  components: {
    NavBar,
    QuizMaterials,
  },
};
</script>

<style scoped></style>

<template>
  <div class="main">
    <NavBar />
    <div class="main-content">
      <CourseProgress />
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import CourseProgress from "../components/CourseProgressPage/CourseProgress.vue";

export default {
  name: "CourseProgressPage",
  components: {
    NavBar,
    CourseProgress,
  },
};
</script>

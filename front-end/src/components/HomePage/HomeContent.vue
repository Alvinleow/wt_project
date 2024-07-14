<template>
  <div class="home-content">
    <h1 class="title">What's New on SoloLeveling?</h1>
    <div class="courses" ref="courses">
      <div
        class="course"
        v-for="course in courses"
        :key="course._id"
        @click="navigateToCourseMaterials"
      >
        <img :src="course.thumbnail" alt="Course Image" class="course-image" />
        <h2 class="course-title">{{ course.title }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomeContent",
  data() {
    return {
      courses: [],
    };
  },
  async created() {
    await this.fetchLatestCourses();
  },
  mounted() {
    this.$refs.courses.addEventListener("wheel", this.handleScroll);
  },
  beforeUnmount() {
    this.$refs.courses.removeEventListener("wheel", this.handleScroll);
  },
  methods: {
    async fetchLatestCourses() {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/courses?limit=10&sort=desc"
        );
        this.courses = response.data;
      } catch (error) {
        console.error("Error fetching latest courses:", error);
      }
    },
    handleScroll(event) {
      event.preventDefault();
      this.$refs.courses.scrollLeft += event.deltaY;
    },
    navigateToCourseMaterials() {
      this.$router.push({ name: "CourseMaterialsPage" });
    },
  },
};
</script>

<style scoped>
.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: white;
}

.courses {
  display: flex;
  overflow-x: auto;
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  scrollbar-width: thin; /* For Firefox */
  scrollbar-color: #42b983 rgba(0, 0, 0, 0.3); /* For Firefox */
}

.courses::-webkit-scrollbar {
  height: 10px;
}

.courses::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}

.courses::-webkit-scrollbar-thumb {
  background: #42b983;
  border-radius: 5px;
}

.courses::-webkit-scrollbar-thumb:hover {
  background: #36a273;
}

.course {
  flex: 0 0 auto;
  width: 150px;
  margin-right: 20px;
  text-align: center;
  cursor: pointer;
}

.course-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.course-title {
  margin-top: 10px;
  font-size: 1rem;
  color: white;
}
</style>

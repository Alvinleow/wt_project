<template>
  <div class="home-content">
    <h1 class="title">What's New on SoloLeveling?</h1>
    <div class="courses" ref="courses">
      <div class="course" v-for="course in courses" :key="course.id">
        <img :src="course.image" alt="Course Image" class="course-image" />
        <h2 class="course-title">{{ course.title }}</h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeContent",
  data() {
    return {
      courses: [
        { id: 1, title: "Course 1", image: "https://via.placeholder.com/150" },
        { id: 2, title: "Course 2", image: "https://via.placeholder.com/150" },
        { id: 3, title: "Course 3", image: "https://via.placeholder.com/150" },
        { id: 4, title: "Course 4", image: "https://via.placeholder.com/150" },
        { id: 5, title: "Course 5", image: "https://via.placeholder.com/150" },
        { id: 6, title: "Course 1", image: "https://via.placeholder.com/150" },
        { id: 7, title: "Course 2", image: "https://via.placeholder.com/150" },
        { id: 8, title: "Course 3", image: "https://via.placeholder.com/150" },
        { id: 9, title: "Course 4", image: "https://via.placeholder.com/150" },
        { id: 10, title: "Course 5", image: "https://via.placeholder.com/150" },
        { id: 11, title: "Course 1", image: "https://via.placeholder.com/150" },
        { id: 12, title: "Course 2", image: "https://via.placeholder.com/150" },
        { id: 13, title: "Course 3", image: "https://via.placeholder.com/150" },
        { id: 14, title: "Course 4", image: "https://via.placeholder.com/150" },
        { id: 15, title: "Course 5", image: "https://via.placeholder.com/150" },
        // Add more sample courses as needed
      ],
    };
  },
  mounted() {
    this.$refs.courses.addEventListener("wheel", this.handleScroll);
  },
  beforeUnmount() {
    this.$refs.courses.removeEventListener("wheel", this.handleScroll);
  },
  methods: {
    handleScroll(event) {
      event.preventDefault();
      this.$refs.courses.scrollLeft += event.deltaY;
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

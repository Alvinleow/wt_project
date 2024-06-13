<template>
  <div class="course-materials">
    <div class="search-sort-bar">
      <input
        type="text"
        placeholder="Search courses..."
        v-model="searchQuery"
        @input="filterCourses"
      />
      <select v-model="sortKey" @change="sortCourses">
        <option value="date">Date</option>
        <option value="enrollment">Enrolment</option>
      </select>
    </div>
    <div class="course-list">
      <div class="course" v-for="course in filteredCourses" :key="course.id">
        <img
          :src="course.thumbnail"
          alt="Course Thumbnail"
          class="course-thumbnail"
        />
        <h2 class="course-title">{{ course.title }}</h2>
        <p class="course-lessons">{{ course.lessons }} lessons</p>
        <p class="course-enrollment">{{ course.enrollment }} enrollments</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CourseMaterials",
  data() {
    return {
      searchQuery: "",
      sortKey: "date",
      courses: [
        {
          id: 1,
          title: "Course 1",
          thumbnail: "https://via.placeholder.com/150",
          lessons: 10,
          enrollment: 100,
          date: "2023-06-01",
        },
        {
          id: 2,
          title: "Course 2",
          thumbnail: "https://via.placeholder.com/150",
          lessons: 8,
          enrollment: 200,
          date: "2023-05-15",
        },
        {
          id: 3,
          title: "Course 3",
          thumbnail: "https://via.placeholder.com/150",
          lessons: 12,
          enrollment: 150,
          date: "2023-04-20",
        },
        // Add more sample courses as needed
      ],
      filteredCourses: [],
    };
  },
  mounted() {
    this.filteredCourses = this.courses;
  },
  methods: {
    filterCourses() {
      this.filteredCourses = this.courses.filter((course) =>
        course.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.sortCourses();
    },
    sortCourses() {
      if (this.sortKey === "date") {
        this.filteredCourses.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      } else if (this.sortKey === "enrollment") {
        this.filteredCourses.sort((a, b) => b.enrollment - a.enrollment);
      }
    },
  },
};
</script>

<style scoped>
.course-materials {
  padding: 20px;
  max-width: 1200px;
  margin: auto;
}

.search-sort-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-sort-bar input {
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  margin-right: 10px;
}

.search-sort-bar select {
  padding: 10px;
  font-size: 1rem;
}

.course-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.course {
  flex: 0 0 calc(33.333% - 20px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  background: #000000;
  text-align: center;
  padding: 20px;
}

.course-thumbnail {
  width: 100%;
  height: auto;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}

.course-title {
  font-size: 1.5rem;
  margin: 10px 0;
  color: #42b983;
}

.course-lessons,
.course-enrollment {
  font-size: 1rem;
  color: #fff;
  margin: 5px 0;
}
</style>

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
        <option value="enrollment">Enrollment</option>
      </select>
      <button @click="showAddCourseForm">Add Course</button>
    </div>
    <div class="course-list">
      <div
        class="course"
        v-for="course in filteredCourses"
        :key="course._id"
        @click="showCourseDetails(course)"
      >
        <img
          :src="course.thumbnail"
          alt="Course Thumbnail"
          class="course-thumbnail"
        />
        <h2 class="course-title">{{ course.title }}</h2>
        <p class="course-lessons">{{ course.totalOfLessons }} lessons</p>
        <p class="course-enrollment">{{ course.enrollment }} enrollments</p>
      </div>
    </div>

    <!-- Add Course Form -->
    <div v-if="showForm" class="add-course-form">
      <h2>Add New Course</h2>
      <form @submit.prevent="addCourse">
        <div>
          <label for="thumbnail">Thumbnail:</label>
          <input
            type="file"
            id="thumbnail"
            @change="handleThumbnailChange"
            required
          />
          <img
            v-if="previewThumbnail"
            :src="previewThumbnail"
            alt="Thumbnail Preview"
            class="thumbnail-preview"
          />
        </div>
        <div>
          <label for="title">Course Title:</label>
          <input type="text" id="title" v-model="newCourse.title" required />
        </div>
        <div>
          <label for="description">Course Description:</label>
          <textarea
            id="description"
            v-model="newCourse.description"
            required
          ></textarea>
        </div>
        <button type="submit">Submit</button>
        <button type="button" @click="hideAddCourseForm">Cancel</button>
      </form>
    </div>

    <!-- Course Details Modal -->
    <div v-if="showCourseModal" class="course-modal-overlay">
      <div class="course-modal">
        <h2>{{ selectedCourse.title }}</h2>
        <img :src="selectedCourse.thumbnail" alt="Course Thumbnail" />
        <p>{{ selectedCourse.description }}</p>
        <p>Total Lessons: {{ selectedCourse.totalOfLessons }}</p>
        <p>Enrollments: {{ selectedCourse.enrollment }}</p>
        <button
          v-if="!isEnrolledInCourse(selectedCourse._id)"
          @click="enrollInCourse"
        >
          Enroll Course
        </button>
        <div v-else>
          <button class="view-lessons-btn" @click="navigateToLessons">
            View Lessons
          </button>
          <button class="unenroll-btn" @click="confirmUnenroll">
            Unenroll Course
          </button>
        </div>
        <button @click="closeCourseModal">Close</button>
      </div>
    </div>

    <!-- Unenroll Confirmation Modal -->
    <div v-if="showConfirmUnenrollModal" class="course-modal-overlay">
      <div class="course-modal">
        <h2>Unenroll Course</h2>
        <p>
          You will lose all your progress if you unenroll from the course. Do
          you want to continue?
        </p>
        <button @click="unenrollFromCourse">OK</button>
        <button @click="closeUnenrollModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "CourseMaterials",
  data() {
    return {
      searchQuery: "",
      sortKey: "date",
      courses: [],
      filteredCourses: [],
      showForm: false,
      newCourse: {
        title: "",
        description: "",
        thumbnail: null,
      },
      previewThumbnail: null,
      showCourseModal: false,
      selectedCourse: null,
      showConfirmUnenrollModal: false,
    };
  },
  computed: {
    ...mapState({
      userId: (state) => (state.user ? state.user._id : null),
      user: (state) => state.user,
    }),
  },
  mounted() {
    this.fetchCourses();
  },
  methods: {
    fetchCourses() {
      axios
        .get("http://localhost:8081/api/courses")
        .then((response) => {
          this.courses = response.data;
          this.filteredCourses = this.courses;
        })
        .catch((error) => {
          console.error("Error fetching courses:", error);
        });
    },
    filterCourses() {
      this.filteredCourses = this.courses.filter((course) =>
        course.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.sortCourses();
    },
    sortCourses() {
      if (this.sortKey === "date") {
        this.filteredCourses.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else if (this.sortKey === "enrollment") {
        this.filteredCourses.sort((a, b) => b.enrollment - a.enrollment);
      }
    },
    showAddCourseForm() {
      this.showForm = true;
    },
    hideAddCourseForm() {
      this.showForm = false;
      this.newCourse = {
        title: "",
        description: "",
        thumbnail: null,
      };
      this.previewThumbnail = null;
    },
    handleThumbnailChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.newCourse.thumbnail = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewThumbnail = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async addCourse() {
      const formData = new FormData();
      formData.append("title", this.newCourse.title);
      formData.append("description", this.newCourse.description);
      formData.append("thumbnail", this.newCourse.thumbnail);

      try {
        const response = await axios.post(
          "http://localhost:8081/api/courses",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.courses.push(response.data);
        this.filteredCourses = this.courses;
        this.hideAddCourseForm();
      } catch (error) {
        console.error("Error adding course:", error);
      }
    },
    showCourseDetails(course) {
      this.selectedCourse = course;
      this.showCourseModal = true;
    },
    closeCourseModal() {
      this.showCourseModal = false;
      this.selectedCourse = null;
    },
    isEnrolledInCourse(courseId) {
      return this.user && this.user.enrolledCourses.includes(courseId);
    },
    async enrollInCourse() {
      try {
        await axios.put(
          `http://localhost:8081/api/accounts/enroll/${this.userId}`,
          {
            courseId: this.selectedCourse._id,
          }
        );
        this.user.enrolledCourses.push(this.selectedCourse._id);
        this.closeCourseModal();
      } catch (error) {
        console.error("Error enrolling in course:", error);
      }
    },
    confirmUnenroll() {
      this.showConfirmUnenrollModal = true;
    },
    closeUnenrollModal() {
      this.showConfirmUnenrollModal = false;
    },
    async unenrollFromCourse() {
      try {
        await axios.put(
          `http://localhost:8081/api/accounts/unenroll/${this.userId}`,
          {
            courseId: this.selectedCourse._id,
          }
        );
        this.user.enrolledCourses = this.user.enrolledCourses.filter(
          (id) => id !== this.selectedCourse._id
        );
        this.closeUnenrollModal();
        this.closeCourseModal();
      } catch (error) {
        console.error("Error unenrolling from course:", error);
      }
    },
    navigateToLessons() {
      this.$router.push({
        name: "Lessons",
        params: { courseId: this.selectedCourse._id },
      });
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
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}

.course:hover {
  transform: scale(1.05);
}

.course:hover .course-title {
  text-decoration: underline;
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

.add-course-form {
  background: #000000;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 20px auto;
}

.add-course-form h2 {
  color: #42b983;
}

.add-course-form form {
  display: flex;
  flex-direction: column;
}

.add-course-form form div {
  margin-bottom: 15px;
}

.add-course-form form label {
  color: #fff;
}

.add-course-form form input,
.add-course-form form textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.thumbnail-preview {
  margin-top: 10px;
  width: 100px;
  height: auto;
}

.add-course-form form button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.add-course-form form button[type="submit"] {
  background-color: #42b983;
  color: white;
  margin-right: 10px;
}

.add-course-form form button[type="button"] {
  background-color: #ff4d4d;
  color: white;
}

.add-course-form form button[type="submit"]:hover {
  background-color: #36a273;
}

.add-course-form form button[type="button"]:hover {
  background-color: #ff1a1a;
}

.course-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.course-modal {
  background: #000;
  color: #fff;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  text-align: center;
}

.course-modal img {
  max-width: 100%;
  height: auto;
}

.course-modal button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  margin-top: 20px;
}

.course-modal button:first-of-type {
  background-color: #42b983;
  color: white;
  margin-right: 10px;
}

.course-modal button:first-of-type:hover {
  background-color: #36a273;
}

.course-modal button:last-of-type {
  background-color: #ff4d4d;
  color: white;
}

.course-modal button:last-of-type:hover {
  background-color: #ff1a1a;
}
</style>

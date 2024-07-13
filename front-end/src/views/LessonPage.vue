<template>
  <div class="main">
    <div class="lesson-page">
      <NavBar />
      <div class="lesson-content">
        <div class="sidebar">
          <ul>
            <li
              v-for="(lesson, index) in lessons"
              :key="lesson._id"
              @click="selectLesson(lesson, index)"
              :class="{
                viewed: lesson.status === 'viewed',
                'not-viewed': lesson.status === 'not viewed',
              }"
            >
              Lesson {{ index + 1 }}: {{ lesson.title }}
            </li>
          </ul>
        </div>
        <div class="content">
          <div class="action-buttons">
            <button @click="showAddLessonModal">Add New Lesson</button>
            <button v-if="selectedLesson" @click="showEditLessonModal">
              Edit Lesson Content
            </button>
            <button
              v-if="selectedLesson"
              @click="showDeleteLessonModal"
              class="delete-button"
            >
              Delete Lesson
            </button>
          </div>
          <div v-if="selectedLesson" class="lesson-container">
            <h3 class="lesson-title">{{ selectedLesson.title }}</h3>
            <div v-html="selectedLesson.content" class="lesson-text"></div>
          </div>
          <div v-else class="empty-content-message">
            <h2>Please select a lesson to view or edit its content.</h2>
          </div>
          <div class="lesson-navigation" v-if="selectedLesson">
            <button
              class="prev-button"
              v-if="selectedLessonIndex > 0"
              @click="previousLesson"
            >
              &lt; Previous Lesson
            </button>
            <button
              class="next-button"
              v-if="selectedLessonIndex < lessons.length - 1"
              @click="nextLesson"
            >
              Next Lesson &gt;
            </button>
            <button
              class="finish-button"
              v-if="selectedLessonIndex === lessons.length - 1"
              @click="finishCourse"
            >
              Finish Course
            </button>
          </div>
        </div>
      </div>

      <!-- Add Lesson Modal -->
      <div v-if="showAddLessonModalWindow" class="modal-overlay">
        <div class="modal">
          <h2>Add New Lesson</h2>
          <form @submit.prevent="addLesson">
            <div>
              <label for="lessonTitle">Lesson Title:</label>
              <input
                type="text"
                id="lessonTitle"
                v-model="newLessonTitle"
                required
              />
            </div>
            <button type="submit">Add Lesson</button>
            <button type="button" @click="closeAddLessonModal">Cancel</button>
          </form>
        </div>
      </div>

      <!-- Edit Lesson Modal -->
      <div v-if="showEditLessonModalWindow" class="modal-overlay">
        <div class="modal">
          <h2>Edit Lesson Content</h2>
          <div ref="quillEditor" class="quill-editor"></div>
          <button @click="saveLessonContent">Save</button>
          <button type="button" @click="closeEditLessonModal">Cancel</button>
        </div>
      </div>

      <!-- Delete Lesson Confirmation Modal -->
      <div v-if="showDeleteLessonModalWindow" class="modal-overlay">
        <div class="modal">
          <h2>Are you sure you want to delete this lesson?</h2>
          <button @click="deleteLesson">Yes</button>
          <button type="button" @click="closeDeleteLessonModal">No</button>
        </div>
      </div>

      <!-- Finish Course Modal -->
      <div v-if="showFinishModal" class="modal-overlay">
        <div class="modal">
          <h2>{{ finishMessage }}</h2>
          <button @click="goHome">Back to Home</button>
          <button @click="attemptQuiz">Attempt Now</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavBar from "../components/NavBar.vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { mapState } from "vuex";

export default {
  name: "LessonPage",
  components: {
    NavBar,
  },
  data() {
    return {
      lessons: [],
      showAddLessonModalWindow: false,
      showEditLessonModalWindow: false,
      showDeleteLessonModalWindow: false,
      showFinishModal: false,
      newLessonTitle: "",
      selectedLesson: null,
      selectedLessonIndex: -1,
      quill: null,
      finishMessage: "",
      courseId: this.$route.params.courseId,
    };
  },
  computed: {
    ...mapState({
      userId: (state) => (state.user ? state.user._id : null),
    }),
  },
  async created() {
    await this.fetchLessons();
    await this.fetchUserProgress();
  },
  methods: {
    async fetchLessons() {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/courses/${this.courseId}`
        );
        this.lessons = response.data.lessons;
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    },
    async fetchUserProgress() {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/userProgress/${this.userId}/${this.courseId}`
        );
        if (response.data && response.data.lessonStatuses) {
          this.lessons.forEach((lesson) => {
            const progress = response.data.lessonStatuses.find(
              (ls) => ls.lessonId === lesson._id
            );
            if (progress) {
              lesson.status = progress.status;
            }
          });
        }
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    },
    showAddLessonModal() {
      this.showAddLessonModalWindow = true;
    },
    closeAddLessonModal() {
      this.showAddLessonModalWindow = false;
      this.newLessonTitle = "";
    },
    async addLesson() {
      if (this.newLessonTitle.trim()) {
        try {
          const response = await axios.post(
            `http://localhost:8081/api/courses/${this.courseId}/lessons`,
            { title: this.newLessonTitle }
          );
          this.lessons = response.data.lessons;
          this.newLessonTitle = "";
          this.closeAddLessonModal();
        } catch (error) {
          console.error("Error adding lesson:", error);
        }
      }
    },
    selectLesson(lesson, index) {
      this.selectedLesson = lesson;
      this.selectedLessonIndex = index;
    },
    showEditLessonModal() {
      this.showEditLessonModalWindow = true;
      this.$nextTick(() => {
        this.quill = new Quill(this.$refs.quillEditor, {
          theme: "snow",
          modules: {
            toolbar: [
              ["bold", "italic", "underline"],
              ["link", "image", "video"],
            ],
          },
        });
        if (this.selectedLesson) {
          this.quill.root.innerHTML = this.selectedLesson.content;
        }
      });
    },
    closeEditLessonModal() {
      this.showEditLessonModalWindow = false;
      this.quill = null;
    },
    async saveLessonContent() {
      if (this.selectedLesson) {
        try {
          const response = await axios.put(
            `http://localhost:8081/api/courses/${this.courseId}/lessons/${this.selectedLesson._id}`,
            { content: this.quill.root.innerHTML }
          );
          this.selectedLesson.content = this.quill.root.innerHTML;
          this.lessons = response.data.lessons;
          this.closeEditLessonModal();
        } catch (error) {
          console.error("Error saving lesson content:", error);
        }
      }
    },
    showDeleteLessonModal() {
      this.showDeleteLessonModalWindow = true;
    },
    closeDeleteLessonModal() {
      this.showDeleteLessonModalWindow = false;
    },
    async deleteLesson() {
      if (this.selectedLesson) {
        try {
          const response = await axios.delete(
            `http://localhost:8081/api/courses/${this.courseId}/lessons/${this.selectedLesson._id}`
          );
          this.lessons = response.data.lessons;
          this.selectedLesson = null;
          this.selectedLessonIndex = -1;
          this.closeDeleteLessonModal();
        } catch (error) {
          console.error("Error deleting lesson:", error);
        }
      }
    },
    async updateLessonStatus(lessonId, status) {
      try {
        await axios.put(`http://localhost:8081/api/userProgress`, {
          userId: this.userId,
          courseId: this.courseId,
          lessonId,
          status,
        });
        const lesson = this.lessons.find((lesson) => lesson._id === lessonId);
        if (lesson) {
          lesson.status = status;
        }
      } catch (error) {
        console.error("Error updating lesson status:", error);
      }
    },
    async nextLesson() {
      if (this.selectedLessonIndex < this.lessons.length - 1) {
        const nextLesson = this.lessons[this.selectedLessonIndex + 1];
        if (this.selectedLesson.status !== "viewed") {
          await this.updateLessonStatus(this.selectedLesson._id, "viewed");
        }
        this.selectLesson(nextLesson, this.selectedLessonIndex + 1);
      }
    },
    async previousLesson() {
      if (this.selectedLessonIndex > 0) {
        this.selectLesson(
          this.lessons[this.selectedLessonIndex - 1],
          this.selectedLessonIndex - 1
        );
      }
    },
    async finishCourse() {
      // Check if all previous lessons are viewed
      for (let i = 0; i < this.selectedLessonIndex; i++) {
        if (this.lessons[i].status !== "viewed") {
          this.finishMessage = "You haven't completed all the lessons yet.";
          this.showFinishModal = true;
          return;
        }
      }

      // Mark current lesson as viewed
      if (this.selectedLesson.status !== "viewed") {
        await this.updateLessonStatus(this.selectedLesson._id, "viewed");
      }

      if (this.lessons.every((lesson) => lesson.status === "viewed")) {
        this.finishMessage =
          "Congratulations! You have completed all the lessons! Do you want to proceed to the quiz for this course?";
      } else {
        this.finishMessage = "You haven't completed all the lessons yet.";
      }
      this.showFinishModal = true;
    },
    closeFinishModal() {
      this.showFinishModal = false;
    },
    goHome() {
      this.$router.push("/home");
    },
    async attemptQuiz() {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/quizzes/${this.courseId}/quiz`
        );
        const quizId = response.data.quizId;
        if (quizId) {
          this.$router.push(`/quizzes/${quizId}`);
        } else {
          console.error("Quiz not found for this course");
        }
      } catch (error) {
        console.error("Error fetching quiz ID:", error);
      }
    },
  },
};
</script>

<style scoped>
.lesson-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.lesson-content {
  display: flex;
  flex: 1;
  margin: 20px;
}

.sidebar {
  flex: 2;
  background: black;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-right: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px;
  background: #42b983;
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
  color: white;
}

.sidebar li.viewed {
  background: #228b22; /* Dark green for viewed lessons */
}

.sidebar li.not-viewed {
  background: #ff4d4d;
}

.content {
  flex: 8;
  padding: 20px;
  background: white;
  color: black;
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.empty-content-message {
  text-align: center;
  margin-top: 50px;
  color: #ccc;
}

.content button {
  margin-bottom: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  background-color: #42b983;
  color: white;
  transition: background-color 0.3s;
}

.content button:hover {
  background-color: #36a273;
}

.delete-button {
  background-color: #ff4d4d;
  margin-left: 10px;
}

.delete-button:hover {
  background-color: #ff1a1a;
}

.lesson-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Ensures buttons are aligned in the middle */
}

.prev-button {
  background-color: #ff4d4d;
}

.prev-button:hover {
  background-color: #ff1a1a;
}

.next-button {
  background-color: #42b983;
  margin-left: auto;
}

.next-button:hover {
  background-color: #36a273;
}

.finish-button {
  background-color: #42b983;
  margin-left: auto;
}

.finish-button:hover {
  background-color: #36a273;
}

.modal-overlay {
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

.modal {
  background: #000;
  color: #fff;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  text-align: center;
}

.modal button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem; /* Increased font size */
  transition: background-color 0.3s;
  margin-top: 20px;
}

.modal button:first-of-type {
  background-color: #42b983;
  color: white;
  margin-right: 10px;
}

.modal button:first-of-type:hover {
  background-color: #36a273;
}

.modal button:last-of-type {
  background-color: #ff4d4d;
  color: white;
}

.modal button:last-of-type:hover {
  background-color: #ff1a1a;
}

.modal input,
.modal textarea {
  width: 100%;
  padding: 15px; /* Increased padding */
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1.2rem; /* Increased font size */
}

.quill-editor {
  height: 200px;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.lesson-container {
  margin-bottom: 20px;
}

.lesson-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.lesson-text {
  font-size: 1.2rem;
  margin-bottom: 20px;
}
</style>

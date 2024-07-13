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
              @click="selectLesson(lesson)"
            >
              Lesson {{ index + 1 }}: {{ lesson.title }}
            </li>
          </ul>
        </div>
        <div class="content">
          <button @click="showAddLessonModal">Add New Lesson</button>
          <button v-if="selectedLesson" @click="showEditLessonModal">
            Edit Lesson Content
          </button>
          <div v-if="selectedLesson">
            <h3>{{ selectedLesson.title }}</h3>
            <div v-html="selectedLesson.content"></div>
          </div>
        </div>
      </div>

      <!-- Add Lesson Modal -->
      <div v-if="showAddLessonModalWindow" class="modal-overlay">
        <div class="modal">
          <h2>Add New Lesson</h2>
          <form @submit.prevent="addLesson">
            <label for="lessonTitle">Lesson Title:</label>
            <input
              type="text"
              id="lessonTitle"
              v-model="newLessonTitle"
              required
            />
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
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavBar from "../components/NavBar.vue";
import Quill from "quill";
import "quill/dist/quill.snow.css";

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
      newLessonTitle: "",
      selectedLesson: null,
      quill: null,
      courseId: this.$route.params.courseId, // Retrieve course ID from route params
    };
  },
  async created() {
    await this.fetchLessons();
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
    selectLesson(lesson) {
      this.selectedLesson = lesson;
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

.content {
  flex: 8;
  padding: 20px;
  background: white;
  color: black;
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
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
  background: #fff;
  color: #000;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
}

.modal button {
  padding: 10px;
  margin: 10px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}

.modal button[type="submit"] {
  background-color: #42b983;
  color: white;
}

.modal button[type="button"] {
  background-color: #ff4d4d;
  color: white;
}

.quill-editor {
  height: 200px;
  margin-bottom: 20px;
}
</style>

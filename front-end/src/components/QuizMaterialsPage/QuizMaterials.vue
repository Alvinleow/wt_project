<template>
  <div class="quiz-materials">
    <div class="search-sort-bar">
      <input
        type="text"
        placeholder="Search quizzes..."
        v-model="searchQuery"
        @input="filterQuizzes"
      />
      <select v-model="sortKey" @change="sortQuizzes">
        <option value="date">Date</option>
        <option value="questions">Number of Questions</option>
      </select>
    </div>
    <div class="add-quiz-button-container" v-if="isAdmin">
      <button @click="showAddQuizModal">Add Quiz</button>
    </div>
    <div class="quiz-list">
      <div
        class="quiz"
        v-for="quiz in filteredQuizzes"
        :key="quiz._id"
        @click="navigateToQuestions(quiz)"
      >
        <h2 class="quiz-title">Quiz for {{ quiz.courseTitle }}</h2>
        <p class="quiz-questions">{{ quiz.questions.length }} questions</p>
      </div>
    </div>

    <!-- Add Quiz Modal -->
    <div v-if="showAddQuizModalWindow" class="modal-overlay">
      <div class="modal">
        <h2>Add New Quiz</h2>
        <form @submit.prevent="addQuiz">
          <div class="form-group">
            <label for="course">Select Course:</label>
            <select v-model="selectedCourseId" required>
              <option
                v-for="course in courses"
                :key="course._id"
                :value="course._id"
              >
                {{ course.title }}
              </option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit">Add Quiz</button>
            <button type="button" @click="closeAddQuizModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "QuizMaterials",
  data() {
    return {
      searchQuery: "",
      sortKey: "date",
      quizzes: [],
      courses: [],
      filteredQuizzes: [],
      showAddQuizModalWindow: false,
      selectedCourseId: null,
    };
  },
  computed: {
    ...mapState({
      userId: (state) => (state.user ? state.user._id : null),
      user: (state) => state.user,
    }),
    isAdmin() {
      return this.user && this.user.accountLevel === 1;
    },
  },
  mounted() {
    this.fetchQuizzes();
    this.fetchCourses();
  },
  methods: {
    fetchQuizzes() {
      axios
        .get("http://localhost:8081/api/quizzes")
        .then((response) => {
          this.quizzes = response.data.map((quiz) => ({
            ...quiz,
            courseTitle: quiz.courseId.title,
          }));
          this.filteredQuizzes = this.quizzes;
        })
        .catch((error) => {
          console.error("Error fetching quizzes:", error);
        });
    },
    fetchCourses() {
      axios
        .get("http://localhost:8081/api/courses")
        .then((response) => {
          this.courses = response.data;
        })
        .catch((error) => {
          console.error("Error fetching courses:", error);
        });
    },
    filterQuizzes() {
      this.filteredQuizzes = this.quizzes.filter((quiz) =>
        quiz.courseTitle.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.sortQuizzes();
    },
    sortQuizzes() {
      if (this.sortKey === "date") {
        this.filteredQuizzes.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else if (this.sortKey === "questions") {
        this.filteredQuizzes.sort(
          (a, b) => b.questions.length - a.questions.length
        );
      }
    },
    showAddQuizModal() {
      this.showAddQuizModalWindow = true;
    },
    closeAddQuizModal() {
      this.showAddQuizModalWindow = false;
      this.selectedCourseId = null;
    },
    async addQuiz() {
      if (this.selectedCourseId) {
        try {
          const response = await axios.post(
            `http://localhost:8081/api/quizzes/${this.selectedCourseId}`,
            {
              courseId: this.selectedCourseId,
            }
          );
          const newQuiz = response.data;
          const course = this.courses.find(
            (course) => course._id === newQuiz.courseId
          );
          newQuiz.courseTitle = course ? course.title : "Unknown Course";
          this.quizzes.push(newQuiz);
          this.filteredQuizzes = this.quizzes;
          this.closeAddQuizModal();
        } catch (error) {
          console.error("Error adding quiz:", error);
        }
      }
    },
    navigateToQuestions(quiz) {
      this.$router.push({
        name: "QuestionsPage",
        params: { quizId: quiz._id },
      });
    },
  },
};
</script>

<style scoped>
.quiz-materials {
  padding: 20px;
  max-width: 1200px;
  margin: auto;
}

.search-sort-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-sort-bar input {
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.search-sort-bar select {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.add-quiz-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.add-quiz-button-container button {
  padding: 10px 20px;
  font-size: 1.2rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-quiz-button-container button:hover {
  background-color: #36a273;
}

.quiz-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.quiz {
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

.quiz:hover {
  transform: scale(1.05);
}

.quiz:hover .quiz-title {
  text-decoration: underline;
}

.quiz-title {
  font-size: 1.5rem;
  margin: 10px 0;
  color: #42b983;
}

.quiz-questions {
  font-size: 1rem;
  color: #fff;
  margin: 5px 0;
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
  padding: 30px;
  border-radius: 10px;
  max-width: 800px;
  text-align: center;
}

.modal h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #42b983;
}

.modal .form-group {
  margin-bottom: 20px;
}

.modal .form-group label {
  display: block;
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.modal .form-group select,
.modal .form-group input,
.modal .form-group textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1.2rem;
}

.modal .form-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.modal .form-buttons button {
  padding: 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.3s;
}

.modal .form-buttons button:first-of-type {
  background-color: #42b983;
  color: white;
}

.modal .form-buttons button:first-of-type:hover {
  background-color: #36a273;
}

.modal .form-buttons button:last-of-type {
  background-color: #ff4d4d;
  color: white;
}

.modal .form-buttons button:last-of-type:hover {
  background-color: #ff1a1a;
}
</style>

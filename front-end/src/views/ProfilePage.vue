<template>
  <div class="main">
    <NavBar />
    <div class="main-content">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="user" class="profile-container">
        <div class="profile-header">
          <div class="profile-pic-wrapper">
            <img
              :src="previewProfilePicUrl || user.profilePicUrl"
              alt="User Icon"
              class="user-icon"
              @click="triggerFileInput"
            />
            <span v-if="isEditing" class="edit-icon">&#9998;</span>
            <input
              type="file"
              ref="fileInput"
              style="display: none"
              @change="handleFileChange"
              accept="image/png, image/jpeg"
            />
          </div>
          <div class="profile-info">
            <h2 v-if="!isEditing">{{ user.username }}</h2>
            <input
              v-else
              v-model="editableUsername"
              type="text"
              class="editable-username"
            />
            <p>{{ user.email }}</p>
          </div>
        </div>
        <div class="completed-courses">
          <h3>Completed Courses</h3>
          <ul>
            <li v-for="course in user.completedCourses" :key="course.id">
              {{ course.title }}
            </li>
          </ul>
        </div>
        <button
          v-if="!isEditing"
          class="edit-profile-btn"
          @click="enterEditMode"
        >
          Edit Profile
        </button>
        <div v-else class="edit-buttons">
          <button class="save-btn" @click="saveChanges">Save Changes</button>
          <button class="cancel-btn" @click="cancelEdit">Cancel</button>
        </div>
        <button class="delete-account-btn" @click="promptDeleteAccount">
          Delete Account
        </button>
      </div>
      <div v-else class="no-user">No user data available. Please log in.</div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeDeleteModal">&times;</span>
        <h2>Confirm Account Deletion</h2>
        <p>Please enter your password to confirm account deletion.</p>
        <input
          type="password"
          v-model="deletePassword"
          placeholder="Enter your password"
          class="password-input"
        />
        <span v-if="deleteError" class="error-message">{{ deleteError }}</span>
        <button class="confirm-delete-btn" @click="deleteAccount">
          Confirm Delete
        </button>
      </div>
    </div>

    <!-- Deletion Success Message -->
    <div v-if="deletionSuccess" class="success-message">
      <h2>Account Deleted Successfully!</h2>
      <p>Redirecting to main page in {{ countdown }} seconds...</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import NavBar from "../components/NavBar.vue";

export default {
  name: "ProfilePage",
  components: {
    NavBar,
  },
  computed: {
    ...mapState({
      userId: (state) => (state.user ? state.user._id : null),
      user: (state) => state.user,
    }),
  },
  data() {
    return {
      loading: true,
      isEditing: false,
      editableUsername: "",
      newProfilePic: null,
      previewProfilePicUrl: null,
      showDeleteModal: false,
      deletePassword: "",
      deleteError: "",
      deletionSuccess: false,
      countdown: 3,
    };
  },
  async created() {
    if (!this.user) {
      const userId = this.$route.params.id;
      try {
        const response = await axios.get(
          `http://localhost:8081/api/accounts/${userId}`
        );
        this.$store.commit("SET_USER", response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    this.loading = false;
  },
  methods: {
    enterEditMode() {
      this.isEditing = true;
      this.editableUsername = this.user.username;
    },
    cancelEdit() {
      this.isEditing = false;
      this.editableUsername = "";
      this.newProfilePic = null;
      this.previewProfilePicUrl = null;
    },
    async saveChanges() {
      if (!this.editableUsername.trim()) {
        alert("Username cannot be empty");
        return;
      }

      this.loading = true;

      try {
        const formData = new FormData();
        formData.append("username", this.editableUsername);
        if (this.newProfilePic) {
          formData.append("profilePic", this.newProfilePic);
        }

        const response = await axios.put(
          `http://localhost:8081/api/accounts/${this.userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        this.$store.commit("SET_USER", response.data);
        this.isEditing = false;
        this.previewProfilePicUrl = null;
      } catch (error) {
        console.error("Error saving changes:", error);
        alert("Failed to save changes. Please try again.");
      } finally {
        this.loading = false;
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
        this.newProfilePic = file;

        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewProfilePicUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please select a valid image file (jpg or png).");
      }
    },
    triggerFileInput() {
      if (this.isEditing) {
        this.$refs.fileInput.click();
      }
    },
    promptDeleteAccount() {
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.deletePassword = "";
      this.deleteError = "";
    },
    async deleteAccount() {
      if (!this.deletePassword) {
        this.deleteError = "Password is required.";
        return;
      }

      try {
        console.log("Verifying password...");
        const verifyResponse = await axios.post(
          `http://localhost:8081/api/accounts/${this.userId}/verify-password`,
          {
            password: this.deletePassword,
          }
        );
        console.log("Password verified:", verifyResponse.data);

        if (!verifyResponse.data.success) {
          this.deleteError = "Incorrect password.";
          return;
        }

        console.log("Deleting account...");
        const deleteResponse = await axios.delete(
          `http://localhost:8081/api/accounts/${this.userId}`
        );
        console.log("Account deleted:", deleteResponse.data);

        this.deletionSuccess = true;
        this.startCountdown();
      } catch (error) {
        console.error("Error deleting account:", error);
        this.deleteError = "Failed to delete account. Please check your password.";
      }
    },
    startCountdown() {
      const interval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(interval);
          this.$router.push({ name: "MainPage" });
        }
      }, 1000);
    },
  },
};
</script>

<style scoped>
.main-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 100px;
  padding: 20px;
  box-sizing: border-box;
}

.profile-container {
  background: #000000;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-pic-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.user-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
  cursor: pointer;
}

.edit-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 20px;
  color: #42b983;
  cursor: pointer;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-info h2 {
  font-size: 2rem;
  color: #42b983;
  margin: 0;
}

.editable-username {
  font-size: 2rem;
  color: #42b983;
  margin: 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid #42b983;
  outline: none;
}

.profile-info p {
  font-size: 1.2rem;
  color: #fff;
  margin: 0;
}

.completed-courses h3 {
  font-size: 1.5rem;
  color: #42b983;
  margin-bottom: 15px;
}

.completed-courses ul {
  list-style-type: none;
  padding: 0;
}

.completed-courses li {
  font-size: 1.1rem;
  color: #fff;
  margin-bottom: 10px;
}

.edit-profile-btn,
.save-btn,
.cancel-btn,
.delete-account-btn,
.confirm-delete-btn {
  display: block;
  width: auto;
  padding: 10px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s;
  margin-top: 20px;
  text-align: center;
}

.edit-profile-btn {
  background-color: #42b983;
}

.edit-profile-btn:hover {
  background-color: #36a273;
}

.save-btn {
  background-color: #42b983;
  margin-right: 10px;
}

.save-btn:hover {
  background-color: #36a273;
}

.cancel-btn {
  background-color: #ff4d4d;
}

.cancel-btn:hover {
  background-color: #ff1a1a;
}

.delete-account-btn {
  background-color: #ff4d4d;
}

.delete-account-btn:hover {
  background-color: #ff1a1a;
}

.confirm-delete-btn {
  background-color: #ff4d4d;
}

.confirm-delete-btn:hover {
  background-color: #ff1a1a;
}

.loading {
  text-align: center;
  color: #42b983;
  font-size: 1.5rem;
}

.no-user {
  text-align: center;
  color: #ff4d4d;
  font-size: 1.5rem;
}

/* Modal Styles */
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #000000;
  padding: 20px;
  border: 1px solid #888;
  width: 300px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: white;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.password-input {
  width: 100%;
  padding: 10px;
  margin: 15px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.success-message {
  text-align: center;
  color: white;
}
</style>

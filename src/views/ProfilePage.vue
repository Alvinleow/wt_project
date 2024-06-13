<template>
  <div class="main">
    <NavBar />
    <div class="main-content">
      <div class="profile-container">
        <div class="profile-header">
          <img
            src="https://img.icons8.com/ios-filled/100/ffffff/user-male-circle.png"
            alt="User Icon"
            class="user-icon"
          />
          <div class="profile-info">
            <h2>{{ user.name }}</h2>
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
        <button class="edit-profile-btn" @click="editProfile">
          Edit Profile
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";

export default {
  name: "ProfilePage",
  components: {
    NavBar,
  },
  data() {
    return {
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
        completedCourses: [
          { id: 1, title: "Course 1" },
          { id: 2, title: "Course 2" },
          { id: 3, title: "Course 3" },
        ],
      },
    };
  },
  methods: {
    editProfile() {
      console.log("Edit Profile clicked");
    },
  },
};
</script>

<style scoped>
.main-content {
  flex: 1;
  overflow-y: auto; /* Enable vertical scrolling */
  overflow-x: hidden; /* Prevent horizontal scrolling */
  margin-top: 100px; /* Ensure the content starts below the navbar */
  padding: 20px; /* Add padding to the content */
  box-sizing: border-box; /* Ensure padding is included in the element's total width and height */
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

.user-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
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

.edit-profile-btn {
  display: block;
  width: auto;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s;
  margin-top: 20px;
  text-align: center;
}

.edit-profile-btn:hover {
  background-color: #36a273;
}
</style>

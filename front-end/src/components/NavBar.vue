<template>
  <div class="navbar">
    <div class="icon">
      <img
        src="../assets/logo.jpg"
        alt="SoloLeveling Logo"
        class="logo-image"
      />
      <h2 class="logo"><span class="highlight">Solo</span>Leveling</h2>
    </div>
    <div class="menu">
      <ul>
        <li><router-link to="/home">HOME</router-link></li>
        <li><router-link to="/about">ABOUT</router-link></li>
        <li>
          <router-link to="/course-materials">COURSE MATERIALS</router-link>
        </li>
        <li><router-link to="/quizzes">QUIZZES</router-link></li>
        <li>
          <router-link to="/course-progress">COURSE PROGRESS</router-link>
        </li>
        <li><router-link to="/contact">CONTACT US</router-link></li>
      </ul>
    </div>
    <div class="profile" @click="toggleMenu">
      <img
        src="https://img.icons8.com/ios-filled/50/ffffff/user-male-circle.png"
        alt="Profile Icon"
        class="profile-icon"
      />
      <div class="dropdown-menu" v-if="menuVisible">
        <a @click="navigateToProfile">View Profile</a>
        <a @click="logOut"><span class="highlightLogOut">Log Out</span></a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "NavBar",
  computed: {
    ...mapState({
      userId: (state) => (state.user ? state.user._id : null),
    }),
  },
  data() {
    return {
      menuVisible: false,
    };
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    navigateToProfile() {
      this.$router.push(`/profile/${this.userId}`);
      this.menuVisible = false;
    },
    ...mapActions(["logout"]),
    logOut() {
      this.logout(); // Call the Vuex action to log out
      this.$router.push("/");
      this.menuVisible = false;
    },
  },
};
</script>

<style scoped>
.navbar {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: rgb(0, 0, 0);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.icon {
  display: flex;
  align-items: center;
}

.logo-image {
  width: 60px;
  height: 60px;
  margin-right: 10px;
  border-radius: 50%;
}

.logo {
  color: #42b983;
  font-size: 30px;
  font-family: Cambria;
}

.highlight {
  color: #fff;
}

.menu {
  flex: 1;
  display: flex;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

ul {
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
}

ul li {
  margin-left: 30px;
  font-size: 14px;
}

ul li a {
  text-decoration: none;
  color: #fff;
  font-family: Arial;
  font-weight: bold;
  transition: 0.4s ease-in-out;
}

ul li a:hover {
  color: #42b983;
}

.profile {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.profile-icon {
  width: 40px;
  height: 40px;
}

.dropdown-menu {
  position: absolute;
  top: 60px;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 5px;
  width: 150px;
}

.dropdown-menu a {
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  white-space: nowrap;
}

.dropdown-menu a:hover {
  background-color: #42b983;
}

.highlightLogOut {
  color: red;
}
</style>

<template>
  <div class="login-section">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>Login</h2>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          v-model="password"
          required
        />
        <span v-if="loginError" class="error-message">{{ loginError }}</span>
      </div>
      <button type="submit" class="login-button">Login</button>
      <p class="switch-form">
        Don't have an account? <a @click.prevent="switchToRegister" href="#">Register here</a>
      </p>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LoginSection",
  data() {
    return {
      email: "",
      password: "",
      loginError: "",
    };
  },
  methods: {
    ...mapActions(["login"]),
    async handleLogin() {
      const loginData = {
        email: this.email,
        password: this.password,
      };

      try {
        await this.login(loginData);
        this.$router.push("/home");
      } catch (error) {
        console.error("Error logging in:", error);
        this.loginError = "Failed to login. Please check your email and password.";
      }
    },
    switchToRegister() {
      this.$emit("show-register");
    },
  },
};
</script>

<style scoped>
.login-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
}

.login-form h2 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.error-message {
  color: red;
  font-size: 0.8rem;
  margin-top: 5px;
  display: block;
}

.login-button {
  width: 100%;
  padding: 10px;
  border: none;
  background-color: #42b983;
  color: white;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
}

.login-button:hover {
  background-color: #36a273;
}

.switch-form {
  margin-top: 15px;
  text-align: center;
}
.switch-form a {
  color: #42b983;
  cursor: pointer;
  text-decoration: none;
}
.switch-form a:hover {
  text-decoration: underline;
}
</style>

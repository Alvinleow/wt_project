<template>
  <div class="register-section">
    <form @submit.prevent="handleRegister" class="register-form">
      <h2>Register</h2>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          v-model="username"
          required
        />
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
      </div>
      <div class="form-group">
        <label for="reenter-password">Re-enter Password:</label>
        <input
          type="password"
          id="reenter-password"
          name="reenter-password"
          v-model="reenterPassword"
          required
        />
      </div>
      <button type="submit" class="register-button">Register</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterSection",
  data() {
    return {
      email: "",
      username: "",
      password: "",
      reenterPassword: "",
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.reenterPassword) {
        alert("Passwords do not match!");
        return;
      }

      const userData = {
        email: this.email,
        username: this.username,
        password: this.password,
        completedCourses: [],
        accountLevel: 0,
      };

      try {
        const response = await axios.post(
          "http://localhost:8081/api/accounts",
          userData
        );
        console.log("Account created:", response.data);
        this.$router.push("/home");
      } catch (error) {
        console.error("Error creating account:", error);
        alert("Failed to create account. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.register-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-form {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
}

.register-form h2 {
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

.register-button {
  width: 100%;
  padding: 10px;
  border: none;
  background-color: #42b983;
  color: white;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
}

.register-button:hover {
  background-color: #36a273;
}
</style>

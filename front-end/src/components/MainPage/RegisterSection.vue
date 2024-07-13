<template>
  <div class="register-section">
    <form @submit.prevent="handleRegister" v-if="!registrationSuccess" class="register-form">
      <h2>Register</h2>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          v-model="email"
          @blur="validateEmail"
          required
        />
        <span v-if="emailError" class="error-message">{{ emailError }}</span>
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
          @blur="validatePassword"
          required
        />
        <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
      </div>
      <div class="form-group">
        <label for="reenter-password">Re-enter Password:</label>
        <input
          type="password"
          id="reenter-password"
          name="reenter-password"
          v-model="reenterPassword"
          @blur="validateReenterPassword"
          required
        />
        <span v-if="reenterPasswordError" class="error-message">{{ reenterPasswordError }}</span>
      </div>
      <button type="submit" class="register-button">Register</button>
      <p class="switch-form">
        Already have an account? <a @click.prevent="switchToLogin" href="#">Login here</a>
      </p>
    </form>
    <div v-else class="success-message">
      <h2>Account Register Successful!</h2>
      <p>Redirecting to login page in {{ countdown }} seconds...</p>
    </div>
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
      emailError: "",
      passwordError: "",
      reenterPasswordError: "",
      registrationSuccess: false,
      countdown: 3,
    };
  },
  methods: {
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        this.emailError = "Invalid email format.";
      } else {
        this.emailError = "";
      }
    },
    validatePassword() {
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/;
      if (!passwordPattern.test(this.password)) {
        this.passwordError = "Password must be 8-15 characters long and contain both letters and numbers";
      } else {
        this.passwordError = "";
      }
    },
    validateReenterPassword() {
      if (this.password !== this.reenterPassword) {
        this.reenterPasswordError = "Passwords do not match!";
      } else {
        this.reenterPasswordError = "";
      }
    },
    async handleRegister() {
      this.validateEmail();
      this.validatePassword();
      this.validateReenterPassword();

      if (this.emailError || this.passwordError || this.reenterPasswordError) {
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
        this.registrationSuccess = true;
        this.startCountdown();
      } catch (error) {
        console.error("Error creating account:", error);
        alert("Failed to create account. Please try again.");
      }
    },
    startCountdown() {
      const interval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(interval);
          this.switchToLogin();
        }
      }, 1000);
    },
    switchToLogin() {
      this.$emit("show-login");
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

.error-message {
  color: red;
  font-size: 0.8rem;
  margin-top: 5px;
  display: block;
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

.success-message {
  text-align: center;
  color: white;
}
</style>

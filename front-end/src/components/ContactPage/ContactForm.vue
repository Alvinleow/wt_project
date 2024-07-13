<template>
  <div class="contact-form">
    <form @submit.prevent="submitForm">
      <h2>Contact Us</h2>
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="subject">Subject:</label>
        <input type="text" id="subject" v-model="subject" required />
      </div>
      <div class="form-group">
        <label for="message">Message:</label>
        <textarea id="message" v-model="message" required></textarea>
      </div>
      <button type="submit" class="submit-btn">Submit</button>
    </form>
    <div v-if="successMessage" class="success-message">
      Form submitted successfully!
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Add this import

export default {
  data() {
    return {
      name: '',
      email: '',
      subject: '',
      message: '',
      successMessage: false, // Add successMessage to data
    };
  },
  methods: {
    async submitForm() {
      console.log('Submitting form with data:', {
        name: this.name,
        email: this.email,
        subject: this.subject,
        message: this.message,
      });
      try {
        const response = await axios.post('http://localhost:8081/api/contact', {
          name: this.name,
          email: this.email,
          subject: this.subject,
          message: this.message,
        });
        console.log('Form submitted successfully:', response.data);
        this.successMessage = true; // Show success message
        this.resetForm(); // Optional: Reset form fields after successful submission
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
    resetForm() {
      this.name = '';
      this.email = '';
      this.subject = '';
      this.message = '';
    },
  },
};
</script>

<style scoped>
.contact-form {
  margin: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 40px auto;
}

.contact-form h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #42b983;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.form-group textarea {
  resize: vertical;
  height: 150px;
}

.submit-btn {
  display: block;
  width: 100%;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #36a273;
}

.success-message {
  margin-top: 20px;
  padding: 10px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
  text-align: center;
}
</style>

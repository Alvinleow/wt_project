<template>
    <div class="admin-contact-page">
      <h2>Contact Submissions</h2>
      <div class="submissions-section">
        <div class="pending-submissions">
          <h3>Pending</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="contact in pendingContacts" :key="contact._id">
                <td>{{ contact.name }}</td>
                <td>{{ contact.email }}</td>
                <td>{{ contact.subject }}</td>
                <td>{{ contact.message }}</td>
                <td><button @click="markAsDone(contact._id)">Mark as Done</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="solved-submissions">
          <h3>Solved</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="contact in solvedContacts" :key="contact._id">
                <td>{{ contact.name }}</td>
                <td>{{ contact.email }}</td>
                <td>{{ contact.subject }}</td>
                <td>{{ contact.message }}</td>
                <td><button @click="deleteContact(contact._id)">Delete</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        contacts: [],
      };
    },
    computed: {
      pendingContacts() {
        return this.contacts.filter(contact => contact.status === 'pending');
      },
      solvedContacts() {
        return this.contacts.filter(contact => contact.status === 'solved');
      },
    },
    async created() {
      try {
        const response = await axios.get('http://localhost:8081/api/contact');
        this.contacts = response.data;
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    },
    methods: {
      async markAsDone(id) {
        try {
          await axios.put(`http://localhost:8081/api/contact/${id}/status`, { status: 'solved' });
          this.contacts = this.contacts.map(contact =>
            contact._id === id ? { ...contact, status: 'solved' } : contact
          );
        } catch (error) {
          console.error('Error updating contact status:', error);
        }
      },
      async deleteContact(id) {
        try {
          await axios.delete(`http://localhost:8081/api/contact/${id}`);
          this.contacts = this.contacts.filter(contact => contact._id !== id);
        } catch (error) {
          console.error('Error deleting contact:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .admin-contact-page {
    margin: 20px;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h2, h3 {
    text-align: center;
    color: #42b983;
    margin-bottom: 20px;
  }
  
  .submissions-section {
    display: flex;
    justify-content: space-between;
  }
  
  .pending-submissions, .solved-submissions {
    flex: 1;
    margin: 0 10px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  thead {
    background-color: #f5f5f5;
  }
  
  th, td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  th {
    background-color: #666;
    color: white;
  }
  
  td {
    background-color: #f9f9f9;
  }
  
  tr:nth-child(even) td {
    background-color: #f1f1f1;
  }
  
  button {
    padding: 5px 10px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #36a273;
  }
  </style>
  
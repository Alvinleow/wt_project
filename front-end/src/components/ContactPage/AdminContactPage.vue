<template>
<div class="admin-contact-page">
    <h2>Contact Submissions</h2>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="contact in contacts" :key="contact._id">
                <td>{{ contact.name }}</td>
                <td>{{ contact.email }}</td>
                <td>{{ contact.subject }}</td>
                <td>{{ contact.message }}</td>
            </tr>
        </tbody>
    </table>
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
    async created() {
        try {
            const response = await axios.get('http://localhost:8081/api/contact');
            this.contacts = response.data;
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    },
};
</script>

<style scoped>
.admin-contact-page {
  margin: 20px;
  padding: 20px;
background: black;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
color: #42b983;
  margin-bottom: 20px;
}

.table-container {
  overflow-x: auto;
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
</style>
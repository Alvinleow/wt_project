<template>
  <div class="button-section">
    <button @click="$emit('show-login')" class="action-button">Login</button>
    <button @click="$emit('show-register')" class="action-button">
      Register
    </button>
  </div>
</template>

<script>
export default {
  name: "ButtonSection",
};
</script>

<style scoped>
.button-section {
  display: flex;
}

.action-button {
  margin: 0 10px;
  padding: 15px 30px;
  font-size: 1.2rem;
  cursor: pointer;
  border: none;
  background-color: #42b983;
  color: white;
  border-radius: 5px;
}

.action-button:hover {
  background-color: #36a273;
}
</style>

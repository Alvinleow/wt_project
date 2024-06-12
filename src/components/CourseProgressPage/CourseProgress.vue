<template>
  <div class="course-progress">
    <h2>Course Progress</h2>
    <p>View your scores and track your progress in your courses.</p>
    <!-- Example progress data, replace with dynamic data as needed -->
    <div class="progress-item" v-for="course in courses" :key="course.id">
      <h3>{{ course.name }}</h3>
      <p>
        Lessons Completed: {{ course.lessonsCompleted }}/{{
          course.totalLessons
        }}
      </p>
      <p>Score: {{ course.score }}%</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CourseProgress",
  data() {
    return {
      courses: [
        {
          id: 1,
          name: "Course 1",
          lessonsCompleted: 8,
          totalLessons: 10,
          score: 80,
        },
        {
          id: 2,
          name: "Course 2",
          lessonsCompleted: 5,
          totalLessons: 8,
          score: 70,
        },
        {
          id: 3,
          name: "Course 3",
          lessonsCompleted: 12,
          totalLessons: 12,
          score: 95,
        },
      ],
    };
  },
};
</script>

<style scoped>
.course-progress {
  margin: 20px;
  padding: 20px;
  background: #000000;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.course-progress h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #42b983;
  text-align: center;
}

.course-progress p {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #fff;
}

.progress-item {
  margin-bottom: 20px;
  padding: 15px;
  background: #666;
  border-radius: 5px;
}

.progress-item h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #42b983;
}

.progress-item p {
  margin: 5px 0;
  color: #fff;
}
</style>

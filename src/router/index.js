import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../views/MainPage.vue";
import HomePage from "../views/HomePage.vue";
import AboutPage from "../views/AboutPage.vue";
import CourseMaterialsPage from "../views/CourseMaterialsPage.vue";
import CourseProgressPage from "../views/CourseProgressPage.vue";
import ContactPage from "../views/ContactPage.vue";
import ProfilePage from "../views/ProfilePage.vue";

const routes = [
  { path: "/", name: "MainPage", component: MainPage },
  { path: "/home", name: "HomePage", component: HomePage },
  { path: "/about", name: "AboutPage", component: AboutPage },
  {
    path: "/course-materials",
    name: "CourseMaterialsPage",
    component: CourseMaterialsPage,
  },
  {
    path: "/course-progress",
    name: "CourseProgress",
    component: CourseProgressPage,
  },
  {
    path: "/contact",
    name: "Contact",
    component: ContactPage,
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfilePage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

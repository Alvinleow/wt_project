import { createApp } from "vue";
import App from "../front-end/src/App.vue";
import router from "../front-end/src/router";
import store from "../back-end/store";
import "../front-end/src/assets/global.css";

createApp(App).use(router).use(store).mount("#app");

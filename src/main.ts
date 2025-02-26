import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import { Amplify } from "aws-amplify";
import amplifyconfig from './amplifyconfiguration.json';
import '../amplify-config';

Amplify.configure(amplifyconfig);

createApp(App).mount("#app");

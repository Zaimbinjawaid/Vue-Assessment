import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { Quasar, Notify } from "quasar";

// Import Quasar css
import "quasar/src/css/index.sass";

const app = createApp(App);

import axios from "axios";
import VueAxios from "vue-axios";
app.use(VueAxios, axios);

const baseURL = "http://54.144.155.145/api";
axios.defaults.baseURL = baseURL;

axios.interceptors.request.use(
  (request) => {
    if (!request.headers.responseType) {
      request.headers["Content-Type"] = "applicatoin/json";
    }

    const token = JSON.parse(localStorage.getItem("currentUser"))
      ? JSON.parse(localStorage.getItem("currentUser")).token
      : "";
    const header = token ? `Bearer ${token}` : null;

    if (token) {
      request.headers.Authorization = `${header}`;
    }

    return request;
  },
  (error) => {
    console.log("Failed to intercept request");
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error && error.message == "Request failed with status code 401 Error") {
      localStorage.removeItem("currentUser");
      router.push("/");
    }
    return Promise.reject(error);
  }
);

app.use(Quasar, {
  plugins: {
    Notify,
  },
  config: {
    notify: {
      /* look at QuasarConfOptions from the API card */
    },
  },
});

app.use(router);

app.mount("#app");

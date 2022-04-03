<script>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { auth } from "@/services/auth.js";

export default {
  setup() {
    const router = useRouter();

    const token = JSON.parse(localStorage.getItem("currentUser"))
      ? JSON.parse(localStorage.getItem("currentUser")).token
      : false;
    const authenticated = ref(false);

    if (token) {
      authenticated.value = true;
    } else {
      router.push("/");
    }

    async function log_out() {
      let obj = {
        token: token,
      };
      let result = await auth.logout(obj);
      if (result.data && result.data.success) {
        authenticated.value = false;
        localStorage.removeItem("currentUser");
        router.push("/");
      } else {
        $q.notify({
          color: "red-4",
          textColor: "white",
          message: result.error.response.data.message
            ? result.error.response.data.message
            : "Something went wrong.",
        });
      }
    }

    return {
      token,
      authenticated,
      log_out,
    };
  },
};
</script>

<template>
  <header class="main-content">
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <h1>Welcome to ToDo's Portal</h1>
    </div>
  </header>
  <nav class="menu-bar mb-5">
    <RouterLink to="/" v-if="!authenticated">Login</RouterLink>
    <RouterLink to="/register" v-if="!authenticated">Register</RouterLink>
    <RouterLink to="/toDo/create" v-if="authenticated">Add ToDo</RouterLink>
    <RouterLink to="/listToDo" v-if="authenticated">View ToDO</RouterLink>
    <RouterLink @click.prevent="log_out()" to="" v-if="authenticated"
      >Logout</RouterLink
    >
  </nav>
</template>

<style>
@import "@/assets/base.css";

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-bar {
  display: flex;
  justify-content: center;
  gap: 2%;
}

.mb-5 {
  margin-bottom: 5%;
}

.menu-bar a {
  color: #272727;
  text-decoration: none;
  font-size: 1.2em;
  text-transform: uppercase;
  font-weight: 500;
  display: inline-block;
  width: 100px;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.menu-bar a:hover {
  color: blueviolet;
  font-size: 1.4em;
  font-weight: bold;
  width: 120px;
  font-style: italic;
}

.menu-bar .dot {
  width: 6px;
  height: 6px;
  background: #fddb3a;
  border-radius: 50%;
  opacity: 0;
  -webkit-transform: translateX(30px);
  transform: translateX(30px);
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}
</style>

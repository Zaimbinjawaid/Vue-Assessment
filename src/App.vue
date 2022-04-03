<script>
import Header from "@/components/header.vue";
import { useRoute } from "vue-router";

export default {
  components: {
    Header,
  },

  setup() {
    const route = useRoute();
    return {
      route,
    };
  },
};
</script>

<template>
  <Header :key="route.fullPath" />
  <RouterView />
</template>

<style>
@import "@/assets/base.css";

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}
</style>
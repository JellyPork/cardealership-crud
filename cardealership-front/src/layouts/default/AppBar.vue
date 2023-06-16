<template>
  <v-app-bar flat>
    <v-app-bar-title @click="redirectToDashboard">
      <router-link to="/dashboard" class="title-link">
        <v-icon icon="mdi-circle-slice-4" />
        Car Dealership
      </router-link>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn to="/vehicledash"> Vehicles </v-btn>
    <v-btn to="/branddashboard"> Brands </v-btn>
    <v-btn to="/dashboard"> Users </v-btn>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from "vue-router";

const redirectToDashboard = () => {
  const router = useRouter();
  router.push("/dashboard");
};
</script>

<style scoped>
.title-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
</style>

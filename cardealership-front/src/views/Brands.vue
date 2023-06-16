<template>
  <v-container>
    <v-card class="signupContainer">
      <v-card-title>Add Brand</v-card-title>

      <v-card-text>
        <!-- Signup form fields -->
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model.lazy="formData.name"
            :rules="nameRules"
            label="Brand Name"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <!-- Sign up button -->
        <v-btn @click="signUp" color="primary">Add Brand</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// Data property
const formData = ref({
  name: "",
});

// Router instance
const router = useRouter();

// Form validation rules
const nameRules = [(value) => !!value || "Name is required."];

// Sign up method
const signUp = () => {
  // Send a POST request to the API endpoint
  axios
    .post("http://localhost:3000/brands", { brand: formData.value })
    .then((response) => {
      // Handle successful sign-up
      console.log(response.data);
      // Redirect to dashboard or another page after successful sign-up
      router.push("/branddashboard");
    })
    .catch((error) => {
      // Handle sign-up error
      console.error(error.response.data);
    });
};
</script>
<style scoped>
.signupContainer {
  margin: 9vh auto;
  width: 50%;
}
</style>

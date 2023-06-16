<template>
  <v-container>
    <v-card class="signupContainer">
      <v-card-title>Add Model</v-card-title>

      <v-card-text>
        <!-- Signup form fields -->
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model.lazy="formData.name"
            :rules="nameRules"
            label="Model Name"
          ></v-text-field>
          <v-text-field
            v-model.lazy="formData.year"
            :rules="ageRules"
            label="Year"
          ></v-text-field>
          <v-text-field
            v-model.lazy="formData.transmission"
            label="Transmission"
            placeholder="Optional"
          ></v-text-field>
          <v-text-field
            v-model.lazy="formData.passenger_cap"
            :rules="emailRules"
            label="Passenger Capacity"
          ></v-text-field>

          <v-select
            v-model.lazy="formData.brand_id"
            label="Brand"
            :items="brandsName"
            item-text="name"
            :item-value="getBrandId"
          ></v-select>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <!-- Sign up button -->
        <v-btn @click="signUp" color="primary">Add User</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// Data property
const formData = ref({
  name: "",
  year: "",
  transmission: "",
  passenger_cap: "",
  brand_id: null, // Selected brand
});

// Router instance
const router = useRouter();

// Form validation rules
const nameRules = [(value) => !!value || "Model name is required."];

const ageRules = [
  (value) => !!value || "Age is required.",
  // Add more age validation rules if needed
];

const emailRules = [(value) => !!value || "Transmission type is required."];

// Brands data
const brands = ref([]);
// Brands name data
const brandsName = ref([]);
// Brands ID data
const brandsId = ref([]);

// Fetch brands on component mount
onMounted(() => {
  fetchBrands();
});

// Fetch brands method
const fetchBrands = () => {
  axios
    .get("http://localhost:3000/brands")
    .then((response) => {
      brands.value = response.data;
      brandsName.value = response.data.map((brand) => brand.name);
      brandsId.value = response.data.map((brand) => brand.id);
    })
    .catch((error) => {
      console.error("Error fetching brands:", error);
    });
};

// Sign up method
const signUp = () => {
  // Send a POST request to the API endpoint
  axios
    .post("http://localhost:3000/models", { model: formData.value })
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

// Get brand ID based on brand name
const getBrandId = (brandName) => {
  const index = brandsName.value.indexOf(brandName);
  if (index !== -1) {
    return brandsId.value[index];
  }
  return null;
};
</script>

<style scoped>
.signupContainer {
  margin: 9vh auto;
  width: 50%;
}
</style>

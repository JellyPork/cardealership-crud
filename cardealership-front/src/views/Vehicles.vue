<template>
  <v-container>
    <v-card class="signupContainer">
      <v-card-title>Add Vehicle</v-card-title>

      <v-card-text>
        <!-- Signup form fields -->

        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model.lazy="formData.plates"
            :rules="plateRules"
            label="Plates"
          ></v-text-field>
          <v-text-field
            v-model.lazy="formData.color"
            :rules="colorRules"
            label="Color"
          ></v-text-field>

          <v-select
            v-model.lazy="formData.model_id"
            label="Model"
            :items="modelsName"
            :item-value="getModelId"
          ></v-select>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <!-- Sign up button -->
        <v-btn @click="signUp" color="primary">Add Vehicle</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// Data property
const formData = ref({
  plates: "",
  color: "",
  user_id: null,
  model_id: null, // Selected brand
});

// Router instance
const router = useRouter();

// Form validation rules
const modelRules = [
  (value) => !!value || "Model is required.",
  // Add more age validation rules if needed
];
const plateRules = [(value) => !!value || "Plate name is required."];

const colorRules = [
  (value) => !!value || "Color is required.",
  // Add more age validation rules if needed
];

// Brands data
const brands = ref([]);
// Brands name data

// Brands data
const models = ref([]);
// Brands name data
const modelsName = ref([]);
// Brands ID data
const modelsId = ref([]);

const matchingId = ref([]);
const matchingModels = [];

// Brands name data
const brandsName = ref([]);
// Brands ID data
const brandsId = ref([]);

// Fetch the user_id from the URL query parameters

const fetchUserId = () => {
  formData.value.user_id = router.currentRoute.value.query.user_id;
};

// Fetch brands on component mount
onMounted(() => {
  fetchBrands();
  fetchModels();
  fetchUserId();
});

// Watch for changes in the selected model and update formData.model_id

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

const fetchModels = () => {
  axios
    .get("http://localhost:3000/models")
    .then((response) => {
      models.value = response.data;
      modelsName.value = response.data.map((model) => model.name);
      modelsId.value = response.data.map((model) => model.id);
    })
    .catch((error) => {
      console.error("Error fetching brands:", error);
    });
};

// Sign up method
const signUp = () => {
  // Send a POST request to the API endpoint
  axios
    .post("http://localhost:3000/vehicles", { vehicle: formData.value })
    .then((response) => {
      // Handle successful sign-up
      console.log(response.data);
      // Redirect to dashboard or another page after successful sign-up
      router.push("/dashboard");
    })
    .catch((error) => {
      // Handle sign-up error
      console.error(error.response.data);
    });
};

const getModelId = (modelName) => {
  const index = modelsName.value.indexOf(modelName);

  if (index !== -1) {
    return modelsId.value[index];
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

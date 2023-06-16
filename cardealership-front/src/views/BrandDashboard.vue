<template>
  <v-container>
    <v-data-table :headers="headers" :items="brands" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Brands</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="brandDialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" dark class="mb-2" @click="goToAddBrand">
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Brand name"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="editItem(item.raw)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteItem(item.raw)"> mdi-delete </v-icon>
      </template>
    </v-data-table>

    <!-- Nested CRUD tables for models -->
    <!-- Nested CRUD tables for models -->
    <!-- Nested CRUD tables for models -->
    <template v-for="brand in brands" :key="brand.id">
      <v-data-table
        :headers="modelHeaders"
        :items="matchBrandsWithModels(brand)"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>{{ brand.name }}</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="modelDialog" max-width="500px">
              <template v-slot:activator="{ props }">
                <v-btn color="primary" dark class="mb-2" @click="goToAddModel">
                  New Item
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Model name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.year"
                          label="Year"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.transmission"
                          label="Transmission"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.passenger_cap"
                          label="Capacity"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="close">
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="saveModel"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >Are you sure you want to delete this item?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="deleteItemConfirmModel"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon size="small" class="me-2" @click="editItemModel(item.raw)">
            mdi-pencil
          </v-icon>
          <v-icon size="small" @click="deleteItemModel(item.raw)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </template>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    brandDialog: false, // Separate dialog property for brands
    modelDialog: false, // Separate dialog property for models
    dialogDelete: false,
    headers: [
      {
        title: "",
        align: "start",
        sortable: false,
        key: "name",
      },

      { title: "Actions", key: "actions", sortable: false },
    ],
    modelHeaders: [
      // Modify the headers for the models table as per your requirements
      {
        title: "Model",
        align: "start",
        sortable: false,
        key: "name",
      },
      { title: "Year", key: "year" },
      { title: "Transmission", key: "transmission" },
      { title: "Passenger Capacity", key: "passenger_cap" },
      { title: "Actions", key: "actions", sortable: false },
      // Add more headers as needed
    ],
    brands: [],
    models: [],
    brandsName: [],
    brandsId: [],
    editedIndex: -1,
    editedItem: {
      name: "",
    },
    defaultItem: {
      name: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    brandsWithModels() {
      return this.brands.map((brand) => ({
        ...brand,
        models: this.getModelsByBrandId(brand.id),
      }));
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  mounted() {
    this.fetchBrands();
    this.fetchModels();
  },

  methods: {
    matchBrandsWithModels(brand) {
      const matchingModels = [];
      for (const model of this.models) {
        if (brand.id === model.brand_id) {
          matchingModels.push(model);
        }
      }
      return matchingModels;
    },
    getModelsByBrandId(brandId) {
      return this.models.filter((model) => model.brandId === brandId);
    },
    fetchModels() {
      axios
        .get("http://localhost:3000/models")
        .then((response) => {
          this.models = response.data;
          console.log(this.models);
        })
        .catch((error) => {
          console.error("Error fetching models:", error);
        });
    },

    fetchBrands() {
      axios
        .get("http://localhost:3000/brands")
        .then((response) => {
          this.brands = response.data;
          this.brandsName.value = response.data.map((brand) => brand.name);
          this.brandsId.value = response.data.map((brand) => brand.id);
          console.log(this.brands);
        })
        .catch((error) => {
          console.error("Error fetching brands:", error);
        });
    },
    goToAddBrand() {
      this.$router.push("/brands");
    },
    goToAddModel() {
      this.$router.push("/models");
    },

    editItem(item) {
      this.editedIndex = this.brands.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.brandDialog = true; // Open brand dialog
    },
    editItemModel(item) {
      this.editedIndex = this.models.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.modelDialog = true; // Open model dialog
    },

    deleteItem(item) {
      this.editedIndex = this.brands.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemModel(item) {
      this.editedIndex = this.models.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const brandId = this.brands[this.editedIndex].id; // Assuming the brand object has an 'id' property

      axios
        .delete(`http://localhost:3000/brands/${brandId}`)
        .then(() => {
          this.brands.splice(this.editedIndex, 1);
          this.closeDelete();
        })
        .catch((error) => {
          console.error("Error deleting brand:", error);
        });
    },
    deleteItemConfirmModel() {
      const modelId = this.models[this.editedIndex].id; // Assuming the brand object has an 'id' property

      axios
        .delete(`http://localhost:3000/models/${modelId}`)
        .then(() => {
          this.models.splice(this.editedIndex, 1);
          this.closeDelete();
        })
        .catch((error) => {
          console.error("Error deleting brand:", error);
        });
    },

    close() {
      this.brandDialog = false;
      this.modelDialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        const brandId = this.brands[this.editedIndex].id; // Assuming the brand object has an 'id' property

        axios
          .put(`http://localhost:3000/brands/${brandId}`, this.editedItem)
          .then(() => {
            Object.assign(this.brands[this.editedIndex], this.editedItem);
            this.close();
          })
          .catch((error) => {
            console.error("Error updating brand:", error);
          });
      } else {
        this.brands.push(this.editedItem);
        this.close();
      }
    },
    saveModel() {
      if (this.editedIndex > -1) {
        const brandId = this.models[this.editedIndex].id; // Assuming the brand object has an 'id' property

        axios
          .put(`http://localhost:3000/models/${brandId}`, this.editedItem)
          .then(() => {
            Object.assign(this.models[this.editedIndex], this.editedItem);
            this.close();
          })
          .catch((error) => {
            console.error("Error updating brand:", error);
          });
      } else {
        this.models.push(this.editedItem);
        this.close();
      }
    },
  },
};
</script>

<template>
  <v-progress-linear
    v-if="!dataFetched"
    :indeterminate="true"
    color="primary"
  ></v-progress-linear>
  <v-container v-if="dataFetched">
    <v-data-table :headers="headers" :items="vehicles" class="elevation-1">
      <template v-slot:item.user_id="{ item }">
        {{ getOwnerName(item.user_id) }}
      </template>
      <template v-slot:item.model_id="{ item }">
        {{ getBrandAndModelName(item.model_id) }}
      </template>

      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Vehicles</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="userDialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.color"
                        label="Color"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.plates"
                        label="Plates"
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
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    userDialog: false, // Separate dialog property for brands
    dialogDelete: false,
    dataFetched: false,
    headers: [
      {
        title: "",
        align: "start",
        sortable: false,
        key: "id",
      },
      {
        title: "Owned By",
        key: "owner",
      },
      {
        title: "Vehicle Model",
        key: "model",
      },
      {
        title: "Color",
        key: "color",
      },
      {
        title: "Plates",
        key: "plates",
      },
      { title: "Actions", key: "actions", sortable: false },
    ],

    modelHeaders: [
      // Modify the headers for the models table as per your requirements
      {
        title: "",
        align: "start",
        sortable: false,
        key: "name",
      },
      { title: "Plates", key: "plates" },
      { title: "Color", key: "color" },
      { title: "Passenger Capacity", key: "passenger_cap" },
      { title: "Actions", key: "actions", sortable: false },
      // Add more headers as needed
    ],
    brands: [],
    models: [],
    vehicles: [],

    users: [],
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
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  methods: {
    getOwnerName(userId) {
      const user = this.users.find((user) => user.id === userId);
      return user ? user.name : "";
    },

    getBrandAndModelName(modelId) {
      const model = this.models.find((model) => model.id === modelId);
      if (model) {
        const brand = this.brands.find((brand) => brand.id === model.brand_id);
        if (brand) {
          return `${brand.name} ${model.name}`;
        }
      }
      return "";
    },

    goToPage(route) {
      this.$router.push(route);
    },
    fetchUsers() {
      axios
        .get("http://localhost:3000/users")
        .then((response) => {
          this.users = response.data;
          console.log(this.brands);
        })
        .catch((error) => {
          console.error("Error fetching brands:", error);
        });
    },
    fetchBrands() {
      axios
        .get("http://localhost:3000/brands")
        .then((response) => {
          this.brands = response.data;
          console.log(this.brands);
        })
        .catch((error) => {
          console.error("Error fetching brands:", error);
        });
    },
    fetchModels() {
      axios
        .get("http://localhost:3000/models")
        .then((response) => {
          this.models = response.data;
          console.log(this.models);
        })
        .catch((error) => {
          console.error("Error fetching brands:", error);
        });
    },
    fetchVehicles() {
      axios
        .get("http://localhost:3000/vehicles")
        .then((response) => {
          this.vehicles = response.data.map((vehicle) => {
            return {
              ...vehicle,
              owner: this.getOwnerName(vehicle.user_id),
              model: this.getBrandAndModelName(vehicle.model_id),
            };
          });
          this.dataFetched = true;
          console.log(this.vehicles);
        })
        .catch((error) => {
          console.error("Error fetching vehicles:", error);
        });
    },

    editItem(item) {
      this.editedIndex = this.vehicles.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.userDialog = true; // Open brand dialog
    },

    deleteItem(item) {
      this.editedIndex = this.vehicles.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const brandId = this.vehicles[this.editedIndex].id; // Assuming the brand object has an 'id' property

      axios
        .delete(`http://localhost:3000/vehicles/${brandId}`)
        .then(() => {
          this.vehicles.splice(this.editedIndex, 1);
          this.closeDelete();
        })
        .catch((error) => {
          console.error("Error deleting brand:", error);
        });
    },

    close() {
      this.userDialog = false;
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
    goToAddUser() {
      this.$router.push("/vehicles");
    },

    save() {
      if (this.editedIndex > -1) {
        const brandId = this.vehicles[this.editedIndex].id; // Assuming the brand object has an 'id' property

        axios
          .put(`http://localhost:3000/vehicles/${brandId}`, this.editedItem)
          .then(() => {
            Object.assign(this.vehicles[this.editedIndex], this.editedItem);
            this.close();
          })
          .catch((error) => {
            console.error("Error updating brand:", error);
          });
      } else {
        this.vehicles.push(this.editedItem);
        this.close();
      }
    },
  },
  mounted() {
    this.fetchVehicles();
    this.fetchBrands();
    this.fetchModels();
    this.fetchUsers();
  },
};
</script>

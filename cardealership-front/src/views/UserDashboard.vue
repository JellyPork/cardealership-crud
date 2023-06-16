<template>
  <v-container>
    <v-data-table :headers="headers" :items="users" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Users</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="userDialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" dark class="mb-2" @click="goToAddUser">
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
                        label="User name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.age"
                        label="Age"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.telephone"
                        label="Telephone"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.email"
                        label="Email"
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
        <v-icon size="small" @click="addVehicle(item.raw)"> mdi-plus </v-icon>
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
    headers: [
      {
        title: "Name",
        align: "start",
        sortable: false,
        key: "name",
      },
      { title: "Age", key: "age" },
      { title: "Telephone", key: "telephone" },

      { title: "Email", key: "email" },

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
    users: [],
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
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.userDialog = true; // Open brand dialog
    },

    deleteItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    addVehicle(item) {
      this.editedIndex = this.users.indexOf(item);
      const userId = this.users[this.editedIndex].id;
      this.$router.push({
        path: "/vehicles",
        query: {
          user_id: userId,
        },
      });
    },

    deleteItemConfirm() {
      const brandId = this.users[this.editedIndex].id; // Assuming the brand object has an 'id' property

      axios
        .delete(`http://localhost:3000/users/${brandId}`)
        .then(() => {
          this.users.splice(this.editedIndex, 1);
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
      this.$router.push("/users");
    },

    save() {
      if (this.editedIndex > -1) {
        const brandId = this.users[this.editedIndex].id; // Assuming the brand object has an 'id' property

        axios
          .put(`http://localhost:3000/users/${brandId}`, this.editedItem)
          .then(() => {
            Object.assign(this.users[this.editedIndex], this.editedItem);
            this.close();
          })
          .catch((error) => {
            console.error("Error updating brand:", error);
          });
      } else {
        this.users.push(this.editedItem);
        this.close();
      }
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<template>
  <v-container fill-height fluid>
    <v-row justify="space-between">
      <h1>Creativos Digitales</h1>
      <!-- LOGOUT BUTTON -->
      <v-btn
        @click="logOut"
        v-if="current_user != null"
        color="blue darken-2"
        class="v-btn"
        >Log Out</v-btn
      >
    </v-row>

    <!-- LOGIN -->
    <v-col cols="12" v-if="current_user === null">
      <v-card elevation="2" class="p-5">
        <v-card-title>Login</v-card-title>
        <v-container>
          <v-form ref="formL" lazy-validation v-model="validL">
            <v-text-field
              v-model="userAuth.email"
              label="Email"
              :rules="emailRules"
              type="email"
            ></v-text-field>
            <v-text-field
              v-model="userAuth.password"
              :rules="passwordRules"
              label="Password"
              required
              type="password"
            ></v-text-field>
            <v-row justify="center" m-20>
              <v-btn color="blue darken-2" class="mr-4" @click="submitLogin">
                Log In
              </v-btn>
            </v-row>
          </v-form>
        </v-container>
      </v-card>
    </v-col>

    <!-- USERS REGISTER FORM -->
    <v-col cols="12" v-if="current_user == null || isEditing == true">
      <v-card>
        <v-btn
          @click="cancelUpdate"
          v-if="current_user != null"
          color="blue darken-2"
          class="v-btn"
          >Calcel update</v-btn
        >
        <v-card-title>{{ button_register_label }}</v-card-title>
        <v-container>
          <v-form ref="form" lazy-validation v-model="valid">
            <v-select
              v-model="userRegister.id_type"
              :rules="[(v) => !!v || 'Item is required']"
              :items="this.doc_types_list"
              label="Document type"
            ></v-select>
            <v-text-field
              v-model="userRegister.id"
              label="Id number"
              :rules="numberRules"
              type="number"
            ></v-text-field>
            <v-text-field
              :rules="[(v) => !!v || 'Item is required']"
              v-model="userRegister.name"
              label="Name"
              required
            ></v-text-field>

            <v-text-field
              v-model="userRegister.lastname"
              label="Last Name"
              :rules="[(v) => !!v || 'Item is required']"
            ></v-text-field>

            <v-text-field
              v-model="userRegister.email"
              :rules="emailRules"
              label="E-mail"
              type="email"
              required
              :disabled="isEditing"
            ></v-text-field>

            <v-select
              v-model="userRegister.rol"
              :items="this.roles_list"
              :rules="[(v) => !!v || 'Item is required']"
              label="Rol"
            ></v-select>

            <v-text-field
              v-model="userRegister.phone"
              label="Phone"
              :rules="numberRules"
              type="number"
              required
            ></v-text-field>

            <v-text-field
              v-model="userRegister.password"
              label="Password"
              :rules="passwordRules"
              type="password"
              v-if="!isEditing"
            ></v-text-field>

            <v-row justify="center">
              <v-btn
                @click="submitRegister"
                color="blue darken-2"
                class="v-btn"
                >{{ button_register_label }}</v-btn
              >
            </v-row>
          </v-form>
        </v-container>
      </v-card>
    </v-col>

    <!-- USERS TABLE -->
    <v-col>
      <v-simple-table v-if="current_user != null && current_user.rol != 'User'">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Id type</th>
              <th class="text-left">Id</th>
              <th class="text-left">Email</th>
              <th class="text-left">Name</th>
              <th class="text-left">Last Name</th>
              <th class="text-left">Phone</th>
              <th class="text-left">Role</th>
              <th class="text-left">Edit</th>
              <th class="text-left">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users_list" :key="user.email">
              <td>{{ user.id_type }}</td>
              <td>{{ user.id }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.lastname }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.rol }}</td>
              <td>
                <v-btn
                  @click="editUser(user)"
                  color="green darken-2"
                  class="v-btn"
                  >Edit</v-btn
                >
              </td>
              <td>
                <v-btn
                  @click="deleteUser(user.email)"
                  color="red darken-2"
                  class="v-btn"
                  :disabled="current_user.rol == 'Coordinator'"
                  >Delete</v-btn
                >
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
  </v-container>
</template>

<script>
import axios from "axios";
import URL from "../config/data";

export default {
  data: () => ({
    valid: true,
    validL: true,

    userAuth: {
      email: "",
      password: "",
    },

    userRegister: {
      id_type: "",
      id: "",
      name: "",
      lastname: "",
      email: "",
      password: "",
      rol: "",
      phone: "",
    },

    doc_types_list: [],
    roles_list: [],

    current_user: null,
    users_list: [],
    isEditing: false,
    button_register_label: "User Register",

    //RULES
    emailRules: [
      (v) => !!v || "E-mail required",
      (v) => /.+@.+\..+/.test(v) || "Not valid E-mail",
    ],

    passwordRules: [
      (value) => !!value || "Required.",
      (value) =>
        value?.length >= 6 || "Password should have at least 6 characters",
    ],

    numberRules: [
      (v) => !!v || "Numeric field is required",
      (v) => /^\d+$/.test(v) || "Only numbers",
    ],
  }),

  beforeMount() {
    //Form data
    this.listDropDownData();

    //Checks if the user is already authenticated to login automatically and after that load the users
    this.authentication();
  },

  methods: {
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    //Register and form validation
    submitRegister() {
      this.$refs.form.validate();
      if (!this.RegisterValidation()) return;
      const model = this.userRegister;
      model.id_type = this.doc_types_list.indexOf(model.id_type) + 1;
      model.rol = this.roles_list.indexOf(model.rol) + 1;
      if (!this.isEditing) {
        axios
          .post(URL + "users", model)
          .then((res) => {
            alert("User created, you can authenticate now");
            this.$refs.form.reset();
          })
          .catch((error) => {
            console.log(error);
            alert(error.response.data.msg);
          });
      } else {
        this.updateUser(model);
      }
    },

    //Login and form validation
    submitLogin() {
      this.$refs.formL.validate();
      if (!this.loginValidation()) return;
      axios
        .post(URL + "login", this.userAuth)
        .then((res) => {
          console.log(res);
          localStorage.setItem("key", res.data.token);
          this.authentication();
          this.$refs.form.reset();
        })
        .catch((error) => {
          console.log(error);
          alert(error.response.data.msg);
        });
    },

    //Check user authentication, verify if token in the localStorage already exists
    authentication() {
      let token = localStorage.getItem("key");
      if (token) {
        axios.defaults.headers.common["x-auth-token"] = token;
        axios
          .get(URL + "userAuth")
          .then((res) => {
            this.current_user = res.data;
            console.log(this.current_user.rol);
            //When the user is authenticated users list can be loaded
            this.loadUsers();
          })
          .catch((error) => {
            console.log(error);
            alert(error.response.data.msg);
          });
      }
    },

    //Delete user from the table
    deleteUser(email) {
      let token = localStorage.getItem("key");
      axios.defaults.headers.common["x-auth-token"] = token;
      if (email === this.current_user.email) {
        alert("You cant delete your own user!");
        return;
      }

      axios
        .delete(URL + "users/" + email)
        .then((res) => {
          console.log(res);
          alert("user deleted");
          this.loadUsers();
        })
        .catch((error) => {
          console.log(error);
          alert("Error");
        });
    },

    //Update user from the table
    updateUser(user) {
      let token = localStorage.getItem("key");
      axios.defaults.headers.common["x-auth-token"] = token;
      axios
        .put(URL + "users/" + user.email, {
          user,
        })
        .then((res) => {
          console.log(res);
          alert("user updated");
          this.isEditing = false;
          this.loadUsers();
          this.$refs.form.reset();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //Load users into the table
    loadUsers() {
      let token = localStorage.getItem("key");
      if (token) {
        axios.defaults.headers.common["x-auth-token"] = token;
        axios
          .get(URL + "users")
          .then((res) => {
            this.users_list = res.data;
            console.log("users");
            console.log(this.users_list);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    //Load doc types and roles
    listDropDownData() {
      axios
        .get(URL + "doc_types")
        .then((res) => {
          res.data.map((item) => {
            this.doc_types_list.push(item.type);
          });
        })
        .catch((error) => {
          console.log(error);
          alert("error");
        });

      axios
        .get(URL + "roles")
        .then((res) => {
          res.data.map((item) => this.roles_list.push(item.type));
        })
        .catch((error) => {
          console.log(error);
          alert("error");
        });
    },

    //Allow edition trough the register form
    editUser(user) {
      this.userRegister = user;
      this.isEditing = true;
      this.button_register_label = "Update user";
    },

    //Log out, delete current token and headers
    logOut() {
      this.current_user = null;
      axios.defaults.headers.common["x-auth-token"] = "";
      localStorage.removeItem("key");
      this.button_register_label = "User Register";
    },

    //Hide the form if the user wants to cancel the update
    cancelUpdate() {
      this.isEditing = false;
      this.button_register_label = "User Register";
    },

    //Validations
    loginValidation() {
      const { email, password } = this.userAuth;
      if (email === "" || password === "") {
        alert("Must fill all the fields");
        return false;
      } else {
        return true;
      }
    },

    RegisterValidation() {
      const { id_type, id, name, lastname, email, password, rol, phone } =
        this.userRegister;
      if (
        id_type === "" ||
        id === "" ||
        name === "" ||
        lastname === "" ||
        email === "" ||
        rol === "" ||
        phone === "" ||
        (!this.isEditing && password === "")
      ) {
        alert("Must fill all the fields");
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@700&family=Roboto&display=swap");
body {
  font-family: "Lato", sans-serif;
}
</style>
<template>
  <!-- App.vue -->
  <v-app>
    <alert />
    <Dialog />

    <v-navigation-drawer app v-model="drawer">
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="user.photo_profile ? apiDomain + user.photo_profile : 'https://randomuser.me/api/portraits/women/81.jpg'"></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ user.name }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-for="(item, i) in menus"
          :key="`menu-${i}`"
          :to="item.route"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="item.title">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="success" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="isLogin"></v-app-bar-nav-icon>
      <v-toolbar-title>Blog Project</v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="!isLogin">
        <v-btn
          depressed
          color="primary"
          class="mr-2"
          @click="login"
        >
          Login
        </v-btn>
        <v-btn
          depressed
          @click="register"
        >
          Register
        </v-btn>
      </div>
      <div v-if="isLogin">
        <v-btn
          depressed
          color="red"
          @click="logout"
        >
          Logout
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <v-slide-y-transition>
          <router-view></router-view>
        </v-slide-y-transition>
      </v-container>
    </v-main>

    <v-footer app>
      MRP | VueJS
    </v-footer>
  </v-app>
</template>
<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: 'App',
  components: {
    Alert: () => import("./components/Alert.vue"),
    Dialog: () => import("./components/Dialog.vue"),
  },

  data: () => ({
    drawer: false,
    menus: [
      { title: 'Home', icon: 'mdi-home', route: '/'},
      // { title: 'About', icon: 'mdi-home', route: '/about'},
      { title: 'Blogs', icon: 'mdi-note', route: '/blogs'},
      { title: 'Table Blogs', icon: 'mdi-note', route: '/table-blogs'},
    ],
  }),
  computed: {
    ...mapGetters({
      isLogin: "auth/isLogin",
      user: "auth/user",
      token: "auth/token",
      apiDomain: "apiDomain"
    }),
  },
  methods: {
    logout() {
      let config = {
        method: "post",
        url: this.apiDomain + "/api/v2/auth/logout",
        headers: {
          Authorization: "Bearer" + this.token,
        },
      };

      this.axios(config)
        .then(() => {
          this.setToken(null);
          this.setUser({});

          this.setAlert({
            status: true,
            color: "success",
            text: "anda berhasil logout",
          });
        })
        .catch((response) => {
          this.setAlert({
            status: true,
            color: "error",
            text: response.data.error,
          });
        });
    },
    login() {
      this.setDialogComponent({ component: "login" });
    },
    register() {
      this.setDialogComponent({ component: "register" });
    },
    ...mapActions({
      setAlert: "alert/set",
      setDialogComponent: "dialog/setComponent",
      setToken: "auth/setToken",
      setUser: "auth/setUser",
      checkToken: "auth/checkToken",
    }),
  },
  mounted() {
    console.log(this.isLogin)
    console.log(this.token)
    if (this.token) {
      this.checkToken(this.token);
    }
  },
}
</script>

<style scoped>
  .form-container {
    border: 1px solid;
    padding: 16px
  }

  .button-container {
    align-items: center;
    gap: 8px;
    display: flex;
  }

  .button-container > * {
    flex: 1;
  }

  .clickable-register {
    cursor: pointer;
    font-weight: bold;
  }

</style>
<template>
  <v-card>
    <v-toolbar dark color="success">
      <v-btn icon dark @click.native="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Login</v-toolbar-title>
    </v-toolbar>
    <v-divider></v-divider>
    <h3 class="text-center mt-4">Silahkan Login</h3>
    <v-container>
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="8"
          md="6"
        >
          <v-form ref="form" class="form-container">
            <v-text-field v-model="email" label="E-mail" required append-icon="mdi-email"></v-text-field>
            <v-text-field v-model="password" label="password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword"></v-text-field>
            <div style="margin-bottom: 16px;">Belum punya akun ? <span class="primary--text clickable-register" @click="register">Register Disini</span></div>
            <div class="text-xs-center button-container">
              <v-btn @click="close">
                Cancel
              </v-btn>
              <v-btn color="primary lighten-1" @click="submit">
                Login
                <v-icon right dark>mdi-lock-open</v-icon>
              </v-btn>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
import { mapActions } from "vuex"
export default {
  data() {
    return {
      email: "",
      showPassword: false,
      password: "",
    }
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setToken: "auth/setToken",
      setDialogComponent: "dialog/setComponent",
    }),
    close() {
      this.$emit("closed", false)
    },
    register() {
      this.setDialogComponent({ component: "register" });
    },
    submit() {
      let formData = new FormData()
      formData.append("email", this.email)
      formData.append("password", this.password)
      const config = {
        method: "post",
        url: this.$store.state.apiDomain + "/api/v2/auth/login",
        data: formData,
      }

      this.axios(config)
        .then((response) => {
          this.setToken(response.data.access_token)

          this.setAlert({
            status: true,
            color: "success",
            text:"Login berhasil!",
          })
          this.close()
        })
        .catch(() => {
          this.setAlert({
            status: true,
            color: "error",
            text: "Login gagal! Silahkan coba lagi",
          })
        })
    },
  },
}
</script>

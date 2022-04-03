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
      <v-toolbar-title>Register</v-toolbar-title>
    </v-toolbar>
    <v-divider></v-divider>
    <h3 class="text-center mt-4">Silahkan Daftar Disini</h3>
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
            <v-text-field v-model="name" label="Name" required append-icon="mdi-account"></v-text-field>
            <v-text-field v-model="password" label="Password" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword"></v-text-field>
            <input type="file" name="photo" ref="photo" required />
            <div style="margin: 16px 0;">Sudah punya akun ? <span class="primary--text clickable-register" @click="login">Login Disini</span></div>
            <div class="text-xs-center button-container">
              <v-btn @click="close">
                Cancel
              </v-btn>
              <v-btn color="primary lighten-1" @click="submit">
                Register
                <v-icon right dark>mdi-account-multiple-plus</v-icon>
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
      name: "",
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
    login() {
      this.setDialogComponent({ component: "login" });
    },
    submit() {
      let file = this.$refs.photo.files[0]
      let formData = new FormData()
      formData.append("email", this.email)
      formData.append("password", this.password)
      formData.append("name", this.name)
      formData.append("photo_profile", file)
      const config = {
        method: "post",
        url: this.$store.state.apiDomain + "/api/v2/auth/register",
        data: formData,
      }

      this.axios(config)
        .then(() => {
          let formDataLogin = new FormData()
          formDataLogin.append("email", this.email)
          formDataLogin.append("password", this.password)
          const configLogin = {
            method: "post",
            url: this.$store.state.apiDomain + "/api/v2/auth/login",
            data: formData,
          }

          this.axios(configLogin)
            .then((response) => {
              this.setToken(response.data.access_token)
              this.setAlert({
                status: true,
                color: "success",
                text: "Registrasi berhasil",
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
        })
        .catch(() => {
          this.setAlert({
            status: true,
            color: "error",
            text: "Registrasi gagal! Silahkan coba lagi",
          })
        })
    },
  },
}
</script>

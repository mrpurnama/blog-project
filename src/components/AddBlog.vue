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
      <v-toolbar-title>Blog</v-toolbar-title>
    </v-toolbar>
    <v-divider></v-divider>
    <h3 class="text-center mt-4">Silahkan Blog</h3>
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
            <v-text-field v-model="title" label="Title" required></v-text-field>
            <v-textarea v-model="description" label="Description" required></v-textarea>
            <v-file-input
              accept="image/*"
              label="Photo"
              name="photo"
              ref="photo"
              v-model="photo"
            ></v-file-input>
            <div class="text-xs-center button-container">
              <v-btn @click="close">
                Cancel
              </v-btn>
              <v-btn color="primary lighten-1" @click="submit">
                Submit
              </v-btn>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
import { mapActions, mapGetters } from "vuex"
export default {
  data() {
    return {
      title: null,
      description: null,
      photo: null,
    }
  },
  computed: {
    ...mapGetters({
      isLogin: "auth/isLogin",
      user: "auth/user",
      token: "auth/token",
      apiDomain: "apiDomain",
      dialogParams: "dialog/params",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
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
      formData.append("title", this.title)
      formData.append("description", this.description)
      const config = {
        method: "post",
        url: this.$store.state.apiDomain + "/api/v2/blog",
        data: formData,
        headers: {
          Authorization: "Bearer" + this.token,
          "Access-Control-Allow-Origin": "*",
          Accept: "application/json"
        },
      }

      this.axios(config)
        .then((response) => {
          if (this.photo) {
            this.upload(response.id, this.photo, true)
          } else {
            this.setAlert({
              status: true,
              color: "success",
              text:"Tambah Blog berhasil!",
            })
            this.close()
            this.$router.push({ path: '/table-blogs/' })
          }

        })
        .catch(() => {
          this.setAlert({
            status: true,
            color: "error",
            text: "Tambah Blog Gagal! Silahkan coba lagi",
          })
        })
    },
    upload(id, photo, pushToList) {
      let formData = new FormData()
      formData.append("photo", photo)
      const config = {
        method: "post",
        url: this.$store.state.apiDomain + "/api/v2/blog/" + id + "/upload-photo",
        data: formData,
        headers: {
          Authorization: "Bearer" + this.token,
          "Access-Control-Allow-Origin": "*"
        },
      }

      this.axios(config)
        .then(() => {
          if (pushToList) {
            this.setAlert({
              status: true,
              color: "success",
              text:"Tambah Blog berhasil!",
            })
            this.close()
          } else {
            this.setAlert({
              status: true,
              color: "success",
              text:"Photo Berhasil di upload!",
            })
            this.close()
          }

        })
        .catch(() => {
          this.setAlert({
            status: true,
            color: "error",
            text: "Photo gagal diupload! Silahkan coba lagi",
          })
        })
    },
  },
}
</script>

<template>
  <v-container class="m-0 pa-0">
    <v-btn
      color="primary"
      dark
      @click="showAdd"
    >
      Add Blog
    </v-btn>
    <v-btn
      @click="initialize"
      class="ml-2"
    >
      Reset
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="blogs"
      sort-by="id"
      class="elevation-1 mt-2"
      hide-default-footer
    >
      <template v-slot:item.photo="{ item }">
        <div style="padding: 8px;">
          <v-img :src="item.photo ? apiDomain + item.photo : 'https://picsum.photos/200'" :alt="item.title" height="100px" width="100px"></v-img>
        </div>
      </template>
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>All Blogs</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          title="Show Detail"
          @click="goToDetail(item.id)"
        >
          mdi-eye
        </v-icon>
        <!-- <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon> -->
        <v-icon
          small
          @click="deleteItem(item.id)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click="initialize"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
    <v-pagination
      v-model="page"
      @input="initialize"
      :length="lengthPage"
      :total-visible="perPage"
    ></v-pagination>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  data: () => ({
    blogs: [],
    page: 0,
    lengthPage: 0,
    perPage: 0,
    headers: [
      {
        text: 'ID',
        align: 'start',
        value: 'id',
      },
      { text: 'Title', value: 'title' },
      { text: 'Photo', value: 'photo', sortable: false },
      { text: 'Description', value: 'description' },
      { text: 'Actions', value: 'actions', sortable: false, width: 150 },
    ],
  }),
  computed: {
    ...mapGetters({
      apiDomain: "apiDomain",
      isLogin: "auth/isLogin",
      user: "auth/user",
      token: "auth/token",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setDialogComponent: "dialog/setComponent",
    }),
    showAdd() {
      this.setDialogComponent({ component: "AddBlog" });
    },
    initialize() {
      const config = {
        method: 'get',
        url: this.apiDomain + '/api/v2/blog?page=' + this.page
      }
      this.axios(config)
        .then(response => {
        let { blogs } = response.data
        this.blogs = blogs.data
        this.page = blogs.current_page
        this.lengthPage = blogs.last_page
        this.perPage = blogs.per_page
      })
      .catch(error => {
          console.log(error)
      })
    },
    goToDetail(id) {
      this.$router.push({ path: '/blog/' + id })
    },
    deleteItem: function(id) {
      if (confirm('Anda Yakin ?') == true) {
        const config = {
          method: 'POST',
          url: `${this.apiDomain}/api/v2/blog/${id}`,
          params: { _method: 'DELETE' },
          headers: {
            Authorization: "Token" + this.token,
            "Access-Control-Allow-Origin": "*"
          },
        }
        console.log(config)
        this.axios(config)
        .then((response) => {
          console.log(response)
          this.setAlert({
            status: true,
            color: "success",
            text: "Data Berhasil Dihapus",
          })
          this.initialize()
        })
        .catch(error => {
          console.log(error)
        });
      }
    },
  },
  created(){
    this.initialize()
  }
}
</script>
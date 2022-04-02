<template>
  <v-container class="m-0 pa-0">
    <v-data-table
      :headers="headers"
      :items="blogs"
      sort-by="id"
      class="elevation-1"
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
          <!-- <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
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
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.name"
                        label="Dessert name"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.calories"
                        label="Calories"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.fat"
                        label="Fat (g)"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.carbs"
                        label="Carbs (g)"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.protein"
                        label="Protein (g)"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog> -->
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
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
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
      @input="go"
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
    }),
    go() {
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
          this.go()
        })
        .catch(error => {
          console.log(error)
        });
      }
    },
  },
  created(){
    this.go()
  }
}
</script>
<template>
  <v-container class="ma-0 pa-0" grid-list-sm>
    <div class="text-right">
      <v-btn small  to="/blogs" class="blue--text">
        All Blogs <v-icon left>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
    <v-layout wrap>
        <blog-item-component
            v-for="blog in blogs"
            :key="'blog-'+blog.id"
            :blog="blog"
        ></blog-item-component>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex"
import BlogItemComponentVue from '../components/BlogItemComponent.vue'
export default {
  data: () => ({
    blogs: []
  }),
  computed: {
    ...mapGetters({
      apiDomain: "apiDomain"
    }),
  },
  components : {
    'blog-item-component' : BlogItemComponentVue
  },
  created(){
    const config = {
      method: 'get',
      url: this.apiDomain + '/api/v2/blog/random/4'
    }
    this.axios(config)
    .then(response => {
      let { blogs } = response.data
      this.blogs = blogs
    })
    .catch(error => {
      console.log(error)
    })
  }
}
</script>
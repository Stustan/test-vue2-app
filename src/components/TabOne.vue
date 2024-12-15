<template>
  <div>
    <v-container>
      <v-btn color="primary" @click="openAddPostDrawer">Добавить пост</v-btn>

      <v-data-table
        :headers="headers"
        :items="posts"
        :items-per-page="pagination.itemsPerPage"
        :page.sync="pagination.page"
        class="elevation-1"
        @click:row="openDrawer"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="confirmDeletePost(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-container>

    <v-navigation-drawer 
      v-model="drawer" 
      absolute 
      bottom 
      right 
      temporary>
      <v-card>
        <v-card-title>Редактировать пост</v-card-title>
        <v-card-text>
          <v-text-field
            v-if="selectedPost"
            v-model="selectedPost.title"
            label="Заголовок"
            :error-messages="titleError"
          />
          <v-textarea
            v-if="selectedPost"
            v-model="selectedPost.body"
            label="Содержимое"
            :error-messages="bodyError"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="savePost">Сохранить</v-btn>
          <v-btn color="error" @click="closeDrawer">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>

    <v-navigation-drawer 
      v-model="addDrawer" 
      absolute 
      bottom 
      right
      temporary>
      <v-card>
        <v-card-title>Добавить пост</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newPost.title"
            label="Заголовок"
            :error-messages="titleError"
          />
          <v-textarea
            v-model="newPost.body"
            label="Содержимое"
            :error-messages="bodyError"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addPost">Добавить</v-btn>
          <v-btn color="error" @click="closeAddDrawer">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Подтверждение удаления</v-card-title>
        <v-card-text>Вы уверены, что хотите удалить этот пост?</v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="deletePost">Удалить</v-btn>
          <v-btn color="primary" @click="closeDeleteDialog">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="errorSnackbar.visible" :timeout="errorSnackbar.timeout" color="error">
      {{ errorSnackbar.message }}
    </v-snackbar>
    <v-snackbar v-model="successSnackbar.visible" :timeout="successSnackbar.timeout" color="green">
      {{ successSnackbar.message }}
    </v-snackbar>
  </div>
</template>
  
<script>
import axios from "axios";

export default {
  name: "TabOne",
  data() {
    return {
      posts: [],
      selectedPost: null,
      newPost: { title: "", body: "" },
      drawer: false,
      addDrawer: false,
      deleteDialog: false,
      postToDelete: null,
      errorSnackbar: {
        visible: false,
        message: "",
        timeout: 3000,
      },
      successSnackbar: {
        visible: false,
        message: "",
        timeout: 3000,
      },
      headers: [
        { text: "ID", value: "id" },
        { text: "Заголовок", value: "title" },
        { text: "Содержимое", value: "body" },
        { text: "Действия", value: "actions", sortable: false },
      ],
      pagination: {
        page: 1,
        itemsPerPage: 10,
      },
      titleError: "",
      bodyError: "",
    };
  },
  created() {
    this.fetchPosts();
  },
  methods: {
    fetchPosts() {
      axios
        .get("https://jsonplaceholder.typicode.com/posts")
        .then((response) => {
          this.posts = response.data;
        })
        .catch((error) => {
          console.error("Ошибка при загрузке постов:", error);
        });
    },
    openDrawer(post) {
      this.selectedPost = { ...post };
      this.drawer = true;
    },
    closeDrawer() {
      this.drawer = false;
      this.selectedPost = null;
    },
    savePost() {
      this.titleError = this.selectedPost.title ? "" : "Заголовок не может быть пустым";
      this.bodyError = this.selectedPost.body ? "" : "Содержимое не может быть пустым";
      const index = this.posts.findIndex(
        (post) => post.id === this.selectedPost.id
      );
      if (this.selectedPost.title == "" || this.selectedPost.body == "") {
        this.errorSnackbar.message = "Заполните поля";
        this.errorSnackbar.visible = true;
      }
      else 
      {
        this.$set(this.posts, index, { ...this.selectedPost });
        this.successSnackbar.message = "Пост отредактирован";
        this.successSnackbar.visible = true;
        this.closeDrawer();
      }
      
    },
    openAddPostDrawer() {
      this.newPost = { title: "", body: "" };
      this.titleError = "";
      this.bodyError = "";
      this.addDrawer = true;
    },
    closeAddDrawer() {
      this.addDrawer = false;
    },
    addPost() {
      this.titleError = this.newPost.title ? "" : "Заголовок не может быть пустым";
      this.bodyError = this.newPost.body ? "" : "Содержимое не может быть пустым";

      if (this.titleError || this.bodyError) {
        this.errorSnackbar.message = "Заполните поля";
        this.errorSnackbar.visible = true;
      }
      else{
        const newPost = {
          id: this.posts.length + 1,
          title: this.newPost.title,
          body: this.newPost.body,
        };
        this.posts.push(newPost);
        this.successSnackbar.message = "Пост добавлен";
        this.successSnackbar.visible = true;
        this.closeAddDrawer();
      }
    },
    confirmDeletePost(post) {
      this.postToDelete = post;
      this.deleteDialog = true;
    },
    deletePost() {
      this.posts = this.posts.filter((post) => post.id !== this.postToDelete.id);
      this.errorSnackbar.message = "Пост удален";
      this.errorSnackbar.visible = true;
      this.closeDeleteDialog();
    },
    closeDeleteDialog() {
      this.deleteDialog = false;
      this.postToDelete = null;
    },
  },
};
</script>

<style>

</style>
<template>
  <v-app>
    <v-tabs
      v-model="tab"
      background-color="primary"
      dark
      fixed-tabs
    >
      <v-tab :key="0" @click="onTabChange('/one')">Tab One</v-tab>
      <v-tab :key="1" @click="onTabChange('/two')">Tab Two</v-tab>
    </v-tabs>

    <router-view></router-view>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      tab: null,
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      }
    };
  },
  created() {
    this.syncTabWithRoute();
  },
  watch: {
    $route() {
      this.syncTabWithRoute();
    }
  },
  methods: {
    syncTabWithRoute() {
      this.tab = this.$route.path === '/one' ? 0 : 1;
    },
    onTabChange(route) {
      this.$router.push(route);
    },
    showNotification(message, color = 'success') {
      this.snackbar = { show: true, message, color };
    },
  },
};
</script>

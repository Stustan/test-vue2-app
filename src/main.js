import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from "./routes";

Vue.config.productionTip = false

new Vue({
  vuetify,
  router, 
  render: h => h(App),
}).$mount('#app');

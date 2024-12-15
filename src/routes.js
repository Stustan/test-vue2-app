import Vue from 'vue';
import Router from "vue-router";
import TabOne from '@/components/TabOne.vue';
import TabTwo from '@/components/TabTwo.vue';

Vue.use(Router);

const routes =  [
    { path: '/one', name: 'One', component: TabOne },
    { path: '/two', name: 'Two', component: TabTwo },
    { path: '*', redirect: '/one' }
  ];

export default new Router({
  mode: 'history',
  routes,
});
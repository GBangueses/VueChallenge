import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/photos',
    },
    {
      path: '/photos',
      name: 'photos',
      component: () =>
        import(/* webpackChunkName: "bundle.photo" */ './views/photo.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () =>
        import(/* webpackChunkName: "bundle.about" */ './views/about.vue'),
    },
    {
      path: '/error',
      name: 'error',
      component: () =>
        import(/* webpackChunkName: "bundle.about" */ './views/error.vue'),
    },
    {
      path: '*',
      component: () =>
        import(/* webpackChunkName: "bundle.about" */ './views/error.vue'),
    },
  ],
});

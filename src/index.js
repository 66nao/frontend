/**
 * Created by erguotou on 2015/11/27.
 */
'use strict';
define(function (require) {

  var App = Vue.extend({});

  var router = new VueRouter({
    history: true
  });

  router.map({
    '/welcome': {
      component: require('./static/js/welcome/welcome.js')
    },
    '/table': {
      component: require('./static/js/table/table.js')
    }
  });

  router.start(App, '#app');
});

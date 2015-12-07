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
      component: function(resolve) {
        require.async('./static/js/welcome/welcome.js', resolve)
      }
    },
    '/table': {
      component: function(resolve) {
        require.async('./static/js/table/table.js', resolve)
      }
    }
  });

  router.start(App, '#app');
});

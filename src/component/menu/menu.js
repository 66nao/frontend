/**
 * Created by erguotou on 2015/12/17.
 */

'use strict';
define(function (require) {
  var menuConfig = require('./menu.config.json', 'json');
  var addRouter = function addRouter(menu) {
    var component = null;
    if (menu.){
      component: function(resolve) {
        require.async(menu.main, resolve);
      },
      auth: menu.auth ? true : false
    };
    $router.on(menu.link, component);
  };
  for(var k in menuConfig) {
    addRouter(menuConfig[k]);
  }
  Vue.component('kf-menu', {
    template: require('./menu.html', 'html'),
    data: function() {
      return {
        menus: menuConfig
      };
    }
  });
});

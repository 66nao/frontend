/**
 * Created by erguotou on 2015/12/17.
 */

'use strict';
define(function (require) {
  // 获取菜单配置
  var menuConfig = require('./menu.json', 'json');
  Vue.component('kf-menu', {
    template: require('./menu.html', 'html'),
    data: function() {
      return {
        isOpened: false,
        menus: menuConfig
      };
    },
    methods: {
      calcHeight: function(subMenus) {
        return 2.5 * Object.keys(subMenus).length + 'rem';
      }
    }
  });
});

/**
 * Created by erguotou on 2015/12/17.
 */

'use strict';
define(function (require) {
  Vue.component('kf-menu', {
    template: require('./menu.html', 'html'),
    data: function() {
      return {
        menus: require('./menu.config.json', 'json')
      };
    }
  });
});

/**
 * Created by erguotou on 2015/12/17.
 */

'use strict';
define(function (require) {
  // 获取菜单配置
  var menuConfig = require('./menu.config.json', 'json');
  // 添加路由方法
  var addRouter = function addRouter(menu) {
    // 当前父路由是否需要验证
    // 规定：所有子路由是否需要认证才可访问都是由父级路由控制的
    var menuComp = {
      auth: menu.auth ? true : false
    };
    if (menu.subMenus) {
      var subRouter = {};
      if (menu.parent) {
        // 如果父级路由对应一个页面(要求父级的配置项中parent=true)，
        // 那么必须提供subMain配置项，表示当前父级路由对应的页面的入口文件
        menuComp.component = function(resolve) {
          require.async(menu.main, resolve);
        };
        subRouter['/'] = {
          component: function (resolve) {
            require.async(menu['subMain'], resolve);
          }
        }
      }
      // 添加所有子路由
      for (var sub in menu.subMenus) {
        (function(s) {
          subRouter[menu.subMenus[sub].link] = {
            component: function (resolve) {
              require.async(s.main, resolve);
            }
          };
        })(menu.subMenus[sub]);
      }
      menuComp['subRoutes'] = subRouter;
    } else {
      // 不包含子路由的路由
      menuComp.component = function(resolve) {
        require.async(menu.main, resolve);
      }
    }
    $router.on(menu.link, menuComp);
  };
  for(var k in menuConfig) {
    if (menuConfig.hasOwnProperty(k)) {
      addRouter(menuConfig[k]);
    }
  }
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

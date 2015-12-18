/**
 * Created by erguotou on 2015/11/27.
 */
'use strict';
define(function (require) {
  var ls = window.localStorage;
  window.$config = require('./component/config/config.js');
  var auth = require('./component/auth/auth.service.js');
  var App = Vue.extend({});

  var router = new VueRouter({
    history: true
  });
  // 每次路由跳转之前判断下一个路由是否需要认证，如果需要认证再进行身份认证，判断身份认证是否通过
  router.beforeEach(function(transition) {
    if (transition.to.auth) {
      auth.isLoggedInAsync(function(loggedIn) {
        if (loggedIn) {
          transition.next();
        } else {
          transition.abort('user not login');
          router.go('/login');
        }
      });
    } else {
      transition.next();
    }
  });
  // 每次请求前的拦截，如果有token则添加token认证信息
  Ajax.beforeEach = function(xhr) {
    var token = ls.getItem('token');
    if (token) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    }
  };
  // 错误信息拦截，如果是401，则跳到登录页
  Ajax.responseError = function(res, xhr) {
    if (xhr.status === 401) {
      router.go('/login');
    }
  };
  // 路由匹配规则
  router.map({
    '*': {
      component: {
        template: 'page not found.'
      }
    },
    '/': {
      component: function(resolve) {
        require.async('./app/welcome/welcome.js', resolve);
      }
    },
    '/table': {
      component: function(resolve) {
        require.async('./app/table/table.js', resolve);
      }
    },
    '/login': {
      component: function(resolve) {
        require.async('./app/account/login/login.js', resolve);
      }
    },
    '/user': {
      component: function(resolve) {
        require.async('./app/user/user.js', resolve);
      },
      auth: true
    },
    '/chat': {
      component: function(resolve) {
        require.async('./app/chat/chat.js', resolve);
      }
    },
    '/form':{
      component:function(resolve){
        require.async('./app/form/form.js', resolve);
      }
    },
      '/tooltip': {
        component: function (resolve) {
          require.async('./app/tooltip/tooltip.js', resolve);
        }
      }
  });
  // 初始化，根据localStorage中存储的用户信息去设置
  auth.init();
  // 暴露公共对象
  window.$router = router;
  // 调用菜单
  require('./component/menu/menu.js');
  // 启动应用
  router.start(App, '#app');
});

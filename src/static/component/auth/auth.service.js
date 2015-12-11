/**
 * Created by erguotou on 2015/12/9.
 */

'use strict';
define(function (require, exports, module) {
  var currentUser = null;

  function getUser() {
    if (currentUser) {
      return currentUser;
    }
    var token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    var result = null;
    Ajax.get('http://192.168.10.101:9300/ghost/api/v0.1/users/me/?status=all&include=roles', false)
      .done(function (data) {
        currentUser = data.users[0];
        result = currentUser;
      })
      .send();
    return result;
  }
  module.exports = {
    init: getUser,
    getCurrentUser: function() {
      return currentUser;
    },
    login: function(user) {
      return new Promise(function(resolve, reject) {
        // 获取access_token
        Ajax.post('http://192.168.10.101:9300/ghost/api/v0.1/authentication/token', user)
          .done(function(token) {
            localStorage.setItem('token', token.access_token);
            // 获取登录者身份信息
            getUser();
            resolve();
          })
          .error(function(err) {
            reject(err);
          })
          .send();
      });
    },
    logout: function() {
      localStorage.removeItem('token');
      currentUser = null;
      $router.go('/login');
    },
    isLoggedIn: function() {
      return currentUser && currentUser.roles;
    }
  };
});

/**
 * Created by erguotou on 2015/12/9.
 */

'use strict';
define(function (require, exports, module) {
  var currentUser = null, currentUserPromise = null;

  function initUser() {
    var token = localStorage.getItem('token');
    if (token) {
      currentUserPromise = new Promise(function(resolve, reject) {
        Ajax.get('http://192.168.10.101:9300/ghost/api/v0.1/users/me/?status=all&include=roles', false)
          .done(function(data) {
            currentUser = data.users[0];
            resolve(currentUser);
          })
          .error(reject)
          .send();
      });
    }
  }

  function getUserAsync(cb) {
    if (currentUser) {
      return cb(currentUser);
    }
    if (currentUserPromise) {
      currentUserPromise.then(function (user) {
        cb(user);
      }).catch(function() {
        cb(null);
      });
    } else {
      cb(null);
    }
  }

  module.exports = {
    init: initUser,
    getUserAsync: getUserAsync,
    login: function(user) {
      return new Promise(function(resolve, reject) {
        // 获取access_token
        Ajax.post('http://192.168.10.101:9300/ghost/api/v0.1/authentication/token', user)
          .done(function(token) {
            localStorage.setItem('token', token.access_token);
            // 获取登录者身份信息
            initUser();
            resolve();
          })
          .error(reject)
          .send();
      });
    },
    logout: function() {
      localStorage.removeItem('token');
      currentUser = null;
      currentUserPromise = null;
      $router.go('/login');
    },
    isLoggedInAsync: function(cb) {
      if (currentUser) {
        return cb(!!currentUser && !!currentUser.roles);
      }
      getUserAsync(function(user) {
        if (user) {
          cb(true);
        } else {
          cb(false);
        }
      });
    }
  };
});

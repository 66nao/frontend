/**
 * Created by erguotou on 2015/12/9.
 */

'use strict';
define(function (require, exports, module) {
  var currentUser = null;

  function getUser() {
    currentUser = new Promise(function(resolve, reject) {
      if (currentUser && !(currentUser instanceof Promise)) {
        resolve(currentUser);
      } else {
        var token = localStorage.getItem('token');
        if (token) {
          Ajax.get('http://192.168.10.101:9300/ghost/api/v0.1/users/me/?status=all&include=roles')
            .done(function(data) {
              currentUser = data.users[0];
              resolve(currentUser);
            })
            .error(function(err) {
              reject(err);
            })
            .send();
        }
      }
    });
    return currentUser;
  }
  module.exports = {
    init: getUser,
    getUserAsync: function(cb) {
      if (currentUser instanceof Promise) {
        currentUser.then(function(user) {
          cb(user);
        }).catch(function() {
          cb(null);
        });
          cb(null);
      } else {
        cb(currentUser);
      }
    },
    login: function(user) {
      return new Promise(function(resolve, reject) {
        // 获取access_token
        Ajax.post('http://192.168.10.101:9300/ghost/api/v0.1/authentication/token', user)
          .done(function(token) {
            localStorage.setItem('token', token.access_token);
            // 获取登录者身份信息
            getUser().then(resolve);
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
    isLoggedInAsync: function(cb) {
      if (currentUser instanceof Promise) {
        currentUser.then(function() {
          cb(true);
        }).catch(function() {
          cb(false);
        });
      } else {
        cb (currentUser && currentUser.roles);
      }
    }
  };
});

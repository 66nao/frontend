/**
 * Created by erguotou on 2015/12/10.
 */

'use strict';
define(function (require, exports, module) {
  var authService = require('./auth.service.js');
  module.exports = {
    template: require('./login.html', 'html'),
    data: function() {
      return {
        user: {
          'grant_type': 'password',
          username: null,
          password: null,
          'client_id': 'ghost-admin'
        }
      };
    },
    methods: {
      doLogin: function() {
        if (this.user.username && this.user.password) {
          // 获取access_token
          Ajax.post('http://localhost:2368/ghost/api/v0.1/authentication/token', this.user)
            .done(function(token) {
              localStorage.setItem('token', token.access_token);
              // 获取登录者身份信息
              Ajax.get('http://localhost:2368/ghost/api/v0.1/users/me/?status=all&include=roles')
                .done(function(user) {
                  authService.setUser(user);
                  $router.go('/need-auth');
                })
                .error(function(err) {
                  console.error(err);
                })
                .send();
            })
            .error(function(err, xhr) {
              console.error('error: ', err, xhr);
            })
            .send();
        }
      }
    }
  };
});

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
          authService.login(this.user).then(function() {
            // 成功后跳转
            $router.go('/user');
          });
        }
      }
    }
  };
});

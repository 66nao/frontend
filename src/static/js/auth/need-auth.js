/**
 * Created by erguotou on 2015/12/9.
 */

'use strict';
define(function (require, exports, module) {
  var authService = require('../../component/auth/auth.service.js');
  module.exports = {
    template: require('../../../view/auth/need-auth.html', 'html'),
    data: function() {
      return {
        user: {
          name: null
        }
      }
    },
    methods: {
      logout: authService.logout
    },
    route: {
      data: function(transition) {
        var self = this;
        authService.getUserAsync(function(user) {
          if (user) {
            self.user.name = user.name;
          }
        });
        transition.next();
      }
    }
  };
});

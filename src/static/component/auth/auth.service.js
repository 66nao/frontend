/**
 * Created by erguotou on 2015/12/9.
 */

'use strict';
define(function (require, exports, module) {
  var currentUser = null;
  module.exports = {
    isLoggedIn: function() {
      return !!currentUser.role;
    }
  };
});

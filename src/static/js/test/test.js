/**
 * Created by erguotou on 2015/11/27.
 */

'use strict';
define(function (require, exports, module) {
  require('../core/a')();
  require('../core/b')();
  module.exports = function() {
    alert('this is a test');
  };
});

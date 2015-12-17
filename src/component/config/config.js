/**
 * Created by erguotou on 2015/12/16.
 */

'use strict';
define(function (require, exports, module) {
  var config;
  if (DEBUG) {
    config = {
      GHOST_SERVER_HOST: 'http://192.168.10.101:9300/',
      MOCK_SERVER_HOST: ''
    };
  } else {
    config = {
      GHOST_SERVER_HOST: 'http://ghost.org/',
      MOCK_SERVER_HOST: ''
    };
  }
  module.exports = config;
});

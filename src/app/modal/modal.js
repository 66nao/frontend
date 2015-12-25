/**
 * Created by huayuehong on 2015/12/23.
 */
'use strict';
define(function (require, exports, module) {
  require('../../component/modal/modal.js');
  module.exports = {
    template: require('./modal.html', 'html'),
    data: function() {
      return {
        showModal: false
      };
    }
  };
});

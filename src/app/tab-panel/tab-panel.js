/**
 * Created by huying on 2015/12/22.
 */
'use strict';
define(function (require, exports, module) {
  require('/component/tab-panel/tab-panel.js');
  module.exports = {
    template: require('./tab-panel.html', 'html'),
    data: function() {
      return {
      };
    }

  };
});


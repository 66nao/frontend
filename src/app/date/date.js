/**
 *
 * Created by erguotou on 16/2/14.
 */
'use strict';

define(function (require, exports, module) {
  require('../../component/date-picker/date-picker.js');
  module.exports = {
    template: require('./date.html', 'html'),
    data: function() {
      return {
        start: '',
        end: ''
      };
    }
  };
});

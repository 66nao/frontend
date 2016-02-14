/**
 *
 * Created by erguotou on 16/2/14.
 */
'use strict';

define(function (require, exports, module) {
  Vue.component('date-picker', {
    template: require('./date-picker.html', 'html'),
    props: {
      id: {
        type: String,
        require: true
      },
      date: {
        type: String,
        required: true,
        twoWay: true
      }
    },
    ready: function() {
      var self = this;
      laydate({
        elem: '#' + this.id,
        init: false,
        format: 'YYYY-MM-DD',
        choose: function(value) {
          self.date = value;
        }
      });
    },
    destroyed: function() {
      laydate.destroy();
    }
  });
});

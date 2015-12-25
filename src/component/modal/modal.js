/**
 * Created by huayuehong on 2015/12/23.
 */
'use strict';
define(function (require) {
  Vue.component('modal', {
    template: require('./modal.html', 'html'),
    props: {
      show: {
        type: Boolean,
        required: true,
        twoWay: true
      }
    }
  });
});

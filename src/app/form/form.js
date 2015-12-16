/**
 * Created by huayuehong on 2015/12/14.
 */
'use strict';
define(function (require, exports, module) {

  module.exports = {
    template: require('../../../view/form/form.html','html'),
    data: function() {
      return {
        isSubmitted: false,
        comment: ''
      };
    },
    methods: {
      doSubmit: function() {
        this.isSubmitted = true;
      }
    },
    watch: {
      comment: function() {
        this.isSubmitted = false;
      }
    }
  };
});

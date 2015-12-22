/**
 * Created by huayuehong on 2015/12/14.
 */
'use strict';
define(function (require, exports, module) {
  Vue.validator('call', function (val) {
    return /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(val)
  })
  module.exports = {
    template: require('./form.html','html'),
    data: function() {
      return {
        isSubmitted: false,
        comment: '',
        test:null,
        hand:null
      };
    }
    //methods: {
    //  doSubmit: function() {
    //    this.isSubmitted = true;
    //  }
    //},
    //watch: {
    //  comment: function() {
    //    this.isSubmitted = false;
    //  }
    //}




  };
});

/**
 * Created by erguotou on 2015/12/4.
 */

'use strict';
define(function (require, exports, module) {
  Vue.filter('evaluation', function (value) {
    var tmp = Math.ceil(parseInt(value) / 10);
    if (tmp >= 9) {
      return '优秀';
    } else if (tmp >= 6) {
      return '良好';
    } else {
      return '不及格';
    }
  });
  module.exports = {
    template: require('./table.html', 'html'),
    data: function() {
      return {
        search: '',
        orderBy: '',
        orderReverse: 1,
        students: null
      };
    },
    methods : {
      fOrder: function (name, reverse) {
        this.orderBy = name;
        this.orderReverse = reverse;
      }
    },
    route: {
      activate: function (transition) {
        this.students = [{
          name: 'Li Lei',
          score: 75
        }, {
          name: 'Han Meimei',
          score: 82
        }, {
          name: 'Jerry',
          score: 59
        }, {
          name: 'Tom',
          score: 90
        }];
        transition.next();
      }
    }
  };
});

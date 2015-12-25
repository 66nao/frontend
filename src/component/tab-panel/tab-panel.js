/**
 * Created by huying on 2015/12/22.
 */
'use strict';
define(function (require, exports, module) {
  Vue.component('kf-tab', {
    template: require('./tab-panel.html', 'html'),
    props: function() {
      return {
        effect: {
          type: String,
          default: 'fade-in'
        },
        renderData: {
          type: Array,
          default: []
        }
      }
    },
    data: function() {
      return {
        active: 0
      }
    },
    components: {
      'tab': {
        template: require('./tab.html', 'html'),
        props: function() {
          return {
            activeIndex: {
              type: Number,
              default: 0
            }
          }
        },
        data: function () {
          return {
            renderData: [
              {header: '1'},
              {header: '2'}
            ]
          }
        },
        methods: {
          click: function (index, el) {
            if (!el.disabled)
              this.activeIndex = index;
          }
        }
      },
      'panel': {
        template: require('./panel.html', 'html'),
        props: function() {
          return {
            activeIndex: {
              type: Number,
              default: 0
            }
          }
        },
        data: function () {
          return {
            panels: [
              {content: 'sfjdkafj;advgj'},
              {content: 'xvjdfjvgoidehjsovg'}
            ]
          }
        }
      }
    }
  });
});

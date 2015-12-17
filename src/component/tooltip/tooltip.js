/**
 * Created by huying on 2015/12/15.
 */
'use strict';
define(function (require) {
  var ARROW_HEIGHT = 8;
  Vue.component('tooltip', {
    template: require('./tooltip.html', 'html'),
    data: function() {
      return {
        position: {
          top: 0,
          left: 0
        },
        show: true
      };
    },
    props: {
      trigger: {
        type: String,
        'default': 'click'
      },
      effect: {
        type: String,
        'default': 'fadein'
      },
      title: {
        type: String
      },
      content: {
        type: String
      },
      header: {
        type: Boolean,
        'default': true
      },
      placement: {
        type: String
      }
    },
    methods: {
      toggle: function() {
        this.show = !this.show;
      }
    },
    ready: function() {
      if (!this.$els.popover) {
        return console.error('Could not find popover v-el in your component that uses popoverMixin.');
      }
      var popover = this.$els.popover;
      var trigger = this.$els.trigger.children[0];
      var that = this;

      if (this.trigger === 'hover') {
        this._mouseenterEvent = trigger.addEventListener('mouseenter', function() {
          that.show = true;
        });
        this._mouseleaveEvent = trigger.addEventListener('mouseleave', function() {
          that.show = false;
        });
      } else if (this.trigger === 'focus') {
        this._focusEvent = trigger.addEventListener('focus', function() {
          that.show = true;
        });
        this._blurEvent = trigger.addEventListener('blur', function() {
          that.show = false;
        });
      } else {
        that._clickEvent = trigger.addEventListener('click', that.toggle);
      }
      this.$nextTick(function() {
        switch (this.placement) {
          case 'top' :
            this.position.left = trigger.offsetWidth /2  - popover.offsetWidth /2 ;
            this.position.top = - popover.offsetHeight - ARROW_HEIGHT ;
            break;
          case 'left':
            //this.position.left = trigger.offsetLeft - popover.offsetWidth;
            this.position.top = trigger.offsetTop + trigger.offsetHeight /2 - popover.offsetHeight /2;
            break;
          case 'right':
            // this.position.left = trigger.offsetLeft + trigger.offsetWidth;
            this.position.top = trigger.offsetHeight /2 - popover.offsetHeight /2 ;
            break;
          case 'bottom':
            this.position.left = trigger.offsetWidth /2  - popover.offsetWidth /2 ;
            this.position.top = trigger.offsetHeight + ARROW_HEIGHT;
            break;
          default:
            console.log('Wrong placement prop');
        }
        popover.style.top = this.position.top + 'px';
        popover.style.left = this.position.left + 'px';
        popover.style.display = 'none';
        this.show = !this.show;
      });
    },
    beforeDestroy: function() {
      if (this._blurEvent) {
        this._blurEvent.remove();
        this._focusEvent.remove();
      }
      if (this._mouseenterEvent) {
        this._mouseenterEvent.remove();
        this._mouseleaveEvent.remove();
      }
      if (this._clickEvent) {
        this._clickEvent.remove();
      }
    }
  });
});

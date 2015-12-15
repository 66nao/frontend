/**
 * Created by Administrator on 2015/12/9.
 */

'use strict';
define(function (require, exports, module) {
  /*function goBottom() {
    var timer = setInterval('runToBottom()',500);
  }*/
  /*function runToBottom(){
    var div = document.getElementById('chat-box');
    div.scrollTop = div.scrollHeight;
  }*/
  var $chatsNode = null;
  module.exports = {
    template: require('./chat.html', 'html'),
    data: function() {
      return {
        messages: [],
        text: ''
      };
    },
    methods: {
      send: function() {
        this.messages.push({
          avatar: 'http://gexing.edujq.com/img/2013/04/19/04190956585662.jpg',
          time: new Date().toLocaleDateString(),
          name: 'Hy' + parseInt(Math.random() * 10),
          text: 'Hello: ' + this.text,
          role: 'sender'
        });
        this.text = '';
        this.messages.push({
          avatar: 'http://img.name2012.com/uploads/allimg/2015-06/30-023130_276.jpg',
          time: new Date().toLocaleDateString(),
          name: 'Hghhgh',
          text: 'ok',
          role: 'receiver'
        });
      }
    },
    ready: function() {
      $chatsNode = document.querySelector('.chat-box .chats');
    },
    watch: {
      'messages': function() {
        this.$nextTick(function () {
          $chatsNode.parentNode.scrollTop = $chatsNode.clientHeight;
        });
      }
    }
  };
});

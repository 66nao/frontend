/** * 路由信息 */'use strict';define(function (require, exports, module) {  module.exports = function(router) {    router.map({              '/chat': {          component: function(resolve) {            require.async('/app/chat/chat.js', resolve);          }                  },              '/form': {          component: function(resolve) {            require.async('/app/form/form.js', resolve);          }                  },              '/table': {          component: function(resolve) {            require.async('/app/table/table.js', resolve);          }                  },              '/tooltip': {          component: function(resolve) {            require.async('/app/tooltip/tooltip.js', resolve);          }                  },              '/tab-panel': {          component: function(resolve) {            require.async('/app/tab-panel/tab-panel.js', resolve);          }                  },              '/sub-menu': {          component: function(resolve) {            require.async('/app/sub-menu/sub-menu.js', resolve);          }                      ,subRoutes: {                              '/': {                  component: function(resolve) {                    require.async('/app/sub-menu/sub/main.js', resolve);                  }                },                                            '/sub1': {                  component: function(resolve) {                    require.async('/app/sub-menu/sub/sub1.js', resolve);                  }                },                              '/sub2': {                  component: function(resolve) {                    require.async('/app/sub-menu/sub/sub2.js', resolve);                  }                }                          }                  }          });  };});
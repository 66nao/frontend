/*coolie@1.0.25*/
"use strict";define("0",["7"],function(n){var o=window.localStorage,t=n("7"),e=Vue.extend({}),a=new VueRouter({history:!0});a.beforeEach(function(n){n.to.auth?t.isLoggedInAsync(function(o){if(o)n.next();else{n.abort("user not login");a.go("/login")}}):n.next()});Ajax.beforeEach=function(n){var t=o.getItem("token");t&&n.setRequestHeader("Authorization","Bearer "+t)};Ajax.responseError=function(n,o){401===o.status&&a.go("/login")};a.map({"*":{component:{template:"page not found."}},"/":{component:function(o){n.async("1",o)}},"/table":{component:function(o){n.async("2",o)}},"/login":{component:function(o){n.async("3",o)}},"/user":{component:function(o){n.async("4",o)},auth:!0},"/chat":{component:function(o){n.async("5",o)}},"/form":{component:function(o){n.async("6",o)}}});t.init();window.$router=a;a.start(e,"#app")});
"use strict";define("7",[],function(n,t,e){function o(){var n=localStorage.getItem("token");n&&(r=new Promise(function(n,t){Ajax.get("http://192.168.10.101:9300/ghost/api/v0.1/users/me/?status=all&include=roles",!1).done(function(t){i=t.users[0];n(i)}).error(t).send()}))}function u(n){if(i)return n(i);r?r.then(function(t){n(t)})["catch"](function(){n(null)}):n(null)}var i=null,r=null;e.exports={init:o,getUserAsync:u,login:function(n){return new Promise(function(t,e){Ajax.post("http://192.168.10.101:9300/ghost/api/v0.1/authentication/token",n).done(function(n){localStorage.setItem("token",n.access_token);o();t()}).error(e).send()})},logout:function(){localStorage.removeItem("token");i=null;r=null;$router.go("/login")},isLoggedInAsync:function(n){if(i)return n(!!i&&!!i.roles);u(function(t){n(t?!0:!1)})}}});
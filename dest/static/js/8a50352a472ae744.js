/*coolie@1.0.25*/
"use strict";define("0",["4","5","6","7"],function(n){var o=window.localStorage;window.$config=n("4");var e=n("5"),t=Vue.extend({}),i=new VueRouter({history:!0});i.beforeEach(function(n){n.to.auth?e.isLoggedInAsync(function(o){if(o)n.next();else{n.abort("user not login");i.go("/login")}}):n.next()});Ajax.beforeEach=function(n){var e=o.getItem("token");e&&n.setRequestHeader("Authorization","Bearer "+e)};Ajax.responseError=function(n,e){if(401===e.status){o.removeItem("token");i.go("/login")}};i.map({"*":{component:{template:"<div>page not found.</div>"}},"/":{component:function(o){n.async("1",o)}},"/login":{component:function(o){n.async("2",o)}},"/user":{component:function(o){n.async("3",o)},auth:!0}});n("6")(i);e.init();window.$router=i;n("7");i.start(t,"#app")});
"use strict";define("4",[],function(t,S,e){var o;o={GHOST_SERVER_HOST:"http://ghost.org/",MOCK_SERVER_HOST:""};e.exports=o});
"use strict";define("5",[],function(n,o,t){function e(){var n=localStorage.getItem("token");n&&(r=new Promise(function(n,o){Ajax.get($config.GHOST_SERVER_HOST+"ghost/api/v0.1/users/me/?status=all&include=roles",!1).done(function(o){u=o.users[0];n(u)}).error(o).send()}))}function i(n){if(u)return n(u);r?r.then(function(o){n(o)})["catch"](function(){n(null)}):n(null)}var u=null,r=null;t.exports={init:e,getUserAsync:i,login:function(n){return new Promise(function(o,t){Ajax.post($config.GHOST_SERVER_HOST+"ghost/api/v0.1/authentication/token",n).done(function(n){localStorage.setItem("token",n.access_token);e();o()}).error(t).send()})},logout:function(){localStorage.removeItem("token");u=null;r=null;$router.go("/login")},isLoggedInAsync:function(n){if(u)return n(!!u&&!!u.roles);i(function(o){n(o?!0:!1)})}}});
"use strict";define("6",[],function(n,o,s){s.exports=function(o){o.map({"/chat":{component:function(o){n.async("8",o)}},"/form":{component:function(o){n.async("9",o)}},"/table":{component:function(o){n.async("a",o)}},"/tooltip":{component:function(o){n.async("b",o)}},"/sub-menu":{component:function(o){n.async("c",o)},subRoutes:{"/":{component:function(o){n.async("d",o)}},"/sub1":{component:function(o){n.async("e",o)}},"/sub2":{component:function(o){n.async("f",o)}}}}})}});
"use strict";define("7",["g","h"],function(e){var n=e("g");Vue.component("kf-menu",{template:e("h"),data:function(){return{isOpened:!1,menus:n}},methods:{calcHeight:function(e){return 2.5*Object.keys(e).length+"rem"}}})});
define("g",[],function(y,d,r){r.exports={"chat":{"text":"chat","link":"/chat"},"form":{"text":"form","link":"/form"},"table":{"text":"table","link":"/table"},"tooltip":{"text":"tooltip","link":"/tooltip"},"sub-menu":{"text":"sub-menu","link":"/sub-menu","parent":true,"subMenus":{"sub-menu-1":{"text":"sub-menu-1","link":"/sub1"},"sub-menu-2":{"text":"sub-menu-2","link":"/sub2"}}}}});
define("h",[],function(y,d,r){r.exports="<nav> <ul> <li><a v-link=\"{path: '/', exact: true}\">Welcome</a></li> <li><a v-link=\"'/login'\">Login</a></li> <li><a v-link=\"'/user'\">User info</a></li> <li v-for=\"menu in menus\" > <template v-if=\"!menu.subMenus\"> <a v-link=\"menu.link\">{{menu.text}}</a> </template> <template v-else> <a v-link=\"menu.parent?menu.link:''\" :class=\"{pointer: !menu.parent}\"> {{menu.text}} <span class=\"arrow fa fa-caret-right\" :class=\"{'arrow-down': isOpened}\" @click.stop.prevent=\"isOpened = !isOpened\"></span> </a> <ul v-show=\"isOpened\" transition=\"expand\" :style=\"{height: calcHeight(menu.subMenus)}\"> <li v-for=\"sub in menu.subMenus\"> <a v-link=\"menu.link+sub.link\">{{sub.text}}</a> </li> </ul> </template> </li> </ul> </nav> "});
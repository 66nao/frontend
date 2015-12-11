/**
 * Ajax异步请求模块，支持全局的请求前拦截、全局的错误返回拦截、链式的请求书写方法
 * 参照：https://github.com/fdaciuk/ajax/blob/master/src/ajax.js
 * Ajax.beforeEach = function(xhr) {
 *   xhr.setRequestHeader('Authorization', 'Basic xxxxxx')
 * }}
 * Ajax.responseError = function(data, xhr) {
 *    console.log(xhr.status);
 * }
 * Ajax.get('')
 *   .set('Content-Type', 'application/json')
 *   .done(function(data, xhr) {console.log('done: ', data)})
 *   .error(function(data, xhr) {console.log('error: ', data)})
 *   .always(function(data, xhr) {console.log('always: ', data)})
 *   .send();
 * Ajax.post('');
 * Ajax.put('');
 * Ajax.delete('');
 * @author guozhiqiang
 * @version 0.1.0
 */
;(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.cmd) {
    define('Ajax', factory);
  }
  else if (typeof exports === 'object') {
    exports = module.exports = factory();
  }
  else {
    root.Ajax = factory();
  }
})(window, function () {
  'use strict';
  // 链式方法，包括后面的set send
  var promiseMethods = {
    done: function () {
    },
    error: function () {
    },
    always: function () {
    }
  };
  // 准备发送异步请求
  var request = function (type, url, data, async) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, url || '', async !== false);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var promises = promise();
    // 链式set方法，设置请求头信息
    promises.set = function(key, value) {
      xhr.setRequestHeader(key, value);
      return promises;
    };
    // 开始发送异步请求
    promises.send = function () {
      // 任意请求前执行拦截操作
      if (isFunction(Ajax.beforeEach)) {
        Ajax.beforeEach(xhr);
      }
      xhr.addEventListener('readystatechange', ready, false);
      xhr.send(objectToQueryString(data));
      return promises;
    };
    return promises;
  };
  // 解析请求的返回信息
  var parse = function parse(xhr) {
    var result;
    try {
      result = JSON.parse(xhr.responseText);
    } catch (e) {
      result = xhr.responseText;
    }
    return [result, xhr];
  };
  // 请求后的回调
  var ready = function () {
    var xhr = this;
    var DONE = 4;
    if (xhr.readyState === DONE) {
      xhr.removeEventListener('readystatechange', ready, false);
      var jsonResult = parse(xhr);
      if (xhr.status >= 200 && xhr.status < 300) {
        promiseMethods.done.apply(promiseMethods, jsonResult);
      } else {
        // 所有的错误请求都可以拦截
        if (isFunction(Ajax.responseError)) {
          Ajax.responseError.apply(Ajax, jsonResult);
        }
        promiseMethods.error.apply(promiseMethods, jsonResult);
      }
      promiseMethods.always.apply(promiseMethods, jsonResult);
    }
  };
  // promise模块
  var promise = function () {
    var allPromises = {};
    Object.keys(promiseMethods).forEach(function (promise) {
      allPromises[promise] = generatePromise.call(this, promise);
    }, this);
    return allPromises;
  };
  // 生成promise
  var generatePromise = function generatePromise(method) {
    return function (callback) {
      promiseMethods[method] = callback;
      return this;
    };
  };
  // 将请求的数据转为查询字符串
  var objectToQueryString = function objectToQueryString(data) {
    return isObject(data) ? getQueryString(data) : data;
  };
  // url拼接
  var getQueryString = function getQueryString(object) {
    return Object.keys(object).map(function (item) {
      return encodeURIComponent(item) + '=' + encodeURIComponent(object[item]);
    }).join('&');
  };
  var isObject = function isObject(data) {
    return '[object Object]' === Object.prototype.toString.call(data);
  };
  var isFunction = function isFunction(func) {
    return typeof func === 'function';
  };
  // 对外暴露的对象
  var Ajax = {
    beforeEach: null,
    responseError: null,
    get: function (url, async) {
      return request('GET', url, null, async);
    },
    post: function (url, data, async) {
      return request('POST', url, data, async);
    },
    put: function (url, data, async) {
      return request('PUT', url, data, async);
    },
    delete: function (url, data, async) {
      return request('DELETE', url, data, async);
    }
  };
  return Ajax;
});

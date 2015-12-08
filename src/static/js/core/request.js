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
  var global = {
    beforeEach: null,
    responseError: null
  };
  var promiseMethods = {
    done: function () {
    },
    error: function () {
    },
    always: function () {
    }
  };
  var request = function (type, url, data) {
    var xhr = new XMLHttpRequest();
    var contentType = 'application/x-www-form-urlencoded';
    xhr.open(type, url || '', true);
    xhr.setRequestHeader('Content-Type', contentType);
    var promises = promise();
    promises.set = function(key, value) {
      xhr.setRequestHeader(key, value);
      return promises;
    };
    promises.send = function () {
      if (global.beforeEach) {
        global.beforeEach(xhr);
      }
      xhr.addEventListener('readystatechange', ready, false);
      xhr.send(objectToQueryString(data));
      return promises;
    };
    return promises;
  };
  var parse = function parse(xhr) {
    var result;
    try {
      result = JSON.parse(xhr.responseText);
    } catch (e) {
      result = xhr.responseText;
    }
    return [result, xhr];
  };
  var ready = function () {
    var xhr = this;
    var DONE = 4;
    if (xhr.readyState === DONE) {
      xhr.removeEventListener('readystatechange', ready, false);
      var jsonResult = parse(xhr);
      if (xhr.status >= 200 && xhr.status < 300) {
        promiseMethods.done.apply(promiseMethods, jsonResult);
      } else {
        if (global.responseError) {
          global.responseError.apply(global, jsonResult);
        }
        promiseMethods.error.apply(promiseMethods, jsonResult);
      }
      promiseMethods.always.apply(promiseMethods, jsonResult);
    }
  };
  var promise = function () {
    var allPromises = {};
    Object.keys(promiseMethods).forEach(function (promise) {
      allPromises[promise] = generatePromise.call(this, promise);
    }, this);
    return allPromises;
  };
  var generatePromise = function generatePromise(method) {
    return function (callback) {
      promiseMethods[method] = callback;
      return this;
    };
  };
  var objectToQueryString = function objectToQueryString(data) {
    return isObject(data) ? getQueryString(data) : data;
  };
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
  var Ajax = {
    beforeEach: function(func) {
      if (isFunction(func)) {
        global.beforeEach = func;
      }
    },
    responseError: function(func) {
      if (isFunction(func)) {
        global.responseError = func;
      }
    },
    get: function (url) {
      return request('GET', url, null);
    },
    post: function (url, data) {
      return request('POST', url, data);
    },
    put: function (url, data) {
      return request('PUT', url, data);
    },
    delete: function (url, data) {
      return request('DELETE', url, data);
    }
  };
  return Ajax;
});

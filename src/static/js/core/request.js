;(function( root, factory ) {
  'use strict';
  if( typeof define === 'function' && define.amd ) {
    define( 'Ajax', factory );
  }
  else if( typeof exports === 'object' ) {
    exports = module.exports = factory();
  }
  else {
    root.Ajax = factory();
  }
})(window, function() {
  'use strict';
  var noop = function() {};
  var promiseMethods = {
    header: noop,
    send: noop,
    done: noop,
    error: noop,
    always: noop
  };
  var parse = function parse(xhr) {
    var result;
    try {
      result = JSON.parse( xhr.responseText );
    } catch(e) {
      result = xhr.responseText;
    }
    return result;
  };
  var request = function(type, url, data) {
    var xhr = new XMLHttpRequest();
    var contentType = 'application/x-www-form-urlencoded';
    xhr.open(type, url || '', true);
    xhr.setRequestHeader('Content-Type', contentType);
    var promises = promise();
    promises.send = function() {
      xhr.addEventListener('readystatechange', ready, false);
      xhr.send(objectToQueryString(data));
    };
    return promises;
  };
  var ready = function() {
    var xhr = this;
    var DONE = 4;
    if(xhr.readyState === DONE) {
      xhr.removeEventListener('readystatechange', ready, false);
      var jsonResult = parse(xhr);
      promiseMethods.always.apply(promiseMethods, jsonResult);
      if(xhr.status >= 200 && xhr.status < 300) {
        return promiseMethods.done.apply(promiseMethods, jsonResult);
      }
      promiseMethods.error.apply(promiseMethods, jsonResult);
    }
  };
  var promise = function() {
    var allPromises = {};
    Object.keys(promiseMethods).forEach(function(promise) {
      allPromises[promise] = generatePromise.call(this, promise);
    }, this );
    return allPromises;
  };
  var generatePromise = function generatePromise(method) {
    return function( callback ) {
      promiseMethods[method] = callback;
      return this;
    };
  };
  var objectToQueryString = function objectToQueryString(data) {
    return isObject(data) ? getQueryString(data) : data;
  };
  var getQueryString = function getQueryString(object) {
    return Object.keys(object).map( function(item) {
      return encodeURIComponent(item) + '=' + encodeURIComponent(object[item]);
    }).join('&');
  };
  var isObject = function isObject(data) {
    return '[object Object]' === Object.prototype.toString.call(data);
  };
  var Ajax = {
    before: function() {

    },
    responseError: function(response) {

    },
    get: function(url) {
      return request('GET', url, null);
    },
    post: function(url, data) {
      return request('POST', url, data);
    },
    put: function(url, data) {
      return request('PUT', url, data);
    },
    delete: function(url, data) {
      return request('DELETE', url, data);
    }
  };
  return Ajax;
});

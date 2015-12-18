/**
 * Created by erguotou on 2015/12/18.
 */
var path = require('path'),
  fs = require('fs'),
  fsExtra = require('fs-extra'),
  argv = require('yargs').argv,
  Thenjs = require('thenjs');
require('colors');
var MUST_MODULES = ['account', 'user', 'welcome'];

// 参数中必须要有--config，指定配置文件开头
if (!argv.config || argv.config === true) {
  console.log('Your must past --config arguments, eg: node generate_product.js --config 66'.magenta);
  return false;
}

var file = path.resolve(__dirname, argv.config + '.menu.config.json');
Thenjs(function(cont) {
  // 判断文件是否存在，且文件可读
  fs.access(file, fs.R_OK, function(err) {
    if (err) {
      console.log('Please make sure the file %s exist and can be read.'.magenta, file);
      cont(new Error(err));
      return false;
    }
    cont();
  });
}).then(function(cont) {
  var dest = path.resolve(__dirname, '../src/component/menu/menu.config.json');
  // 复制文件
  fsExtra.copy(file, dest, function(err) {
    if (err) {
      console.log('Failed to copy file %s to %s, please make sure the file exist and the destination path is writable.'.red, file, dest);
      cont(new Error(err));
      return false;
    }
    cont();
  });
}).then(function(cont) {
  // 删除不必要的文件
  var menuConfig = require(file);
  var modules = Object.keys(menuConfig);
  // 加上必须存在的模块
  Array.prototype.push.apply(modules, MUST_MODULES);
  console.log('Needed modules include %s'.green, modules);
  var moduleDir = path.resolve(__dirname, '../src/app');
  fs.readdir(moduleDir, function(err, existModules) {
    if (err) {
      console.log('Please make sure the directory /src/app is exists and can be read.'.magenta);
      cont(new Error(err));
      return false;
    }
    // 判断已经存在的模块是否在配置文件中存在，如果不存在就删除该模块
    Thenjs.each(existModules, function(cont, module) {
      if (modules.indexOf(module) < 0) {
        var toRemoveModulePath = path.join(moduleDir, module);
        fsExtra.remove(toRemoveModulePath, function(err) {
          if (err) {
            console.log('Fail to remove directory %s.'.magenta, toRemoveModulePath);
            cont(new Error(err));
          } else {
            console.log('Success to remove unused module directory %s'.cyan, toRemoveModulePath);
            cont();
          }
        });
      } else {
        cont();
      }
    }).then(function() {
      console.log('Removed all necessary modules.'.green);
      cont();
    });
  });
}).then(function(cont) {
  // 执行构建任务
  var exec = require('child_process').exec;
  console.log('Now start to build...'.cyan);
  var cmd = 'npm install && cd ' + path.resolve(__dirname, '../src') + ' && coolie build';
  exec(cmd, function(err, stdout, stderr) {
    if (err) {
      console.log('Fail to exec build %s'.red, err);
      cont(new Error(err));
      return false;
    }
    if (stderr) {
      console.log(stderr.magenta);
      cont();
      return false;
    }
    console.log(stdout.white);
    console.log('Build complete.'.cyan);
    cont();
  });
}).fail(function (cont, error) { // 通常应该在链的最后放置一个 `fail` 方法收集异常
  console.log('Error info: %s'.red, error);
});

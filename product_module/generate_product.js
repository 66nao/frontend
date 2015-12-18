/**
 * Created by erguotou on 2015/12/18.
 */
var path = require('path'),
  fs = require('fs'),
  fsExtra = require('fs-extra'),
  argv = require('yargs').argv;

// 参数中必须要有--config，指定配置文件开头
if (!argv.config || argv.config === true) {
  console.error('Your must past --config arguments, eg: node generate_product.js --config 66');
  return false;
}

// 判断文件是否存在，且文件可读
var file = path.resolve(__dirname, argv.config + '.menu.config.json');
fs.access(file, fs.R_OK, function(err) {
  if (err) {
    console.error('Please make sure the file %s can be read.', file);
    return false;
  }
  var dest = path.resolve(__dirname, '../src/component/menu/menu.config.json');
  // 复制文件
  fsExtra.copy(file, dest, function(err) {
    if (err) {
      console.error('Failed to copy file %s to %s, please make sure the file exist and the destination path is writable.', file, dest);
      return false;
    }
    // 删除不必要的文件
    var menuConfig = require(file);
    var modules = Object.keys(menuConfig);
    var moduleDir = path.resolve(__dirname, '../src/app');
    fs.readdir(moduleDir, function(err, existModules) {
      if (err) {
        console.error('Please make sure the directory /src/app is exists and can be read.');
        return false;
      }
      existModules.push('login', 'user', 'welcome');
      for (var i = 0; i < existModules.length; i++) {
        if (modules.indexOf(existModules[i]) < 0) {
          var toRemoveModulePath = path.join(moduleDir, existModules[i]);
          fsExtra.remove(toRemoveModulePath, function(err) {
            if (err) {
              console.error('Fail to remove directory %s.', toRemoveModulePath);
            } else {
              console.info('Success to remove unused module directory %s', toRemoveModulePath)
            }
          });
        }
      }
      console.info('Removed all necessary modules.');
      // 执行构建任务
      var exec = require('child_process').exec;
      var cmd = 'npm install && cd ' + path.resolve(__dirname, '../src') + ' && coolie build';
      exec(cmd);
    });
  });
});

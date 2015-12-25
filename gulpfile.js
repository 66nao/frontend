var gulp = require('gulp'),
  fs = require('fs'),
  fsExtra = require('fs-extra'),
  path = require('path'),
  jshint = require('gulp-jshint'),
  stylint = require('gulp-stylint'),
  stylus = require('gulp-stylus'),
  browsersync = require('browser-sync').create(),
  reload = browsersync.reload,
  plumber = require('gulp-plumber'),
  _ = require('lodash');
require('colors');

// 源文件路径
var src = {
  assestStylus: 'src/assest/stylus/**/*.styl',
  otherStylus: ['src/**/*.styl', '!src/assest/stylus/**/*.styl'],
  js: ['src/**/*.js', '!src/**/*.min.js', '!src/assest/js/lib/**/*.js'],
  html: 'src/**/*.html'
};

// 编译后的文件路径
var compile = {
  assestCss: 'src/assest/css',
  otherCss: 'src/'
};

// js文件检查任务
gulp.task('js', function() {
  return gulp.src(src.js)
    .pipe(jshint())
    .pipe(jshint.reporter());
});

// stylus代码检查、自动编译、自动注入任务
gulp.task('stylus', function (done) {
  gulp.src(src.otherStylus)
    .pipe(plumber())
    .pipe(stylint())
    .pipe(stylint.reporter())
    .pipe(stylus())
    .pipe(gulp.dest(compile.otherCss))
    .pipe(reload({stream: true}));

  gulp.src(src.assestStylus)
    .pipe(plumber())
    .pipe(stylint())
    .pipe(stylint.reporter())
    .pipe(stylus())
    .pipe(gulp.dest(compile.assestCss))
    .pipe(reload({stream: true}));
  done();
});

// 监控任务，当删除源码时同时删除掉编译的对应文件
gulp.task('watch', function(done) {
  gulp.watch(src.js, gulp.series('js', reload));
  gulp.watch(src.html, reload);
  gulp.watch([src.otherStylus, src.assestStylus], gulp.series('stylus'))
    .on('unlink', function(filepath) {
      console.log('path: %', filepath);
      var toRemoveFilePath = path.resolve(filepath.replace('stylus', 'css').replace('.styl', '.css'));
      fs.exists(toRemoveFilePath, function (exists) {
        if (exists) {
          fs.unlink(toRemoveFilePath, function() {
            done();
          });
        }
      });
    })
    .on('unlinkDir', function(filedir) {
      console.log('dir: %s', filedir);
      fsExtra.remove(filedir.replace('stylus', 'css'), function() {
        done();
      });
    });
});

// 浏览器自动刷新
gulp.task('browser-sync', function () {
  browsersync.init({
    proxy: 'localhost:9200',
    port: 3111,
    ui: {
      port: 8181
    }
  });
});

// 根据产品配置文件生成路由文件
gulp.task('product', function(done) {
  var argv = require('yargs').argv,
    Thenjs = require('thenjs');
  var argConfig = argv.config;
  // 参数中必须要有--config，指定配置文件开头
  if (!argConfig || argConfig === true) {
    console.log('No config argument provided, use default \"dev\"'.cyan);
    argConfig = 'dev';
  }
  var allMenuConfigPath = path.join(__dirname, './product_module/menu.config.all.json'),
    allMenuConfig = null,
    productMenuConfigPath = path.resolve(__dirname, './product_module/config/', argConfig + '.config.json'),
    productMenuConfig = null,
    destMenuConfigPath = path.resolve(__dirname, './src/component/menu/menu.json'),
    destMenuConfig = {},
    destMenuClone = {},
    routerTempPath = path.resolve(__dirname, './product_module/router.temp'),
    routerFilePath = path.resolve(__dirname, './src/component/router.js');

  var judgeFileExist = function(path, cont) {
    fs.access(path, fs.R_OK, function(err) {
      if (err) {
        console.log('Please make sure the file %s exist and can be read.'.magenta, path);
        cont(new Error(err));
        return false;
      }
      cont();
    });
  };

  Thenjs(function(cont) {
    // 要求所有的菜单配置文件存在
    judgeFileExist.call(this, allMenuConfigPath, cont);
  }).then(function(cont) {
    // 要求产品的配置文件存在
    judgeFileExist.call(this, productMenuConfigPath, cont);
  }).then(function(cont) {
    // 要求路由模板文件存在
    judgeFileExist.call(this, routerTempPath, cont);
  }).then(function(cont) {
    allMenuConfig = require(allMenuConfigPath);
    productMenuConfig = require(productMenuConfigPath);
    // 产品配置文件必须存在required字段，标识需要使用哪些模块
    if (!productMenuConfig.required) {
      console.error('Please make sure that the \"required\" key is in your config file: %s.'.magenta, productMenuConfigPath);
      cont(new Error());
      return false;
    }
    for (var key in productMenuConfig.required) {
      var _config = allMenuConfig[key];
      var _subMenus = _config.subMenus;
      // destMenuConfig用于记录菜单所有配置
      destMenuConfig[key] = _config;
      // destMenuClone用于保存需要的菜单配置，会删除不需要的配置
      destMenuClone[key] = _.clone(_config, true);
      delete destMenuClone[key].main;
      delete destMenuClone[key].subMain;
      if (_subMenus) {
        for (var sub in _subMenus) {
          delete destMenuClone[key]['subMenus'][sub].main;
          if (!productMenuConfig.required[key]['sub'][sub]) {
            delete destMenuConfig[key]['subMenus'][sub];
            delete destMenuClone[key]['subMenus'][sub];
          }
        }
      }
    }
    // 写入菜单配置文件
    fsExtra.outputJson(destMenuConfigPath, destMenuClone, function(err) {
      if (err) {
        console.log('Fail to write to %s'.magenta, destMenuConfigPath);
        cont(new Error(err));
        return false;
      }
      cont();
    });
  }).then(function(cont) {
    var template = require('./product_module/template');
    // 替换模板
    fsExtra.readFile(routerTempPath, 'utf8', function (err, data) {
      if (err) {
        console.log('Fail to read router template file: %s'.magenta, routerTempPath);
        cont(new Error(err));
        return false;
      }
      // 将object转为array，方便模板编写
      var menuConfigArray = [];
      for (var menu in destMenuConfig) {
        menuConfigArray.push(destMenuConfig[menu]);
        if (destMenuConfig[menu].subMenus) {
          var subArray = [];
          for (var sub in destMenuConfig[menu].subMenus) {
            subArray.push(destMenuConfig[menu].subMenus[sub]);
          }
          destMenuConfig[menu].subMenus = subArray;
        }
      }
      var routerContent = template(data, {
        menus: menuConfigArray
      });
      cont(null, routerContent);
    });
  }).then(function(cont, routerContent) {
    // 生成路由文件
    fsExtra.outputFile(routerFilePath, routerContent, function(err ) {
      if (err) {
        console.log('Fail to write router file: %s'.magenta, routerFilePath);
        cont(new Error(err));
        return false;
      }
      cont();
    })
  }).fail(function(cont, err) {
    console.log('%s'.red, err);
    done(new Error(err));
  }).then(function() {
    console.log('Success generate {%s} product app.'.blue, argConfig);
    done();
  });
});

// 复制NPM包到开发目录
gulp.task('copy-dependence', function(done) {
  var dependence = require('./dependence.json');
  var prefixDependence = './node_modules',
    prefixDest = './src';
  for (var d in dependence) {
    if (dependence.hasOwnProperty(d)) {
      // npm源文件的路径和要拷贝到到路径
      if (typeof dependence[d] === "string") {
        dependence[d] = {
          type: 'js',
          src: dependence[d]
        }
      }
      var srcPath = path.join(prefixDependence, dependence[d].src),
        destParentPath = path.join(prefixDest, '/assest', dependence[d].type),
        destPath = path.join(destParentPath, '/lib', d);
      // 检查源文件的读写权限
      var stat;
      try {
        stat = fs.statSync(srcPath);
        if (!stat.isFile()) {
          console.error('路径%s不是一个文件，请检查配置文件dependence.json。', dependence[d]);
          break;
        }
      } catch (e) {
        console.error('npm源文件%s读写错误，检查文件是否存在，配置文件dependence.json是否出错。', srcPath);
        break;
      }
      // 拷贝文件
      try {
        fsExtra.copySync(srcPath, destPath);
        console.info('已完成依赖复制。%s --> %s', srcPath, destPath);
      } catch (e) {
        console.error('文件拷贝错误，请检查文件和目录的读写权限。%s --> %s', srcPath, destPath);
      }
    }
  }
  done();
});

// 开发任务集合
gulp.task('dev', gulp.series('product', gulp.parallel('stylus', 'js'), gulp.parallel('watch', 'browser-sync')));

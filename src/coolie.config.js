/**
 * ======================================================
 * coolie cli 配置文件 `coolie.config.js`
 * 使用 `coolie.init -c` 生成 `coolie.config.js` 文件模板
 * 当前配置文件所在的目录为构建的根目录
 *
 * @link http://coolie.ydr.me/guide/coolie.config.js/
 * @author ydr.me
 * @version 1.0.24
 * @create 2015-12-17 10:19:07
 * =======================================================
 */

'use strict';

module.exports = function (coolie) {
  // coolie 配置
  coolie.config({
    // 是否在构建之前清空目标目录
    clean: true,

    // js 构建
    js: {
      // 入口模块
      main: ['./index.js'],
      // coolie-config.js 路径
      'coolie-config.js': './coolie-config.js',
      // js 文件保存目录
      dest: './static/js/',
      // 分块配置
      chunk: []
    },

    // html 构建
    html: {
      // html 文件
      src: ['./index.html'],
      // 是否压缩
      minify: true
    },

    // css 构建
    css: {
      // css 文件保存目录
      dest: './static/css/',
      // css 压缩配置
      minify: {
        compatibility: 'ie8'
      }
    },

    // 资源
    resource: {
      // 资源保存目录
      dest: './static/res/',
      // 是否压缩
      minify: true
    },

    // 原样复制文件
    copy: [
      '/favicon.ico',
      'robots.txt'
    ],

    // 目标配置
    dest: {
      // 目标目录
      dirname: '../dest/',
      // 目标根域
      host: '',
      // 版本号长度
      versionLength: 16
    }
  });

  // 使用 coolie 中间件
  // coolie.use(require('coolie-*'));

  // 自定义 coolie 中间件
  //coolie.use(function (options) {
  //    // do sth.
  //    return options;
  //});
};

# 菜单配置说明
菜单配置文件是[menu.config.json](./menu.config.json)。当前菜单只支持一级子菜单，支持父级菜单可点击。
例如
```
/user      --> user.html
/user/add  --> add.html
/user/edit --> edit.html
```
另外菜单会自动加上系统必须的几个内置菜单，这些无法配置。

## 配置
- json对象的`key` 用于标识模块名，取方便识别的单词
- `text` 页面中显示的菜单的文字
- `link` 菜单对应的链接地址，子菜单会加上父级菜单的`link`(parent.link+sub.link)
- `parent` 必须在有子菜单时使用，否则无效。用于决定当前父级菜单是否对应一个页面而不仅仅是父级菜单。
- `main` 菜单入口文件，如果存在子菜单，那么该入口文件的模板中必须存在`<router-view></router-view>`
- `subMain` 当`parent`为`true`时必须提供，表示当前父级菜单对应的页面的入口文件
- `subMenus` 配置子菜单，具体配置和父级相同，只有`link`会自动带上父级`link`

## 示例
```json
{
  "tooltip-demo": {
    "text": "tooltip",
    "link": "/tooltip",
    "main": "/app/tooltip/tooltip.js"
  },
  "sub-menu-demo": {
    "text": "sub-menu",
    "link": "/sub-menu",
    "parent": true,
    "main": "/app/sub-menu/sub-menu.js",
    "subMain": "/app/sub-menu/sub/main.js",
    "subMenus": {
      "sub-menu-1": {
        "text": "sub-menu-1",
        "link": "/sub1",
        "main": "/app/sub-menu/sub/sub1.js"
      },
      "sub-menu-2": {
        "text": "sub-menu-2",
        "link": "/sub2",
        "main": "/app/sub-menu/sub/sub2.js"
      }
    }
  }
}
```

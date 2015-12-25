由于各产品使用的功能模块可能不一样，不同的产品会使用不同的模块，所以需要一个配置文件来生成对应的产品。
# 菜单配置说明
所有菜单配置文件是[menu.config.all.json](./menu.config.all.json)，该文件不要做修改，记录所有的菜单内容。
具体产品的配置在`/product_module/config`目录下，命名格式为`产品名.config.json`，同时保留一份`dev.config.json`作为开发时使用。
当前菜单只支持一级子菜单，支持父级菜单可点击。
例如
```
/user      --> user.html
/user/add  --> add.html
/user/edit --> edit.html
```
页面中菜单的顺序是按照配置文件中的顺序来的（理论上）。另外菜单会自动加上系统必须的几个内置菜单，这些暂时无法配置。

## `menu.config.all.json`配置
- json对象的`key` 用于标识模块名，取方便识别的单词
- `text` 页面中显示的菜单的文字
- `link` 菜单对应的链接地址，子菜单会加上父级菜单的`link`(parent.link+sub.link)
- `parent` 必须在有子菜单时使用，否则无效。用于决定当前父级菜单是否对应一个页面而不仅仅是父级菜单。
- `main` 菜单入口文件，如果存在子菜单，那么该入口文件的模板中必须存在`<router-view></router-view>`
- `subMain` 当`parent`为`true`时必须提供，表示当前父级菜单对应的页面的入口文件
- `subMenus` 配置子菜单，具体配置和父级相同，只有`link`会自动带上父级`link`

### 示例
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

## `config/product.config.json`配置
产品的配置文件中只需要配置简单的信息，然后根据`menu.config.all.json`配置去取具体配置，最后生成`src/component/menu/menu.json`和
`src/component/router.js`文件。产品的配置相对简单，在`required`字段下添加`menu.config.all.json`中模块的key值，如果有子模块就添加
```json
sub:{
  subModule:{}
}
```
目前配置的值都为空对象，作为后续保留使用。

### 示例
```json
{
  "required": {
    "chat": {},
    "form": {},
    "table": {},
    "sub-menu": {
      "sub": {
        "sub-menu-1": {}
      }
    }
  }
}
```

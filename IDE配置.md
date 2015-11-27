# PhpStorm/WebStorm开发配置
## 注册
PhpStorm的安装文件在[共享网盘](//192.168.10.250/share/devtools)里面，安装完成后注册时选择`License server`输入`http://idea.lanyus.com/`点击`OK`快速激活JetBrains系列产品。
## 主题
主题可自定义，可选择，推荐使用自带的`Monokai`主题。在`Settings` -> `Editor` -> `Colors & Fonts` -> `Font`中选择主题后点击`Save As...`保存一个自己的主题方案，然后在下面的`Editor Font` -> `Size`中将字体调大。  
另外这里提供一个[Material Theme](https://github.com/ChrisRM/material-theme-jetbrains)的UI。
## 插件
### 要求安装的插件
- `EditorConfig`
- `Emmet Everywhere`
- `MultiMarkdown`
- `Stylus support`
### 建议安装的插件
- `.gitignore`
- `YAML/Ansible support`
### 可选安装的插件
- `CoffeeLint`
- `coffeescript-idea`
## 工具配置和介绍
可参考[云淡然的系列文章](http://frontenddev.org/article/webstorm-portal-1-subject-and-match-colors.html)。
- 点击`Settings` -> `Editor` -> `Code Style`，修改前端文件`css`,`javascript`,`html`,`CoffeeScript`,`JSON`,`Stylus`等文件的`Tab adn Indents`全部为2。并且不要勾选`Use tab character`。
- 点击`Settings` -> `Languages & Frameworks` -> `JavaScript` -> `Libraries`添加项目所用的库文件。
- 点击`Settings` -> `Languages & Frameworks` -> `JavaScript` -> `Code Quality Tools` -> `JSHint`，勾选`Enable`,`Use config files`，启用目录里面的JSHint配置。
- 取消`Editor` -> `Code Style`里面的`Detect and use existing file indents for editing`和`Show notifications about detected indents`的勾选。
- 点击`Settings` -> `Editor` -> `Appearance`，勾选上右侧的`Show line numbers`。
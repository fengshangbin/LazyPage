# LazyPage

LazyPage make you have easy and lazy front develop, and fully decoupled front-end and back-end development  
LazyPage 让前端开发更简洁，彻底解耦前后端开发  
GitHub Pages: [https://github.com/fengshangbin/LazyPage](https://github.com/fengshangbin/LazyPage)

# 现实问题

两种常用开发模式  
1, 前端做静态页面，后端整合成 JSP/CSHTML 等前后端混合代码  
后期维护超麻烦， 前端看不懂后端的代码，后端又很难改前端的代码， 前后端同时维护一份文件时也容易出错。前端测试还得需要后端环境。真是剪不断理还乱。  
2, 前后端分离，前端用 Ajax 请求后端数据  
客户怒，MMP 我花钱做的网站怎么百度搜不到，搜索引擎爬虫很难爬取 Ajax 的数据，网站内容严重缺失  
前端怒，MMP 我一个页头和页尾无法公用，几十个页面一个个改页头页尾？  
如果这时对页面地址有要求如参数不能放在问号后面传递或者不要显示.html 扩展名，就没办法再前后端分离了。

# 关于 LazyPage

LazyPage 是一个前端开发框架，通过接入后端 LazyPage 插件实现后端直接渲染前端代码，不需要引入额外的 js 文件，帮助前端人员高质量高效率完成前端开发，让后端人员可以彻底远离前端代码可以专心提供数据接口。
主要特点  
1, 支持前后端彻底分离，前端可以自主任意定义页面地址，并且支持搜索引擎爬虫爬取完整网页内容。  
2, 前端采用模板渲染数据的方式，可以简单引用外部模板文件，简化代码，不用写一堆重复代码了。  
3, 模板脚本直接运行 JS 语言，不需要额外再学习一套模板语言。

# 关于 LazyPage-switch

LazyPage-switch 让多页也可以像单页一样做页面切换动画  
GitHub Pages: [https://github.com/fengshangbin/LazyPage-switch](https://github.com/fengshangbin/LazyPage-switch)

# 在线示例

[http://lazypage-switch.fengshangbin.com/](http://lazypage-switch.fengshangbin.com/)

# 如何使用

### 1. 渲染数据

```
<block source="{'name':'zhangsan', 'age':19, 'color': 'green'}">
	<div :style="'color:'+color">{{ name }}</div>
	<%if(age%2==1){%>
		<span>{{ age }}</span>
	<%}%>
</block>
```

注：Lazypage 使用了 art-template 作为模板渲染引擎

### 2. 外部数据和模板

```
<block source="/cgi/person.json" src="/include/_loadtemplete.html"></block>
```

### 3. 三种语法保证代码美观简洁

动态属性使用冒号前缀

```
<div :style="'color:'+color">...</div>
```

输出动态 html 使用双大括号

```
<span>{{ age }}</span>
```

执行 js 逻辑代码使用尖括号和百分号

```
<%if(age%2==1){%>
	...
<%}%>
```

### 4. 模板中 JS 脚本规则

因为模板脚本需要在后端编译，所以模板脚本不可以有 Dom,Window 的相关操作。  
如{{ window.innerWidth }}是不允许的

### 5. 自主任意定义页面地址

在文件命名里.html 前追加-即可隐藏扩展名访问，如 news-.html => http://localhost:8089/news  
在文件命名里+会转换为/访问，如 home+news-.html => http://localhost:8089/home/news  
在文件名里$会转换为可变值访问，如home+news+$-.html => http://localhost:8089/home/news/xxx

### 6. 启用配置文件

根目录创建 config.json 文件

```
{
  "config": {
    "api": "http://192.168.1.1"
  },
  "import": ["js/format.js"]
}
```

config 是全局配置变量 调用: \$config.api  
import 是加载全局函数 调用: \$import.format.toThousands 其中 toThousands 是外载 format.js 中定义的函数名

### 7. 使用地址栏参数

例 https://www.fengshangbin.com/tag/front/?key=lazypage  
{{ $query("key") }} => lazypage  
{{ $path(0) }} - {{ $path(1) }} => tag - front

# 关于前端测试

### 1. 安装 nodejs 环境

### 2. 安装依赖

lazypage-node

```
npm install --save-dev lazypage-node
```

express

```
npm install --save-dev express
```

### 3. 创建 server.js

```
var express = require('express');
var serverFilter = require('lazypage-node');

var app = express();
app.use(serverFilter.filter('src')); // src为当前项目前端代码目录
app.use(express.static('src'));

app.listen(8181, function() {
  console.log('start lazypage server，访问地址为 http://localhost:8181/');
});
```

### 4. 运行 server.js

cmd 命令

```
node server
```

访问地址为 http://localhost:8181/ 即可

### 5. 整合 webpack(热更新)

参见 [https://github.com/fengshangbin/LazyPage/tree/master/examples/lazypage-webpack](https://github.com/fengshangbin/LazyPage/tree/master/examples/lazypage-webpack)

### 6. 整合 gulp(热更新)

参见 [https://github.com/fengshangbin/LazyPage/tree/master/examples/lazypage-gulp](https://github.com/fengshangbin/LazyPage/tree/master/examples/lazypage-gulp)

# 后端整合

LazyPage 的后端整合只需简单一步  
1, java 请参见 [https://github.com/fengshangbin/LazyPage-java](https://github.com/fengshangbin/LazyPage-java)  
2, node.js 请参见 [https://github.com/fengshangbin/LazyPage-node.js](https://github.com/fengshangbin/LazyPage-node.js)  
3, c# 敬请期待  
4, 其他欢迎大家共建

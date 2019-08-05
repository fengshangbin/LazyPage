# LazyPage

LazyPage make you have easy and lazy front develop, and fully decoupled front-end and back-end development  
LazyPage 让前端开发更简洁，彻底解耦前后端开发  
GitHub Pages: https://github.com/fengshangbin/LazyPage

# 现实问题

两种常用开发模式  
1, 前端做静态页面，后端整合成 JSP/CSHTML 等前后端混合代码  
后期维护超麻烦， 前端看不懂后端的代码，后端又很难改前端的代码， 前后端同时维护一份文件时也容易出错。前端测试还得需要后端环境。真是剪不断理还乱。  
2, 前后端分离，前端用 Ajax 请求后端数据  
客户怒，MMP 我花钱做的网站怎么百度搜不到，搜索引擎爬虫很难爬取 Ajax 的数据，网站内容严重缺失  
前端怒，MMP 我一个页头和页尾无法公用，几十个页面一个个改页头页尾？  
如果这时对页面地址有要求如参数不能放在问号后面传递或者不要显示.html 扩展名，就没办法再前后端分离了。

# 关于 LazyPage

LazyPage 是一个前端框架，帮助前端人员高质量高效率完成前端开发，让后端人员可以彻底远离前端代码可以专心提供数据接口。纯原生，无任何依赖，超轻量级 GZip 后只有 3KB
主要特点  
1, 支持前后端彻底分离，前端可以自主任意定义页面地址，并且支持搜索引擎爬虫爬取完整网页内容。  
2, 前端采用模板渲染数据的方式，可以简单引用外部模板文件，简化代码，不用写一堆重复代码了。  
3, 模板脚本直接运行 JS 语言，不需要额外再学习一套模板语言。  
4, 降低服务器压力，减少服务器宽带占用，前端仅需请求静态结构页面和数据，由前端渲染数据并展现结果。  
5, 拥有“懒编译”模式，降低首屏 Dom 复杂度。

# 如何使用

引用 lazypage.js 到页面

```
<script src="js/lazypage.js"></script>
```

### 1. 渲染数据

静态数据，无外部模板

```
<script type="x-tmpl-lazypage" source="{'name':'Zhangsan','age':20}">
	<p>Hello, my name is <%=name%>. I'm <%=age%> years old.</p>
</script>
```

注：Lazypage 使用了百度前端模板渲染的 JS  
<%var name="Lisi"%>执行 JS 语句  
<%=name%>输出变量  
更多详情http://baidufe.github.io/BaiduTemplate/

外部数据，外部模板

```
<script type="x-tmpl-lazypage" source="cgi/person.json" src="include/_body.html"></script>
```

### 2. 外部模板文件命名

统一使用下划线开头， 如\_body.html

### 3. 懒编译

```
<script type="x-tmpl-lazypage" source="cgi/person.json" lazy="true" id="lazy-block">
	<p>Hello, my name is <%=name%>. I'm <%=age%> years old.</p>
</script>
```

当需要编译这个节点时调用

```
var person = document.getElementById("lazy-block");
LazyPage.runBlock(person, function(){
	console.log("lazy-block render over")
});
```

runBlock 方法，第二个参数为回调函数，默认为空

### 4. 依赖编译

有时 B 模块需要 A 模块的数据，这时 B 模块就依赖 A 模块了, 用 wait 属性表示依赖关系，多个依赖用空格分隔

```
<script type="x-tmpl-lazypage" source="cgi/listA.json" id="blockA">
	<p>list A count:<%=count%></p>
</script>
<script type="x-tmpl-lazypage" source="cgi/listB.json" wait="blockA">
	<p>list B count:<%=count%></p>
	<p>list total count:<%=count+{@blockA.count}%></p>
</script>
```

注：Lazypage 的数据源统一使用 json 格式，使用 {@被依赖模块 ID+引用数据} 来获取被依赖模块的数据

### 5. 请求数据接口参数

```
<script type="x-tmpl-lazypage" source="cgi/person.json" wait="blockA" ajax-type="post" ajax-data="id1=1&id2={&id}&id3={@blockA.count}">
	<p>Hello4, my name is <%=name%>. I'm <%=age%> years old.</p>
</script>
```

ajax-type 接口访问方式 get/post 默认 get  
ajax-data 接口参数，key=value, &隔开  
{&id}获取当前地址栏参数 id  
{\$0}获取当前地址栏路径参数  
{@blockA.count}获取依赖模块数据

### 6. 如何监听 Dom 渲染完成

```
LazyPage.ready(function(){
	//your js code
})
```

### 7. 关于多层嵌套渲染

<%%> 第二层数据用&替换%, 第三层用&&, 以此类推  
script 第二层用 jscript, 第三层用 jjscript, 以此类推

```
<script type="x-tmpl-lazypage" source="{'name':'Zhangsan1','age':21}">
	<p>Hello1, my name is <%=name%>. I'm <%=age%> years old.</p>
	<jscript type="x-tmpl-lazypage" source="{'name':'Zhangsan2','age':22}">
		<p>Hello2, my name is <&=name&>. I'm <&=age&> years old.</p>
		<jjscript type="x-tmpl-lazypage" source="{'name':'Zhangsan3','age':23}">
			<p>Hello3, my name is <&&=name&&>. I'm <&&=age&&> years old.</p>
		</jjscript>
	</jscript>
</script>
```

### 8. 模板中 JS 脚本规则

1, 因为模板脚本需要同时在后端编译，所以模板脚本不可以有 Dom,Window 的相关操作。  
如<%=window.innerWidth%>是不允许的  
2, 模板脚本中的函数调用，需要在后端注册调用函数所在的脚本文件。  
如 examples 的日期格式化函数 dataFormat，引用了 js/format.js 脚本文件，  
需要同时在后端注册这个脚本文件  
例 java 端代码

```java
String rootPath = context.getRealPath("");
LazyPage.addJsFile(rootPath+"/js/format.js");
```

### 9. 何时开启后端渲染

后端通过如果 Cookie 中没有包含 LazyPageSpider 项，则当前为搜索引擎爬虫访问  
所以正常的浏览器第一次访问也会开启后端渲染的

### 10. 自主任意定义页面地址

在文件命名里.html 前追加-即可隐藏扩展名访问，如 news-.html => http://localhost:8089/news  
在文件命名里+会转换为/访问，如 home+news-.html => http://localhost:8089/home/news  
在文件名里$会转换为可变值访问，如home+news+$-.html => http://localhost:8089/home/news/xxx  
这时模板参数 ajax-data="id={\$0}"会自动转换为 ajax-data="id=xxx"去编译

# 关于前端测试

由于支持加载外部模板和自定义路由，传统的双击测试 file://xx/x.html 会跨域报错，所以需要搭建一个简易的 http 环境  
结合 LazyPage-node.js 作为前端开发测试，参见https://github.com/fengshangbin/LazyPage-node.js  
Webpack 热编译模式参见 server.js，启动方式 npm run server

# 后端整合

LazyPage 的后端整合只需简单两部  
1, java 请参见 https://github.com/fengshangbin/LazyPage-java  
2, node.js 请参见 https://github.com/fengshangbin/LazyPage-node.js  
3, c# 敬请期待  
4, 其他欢迎大家共建

# 许可

MIT 许可

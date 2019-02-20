# LazyPage
LazyPage make you have easy and lazy front develop, and fully decoupled front-end and back-end development  
LazyPage 让前端开发更简洁，彻底解耦前后端开发
GitHub Pages: https://github.com/fengshangbin/LazyPage
# 现实问题
两种常用开发模式  
1, 前端做静态页面，后端整合成JSP/CSHTML等前后端混合代码  
后期维护超麻烦， 前端看不懂后端的代码，后端又很难改前端的代码， 前后端同时维护一份文件时也容易出错。前端测试还得需要后端环境。真是剪不断理还乱。  
2, 前后端分离，前端用Ajax请求后端数据  
客户怒，MMP我花钱做的网站怎么百度搜不到，搜索引擎爬虫很难爬取Ajax的数据，网站内容严重缺失  
前端怒，MMP我一个页头和页尾无法公用，几十个页面一个个改页头页尾？
# 关于LazyPage
LazyPage是一个前端框架，帮助前端人员高质量高效率完成前端开发，让后端人员可以彻底远离前端代码可以专心提供数据接口。纯原生，无任何依赖，超轻量级GZip后只有3KB
主要特点  
1, 可以引用外部模板文件  
2, 渲染数据，不用写一堆重复代码了  
3, 有对应的后端库，当搜索引擎爬虫爬取页面时后端编译数据并返回最终结果，解决Ajax无SEO的问题  
4, 降低服务器压力，减少服务器宽带占用，前端仅需请求静态结构页面和数据，由前端渲染数据并展现结果  
5, 拥有“懒编译”模式，降低首屏Dom复杂度
# 如何使用
引用lazypage.js到页面
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
注：Lazypage使用了百度前端模板渲染的JS  
<%var name="Lisi"%>执行JS语句  
<%=name%>输出变量  
更多详情http://baidufe.github.io/BaiduTemplate/  
  
外部数据，外部模板
```
<script type="x-tmpl-lazypage" source="cgi/person.json" src="include/_body.html"></script>
```
### 2. 懒编译
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
runBlock方法，第二个参数为回调函数，默认为空
### 3. 依赖编译
有时B模块需要A模块的数据，这时B模块就依赖A模块了, 用wait属性表示依赖关系，多个依赖用空格分隔
```
<script type="x-tmpl-lazypage" source="cgi/listA.json" id="blockA">
	<p>list A count:<%=count%></p>
</script>
<script type="x-tmpl-lazypage" source="cgi/listB.json" wait="blockA">
	<p>list B count:<%=count%></p>
	<p>list total count:<%=count+{@blockA.count}%></p>
</script>
```
注：Lazypage的数据源统一使用json格式，使用 {@被依赖模块ID+引用数据} 来获取被依赖模块的数据  
  
### 4. 请求数据接口参数
```
<script type="x-tmpl-lazypage" source="cgi/person.json" wait="blockA" ajax-type="post" ajax-data="id1=1&id2={&id}&id3={@blockA.count}">
	<p>Hello4, my name is <%=name%>. I'm <%=age%> years old.</p>
</script>
```
ajax-type 接口访问方式 get/post 默认get  
ajax-data 接口参数，key=value, &隔开  
{&id}获取当前地址栏参数id  
{@blockA.count}获取依赖模块数据  
  
### 5. 如何监听Dom渲染完成
```
LazyPage.ready(function(){
	//your js code
})
```
### 6. 关于多层嵌套渲染
<%%> 第二层数据用&替换%, 第三层用&&, 以此类推  
script 第二层用jscript, 第三层用jjscript, 以此类推
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
### 7. 模板中JS脚本规则
1, 因为模板脚本需要同时在后端编译，所以模板脚本不可以有Dom,Window的相关操作。  
如<%=window.innerWidth%>是不允许的  
2, 模板脚本中的函数调用，需要在后端注册调用函数所在的脚本文件。  
如examples的日期格式化函数dataFormat，引用了js/format.js脚本文件，  
需要同时在后端注册这个脚本文件  
例java端代码
```java
String rootPath = context.getRealPath("");
LazyPage.addJsFile(rootPath+"/js/format.js");
```
### 8. 何时开启后端渲染
后端通过如果Cookie中没有包含LazyPageSpider项，则当前为搜索引擎爬虫访问  
所以正常的浏览器第一次访问也会开启后端渲染的
# 关于前端测试
由于支持加载外部模板，传统的双击测试file://xx/x.html会跨域报错，所以需要搭建一个简易的http环境  
1, 安装node.js  
2, 拷贝examples目录下的run.js & run.bat到需要做测试的项目跟目录中  
3, 命令行 node run 或双击run.bat  
4, 浏览器访问 http://localhost:8089/{your.html}  
LazyPage不需要和后端整合即可开始前端测试
# 后端整合
LazyPage的后端整合只需简单两部  
第一步引用LazyPage后端对应语言的类库，第二步调用LazyPage初始化函数LazyPage.init()  
1, java 请参见 https://github.com/fengshangbin/LazyPage-java  
2, c# 敬请期待  
3, node.js 敬请期待  
4, 其他欢迎大家共建
# 许可
MIT许可
# LazyPage
LazyPage make you have easy and lazy front develop, and fully decoupled front-end and back-end development  
LazyPage 让前端开发更简洁，彻底解耦前后端开发
# 现实问题
两种常用开发模式  
1，前端做静态页面，后端整合成JSP/CSHTML等前后端混合代码  
后期维护超麻烦， 前端看不懂后端的代码，后端又很难改前端的代码， 前后端同时维护一份文件时也容易出错。前端测试还得需要后端环境。真是剪不断理还乱。  
2，前后端分离，前端用Ajax请求后端数据  
客户怒，MMP我花钱做的网站怎么百度搜不到，搜索引擎爬虫很难爬取Ajax的数据，网站内容严重缺失  
前端怒，MMP我一个页头和页尾无法公用，几十个页面一个个改页头页尾？
# 关于LazyPage
LazyPage是一个前端框架，帮助前端人员高质量高效率完成前端开发，让后端人员可以彻底远离前端代码可以专心提供数据接口。纯原生，无任何依赖，超轻量级GZip后只有3KB
主要特点  
1，可以引用外部模板文件  
2，渲染数据，不用写一堆重复代码了  
3，有对应的后端库，当搜索引擎爬虫爬取页面时后端编译数据并返回最终结果，解决Ajax无SEO的问题  
4，降低服务器压力，减少服务器宽带占用，前端仅需请求静态结构页面和数据，由前端渲染数据并展现结果
5，拥有“懒编译”模式，降低首屏Dom复杂度
# 如何使用
引用lazypage.js到页面
```
<script src="js/lazypage.js"></script>
```
渲染数据  
1，静态数据，无外部模板
```
<script type="x-tmpl-lazypage" source="{'name':'Zhangsan','age':20}}">
	<p>Hello, my name is <%=name%>. I'm <%=age%> years old.</p>
</script>
```
注：Lazypage使用了百度前端模板渲染的JS  
<%var name="Lisi"%>执行JS语句  
<%=name%>输出变量  
更多详情http://baidufe.github.io/BaiduTemplate/  
2，外部数据，外部模板
```
<script type="x-tmpl-lazypage" source="cgi/person.json" src="include/_body.html"></script>
```
3, 懒编译
```
<script type="x-tmpl-lazypage" source="cgi/person.json" lazy="true" id="lazy-block">
	<p>Hello, my name is <%=name%>. I'm <%=age%> years old.</p>
</script>
```
当需要编译这个节点时调用
```
var person = document.getElementById("lazy-block");
LazyPage.runBlock(person);
```
4, 依赖编译
有时B模块需要A模块的数据，这时B模块就依赖A模块了
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
5, 请求数据接口参数
```
<script type="x-tmpl-lazypage" source="cgi/person.json" wait="blockA" ajax-type="post" ajax-data="id1=1&id2={&id}&id3={@blockA.count}">
	<p>Hello4, my name is <%=name%>. I'm <%=age%> years old.</p>
</script>
```
ajax-type 接口访问方式 get/post 默认get  
ajax-data 接口参数，key=value, &隔开  
{&id}获取当前地址栏参数id
{@blockA.count}获取依赖模块数据

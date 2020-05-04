# LazyPage-java 应用示例

依赖

```
WEB-INF/lib/lazypage.jar
```

初始化 Lazypage

WebStartListener.java

```
public class WebStartListener implements ServletContextListener{

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO Auto-generated method stub

	}

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		// TODO Auto-generated method stub
		ServletContext context = sce.getServletContext();
		LazyPage.init(context);
	}

}
```

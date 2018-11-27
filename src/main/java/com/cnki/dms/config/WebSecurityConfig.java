package com.cnki.dms.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.config.annotation.InterceptorRegistration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

@Configuration
public class WebSecurityConfig extends WebMvcConfigurationSupport {

 
    private final  DMSInterceptor dmsInterceptor;
    
    
    public WebSecurityConfig(DMSInterceptor dmsInterceptor) {
		// TODO Auto-generated constructor stub
    	this.dmsInterceptor = dmsInterceptor;
	}

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        /**
         * 添加HTML的视图解析器
         * 本示例完成以下功能：将Controller返回的String类型的视图名称添加前缀及后缀；
         * 如返回的是a，那么处理后对应的视图将会是/a.html
         */
        registry.viewResolver(new InternalResourceViewResolver("/pages/", ".html"));
    }
    /**
     * 跳转登录页
     * @param registry
     */
	@Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("login");
        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
        
    } 
    
    /**
     * 拦截器
     */
	@Override
    public void addInterceptors(InterceptorRegistry registry) {
        InterceptorRegistration addInterceptor = registry.addInterceptor(dmsInterceptor);
        //拦截所有路径
        addInterceptor.addPathPatterns("/**");
        //排除的路径
        addInterceptor.excludePathPatterns("/error");
        addInterceptor.excludePathPatterns("/login**");
        addInterceptor.excludePathPatterns("/login/checkPic**");
        addInterceptor.excludePathPatterns("/login/loginVerify**");
        addInterceptor.excludePathPatterns("/static/**");
        
    }
    /**
     * 配置静态资源
     * @param registry
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
    	registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
    	// TODO Auto-generated method stub
    }
    
  
}

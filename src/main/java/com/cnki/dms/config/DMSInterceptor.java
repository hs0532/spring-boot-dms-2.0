package com.cnki.dms.config;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.cnki.dms.bean.DMSConstant;

/**
 * 重写preHandle
 * 
 * @author to
 *
 */
@Component
public class DMSInterceptor implements HandlerInterceptor {
	
	
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		// TODO Auto-generated method stub
		HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
	}
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		// TODO Auto-generated method stub
		HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
	}	
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws IOException {
		HttpSession httpSession = request.getSession();
		if (httpSession.getAttribute(DMSConstant.SESSION_KEY_USERNAME) != null) {
			return true;
		}

		// 跳转到登录页
		response.sendRedirect("/login");

		return false;
	}
}

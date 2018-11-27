package com.cnki.dms.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cnki.api.User;
import com.cnki.dms.bean.DMSConstant;
import com.cnki.dms.service.UserService;


/**
 * 用户controller
 * @author to
 *
 */

@Controller
public class MainController {
	
	@Autowired
	private UserService userservice;
	
	/**
	 * 登录用户名密码以及验证码校验
	 * @param username    用户名
	 * @param password	      密码
	 * @param checkcode	      验证码
	 * @param httpSession Session
	 * @param response    response
	 * @return            返回结果
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="loginVerify",method=RequestMethod.POST)
	@ResponseBody
	public Map verifyLogin(String username,String password,String checkcode ,HttpSession httpSession,HttpServletResponse response){	
		// user对象
		User user = new User();
		user.setPassword(password);
		user.setUserName(username);
		// 返回map
		Map mapVerify = new HashMap();
		// 获取验证码
		String strImgCode = (String) httpSession.getAttribute(DMSConstant.LOGIN_CHECK_IMG_CODE);
		// 验证验证码是否为空
		if(checkcode !=null &&!"".equals(checkcode)){
			// 验证验证码是否过期
			if(strImgCode !=null &&!"".equals(strImgCode)){
				// 校验验证码
				if(!checkcode.equalsIgnoreCase(strImgCode)){
					mapVerify.put("errorCode", "7001");
					mapVerify.put("message", "验证码错误");
					mapVerify.put("isSuccess", false);
					return mapVerify;
				}else{
					
					Cookie cookie = new Cookie("username",username);
					// 验证用户名密码
					mapVerify = userservice.verifyLogin(user,httpSession);
					// 存放用户名
					if((Boolean) mapVerify.get("isSuccess")){
						httpSession.setAttribute(DMSConstant.SESSION_KEY_USERNAME, username);
						cookie.setPath("/");
					    cookie.setMaxAge(3600);
					    response.addCookie(cookie);
					}
					return mapVerify;
				}
			}else{
				mapVerify.put("errorCode", "7000");
				mapVerify.put("message", "验证码失效");
				mapVerify.put("isSuccess", false);
				return mapVerify;
			}
			
		}else{
			mapVerify.put("errorCode", "");
			mapVerify.put("message", "验证码不为空");
			mapVerify.put("isSuccess", false);
			return mapVerify;
		}

	
	}


	/**
	 * 主页controller
	 * @return
	 */
	@RequestMapping(value="main")
	public String main(HttpServletRequest httpServletRequest,Model model){	
		Cookie[] cookies =  httpServletRequest.getCookies();
	    if(cookies != null){
	        for(Cookie cookie : cookies){
	            if(cookie.getName().equals("username")){
	            	model.addAttribute("username", cookie.getValue());
	            }
	        }
	    }
		return "main";
	}
	
	


	
}

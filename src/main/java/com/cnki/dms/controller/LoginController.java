package com.cnki.dms.controller;

import java.awt.image.BufferedImage;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cnki.api.User;
import com.cnki.dms.bean.DMSConstant;
import com.cnki.dms.service.UserService;
import com.cnki.dms.util.ImageUtil;

/**
 * 登录
 * @author to
 *
 */
@Controller
@RequestMapping("login")
public class LoginController {
	
	@Autowired
	private UserService userservice;
	
	/**
	 * 登陆页面
	 * @return
	 */
	@GetMapping("")
	public String excute(){
		System.out.println("login+++重定向");
		return "login";
	}


	/**
	 * 退出登录接口
	 * @param httpSession
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value="exit")
	@ResponseBody
	public Map userExit(HttpSession httpSession){	
		Map mapResult = new HashMap();
		httpSession.removeAttribute(DMSConstant.SESSION_KEY_USERNAME);
		mapResult.put(DMSConstant.RETURN_SUCCESS, true);
		return mapResult;
	}
	
	/**
	 * 生成验证码，该接口不拦截
	 * @param response
	 * @param session
	 * @throws Exception
	 */
	@RequestMapping(value="checkPic") 
	public void checkPic( HttpServletResponse response,HttpSession session) throws Exception{
		// 利用图片工具生成图片
		// 第一个参数是生成的验证码，第二个参数是生成的图片
		Object[] objs = ImageUtil.createImage();
		// 将验证码存入Session
		session.setAttribute(DMSConstant.LOGIN_CHECK_IMG_CODE,objs[0]);
		// 将图片输出给浏览器
		BufferedImage image = (BufferedImage) objs[1];
		response.setContentType("image/png");
		OutputStream os = response.getOutputStream();
		ImageIO.write(image, "png", os);
		
	}
	
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
	public Map verifyLogin( String username,String password,String checkcode ,HttpSession httpSession,HttpServletResponse response){	
		// user对象
		User user = new User();
		user.setPassword(password);
		user.setUserName(username);
		// 返回map
		Map mapVerify = new HashMap();
		// 获取验证码
		String strImgCode = (String) httpSession.getAttribute(DMSConstant.LOGIN_CHECK_IMG_CODE);
		// 验证验证码是否为空
		if (checkcode != null && !"".equals(checkcode)) {
			// 验证验证码是否过期
			if (strImgCode != null && !"".equals(strImgCode)) {
				// 校验验证码
				if (!checkcode.equalsIgnoreCase(strImgCode)) {
					mapVerify.put(DMSConstant.RETURN_MESSAGE, "7001");
					mapVerify.put(DMSConstant.RETURN_SUCCESS, false);
					return mapVerify;
				} else {

					Cookie cookie = new Cookie("username", username);
					// 验证用户名密码
					mapVerify = userservice.verifyLogin(user, httpSession);
					// 存放用户名
					if ((Boolean) mapVerify.get(DMSConstant.RETURN_SUCCESS)){
						httpSession.setAttribute(DMSConstant.SESSION_KEY_USERNAME, username);
						httpSession.setAttribute(DMSConstant.SESSION_KEY_USERINFO, mapVerify.get("userinfo"));
						cookie.setPath("/");
						cookie.setMaxAge(3600);
						response.addCookie(cookie);
					}
					return mapVerify;
				}
			}else{
				mapVerify.put(DMSConstant.RETURN_MESSAGE, "7000");
				mapVerify.put(DMSConstant.RETURN_SUCCESS, false);
				return mapVerify;
			}
			
		}else{
			mapVerify.put("errorCode", "");
			mapVerify.put(DMSConstant.RETURN_MESSAGE, "验证码不为空");
			mapVerify.put(DMSConstant.RETURN_SUCCESS, false);
			return mapVerify;
		}
		
	
	}
	

	
}

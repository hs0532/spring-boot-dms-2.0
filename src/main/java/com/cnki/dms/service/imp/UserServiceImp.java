package com.cnki.dms.service.imp;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cnki.api.User;
import com.cnki.dms.bean.DMSConstant;
import com.cnki.dms.dao.UserDao;
import com.cnki.dms.service.UserService;
import com.cnki.dms.util.MD5Util;

@Service
public class UserServiceImp implements UserService {

	@Autowired
	private UserDao userdao;
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public Map verifyLogin(User user,HttpSession httpSession) {
		
		Map mapResult = new HashMap();
		try {
			User verifyUser = userdao.queryUser(user,httpSession);
			if(verifyUser != null && !"".equals(verifyUser.getPassword())){
				
				String strPasswordNew = MD5Util.toMd5(user.getPassword() + user.getUserName())
						.substring(DMSConstant.PASSWORD_BEGIN, DMSConstant.PASSWORD_LANG);
				String strPasswordOld = verifyUser.getPassword();
				System.out.println(user.getUserName()+"   "+ strPasswordNew+"  "+strPasswordOld);
				if(strPasswordNew.equals(strPasswordOld)){
					mapResult.put("isSuccess", true);
				}else{
					mapResult.put("isSuccess", false);
					mapResult.put("message", "密码错误");
				}
				
			}else{
				mapResult.put("isSuccess", false);
				mapResult.put("message", "用户名不存在");
				
			}
			mapResult.put("userfo",verifyUser);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			mapResult.put("isSuccess", false);
			mapResult.put("message", "验证失败，请联系管理员");
		}
		
		// TODO Auto-generated method stub
		return mapResult;
	}
	

}
